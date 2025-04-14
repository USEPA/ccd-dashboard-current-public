<template>
  <div class="mr-4">
    <div class="h2">
      <ccte-help-text
        data-cy="SimilarCompoundsHeader"
        label-type="span"
        :heading-text="headingText"
        help-key="SimilarCompoundsHeader"
      />
    </div>
    <client-only>
      <export-modal
        :title="title"
        :visibility="showExportModal"
        :export-download-link="exportDownloadLink"
        @toggleVisibility="showHideExportModal"
      />
      <Results
        :row-data="chemicals"
        :cname="cname"
        :custom-sort="customSort"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        grid-reference="results"
        grid-heading="Searched with a similarity threshold of"
        @gridRef="onGridRef"
        @exportData="onExportData"
      />
    </client-only>
  </div>
</template>

<script>

import {
  mapGetters, mapMutations, mapState,
} from 'vuex';
import ExportModal from '~/components/batch-search/ExportModal.vue';
import Results from '~/components/results/Results.vue';
import toolbarConfig from './toolbar_config.json';

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (currentChem.dtxsid === data.params.id || currentChem.dtxcid === data.params.id) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical', data, data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'SimilarCompoundsView',
  components: {
    Results,
    ExportModal,
  },
  data() {
    return {
      id: this.$route.params.id,
      gridConfigurationObj: {},
      gridSize: 'height: 600px; overflow:auto',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      exportColDefs: [],
      customSort: {
        colId: 'similarity',
        sort: 'desc',
      },
      filterModel: [],
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      active: 'similar-molecules',
      tanimoto: 0.8,
      batchObj: {},
      showExportModal: false,
      exportDownloadLink: '',
      finalExportJobId: '',
      exportStatus: null,
      pollInterval: null,
      title: 'Exporting in progress',
      chemicalsToSubmit: [],
      molVersion: '',
    };
  },
  computed: {
    ...mapGetters({
      getGridDefs: 'similarCompounds/getGridDefs',
      getExportColDefs: 'similarCompounds/getExportColDefs',
    }),
    headingText() {
      const textStr = `Searched with a similarity threshold of ${this.tanimoto ? this.tanimoto : '0.8'}`;
      return textStr;
    },
  },
  watch: {
    exportStatus(newStatus) {
      if (newStatus === true) {
        this.exportDownloadLink = `${process.env.APPLICATION_BASE_API}${this.apiSettings().BATCH_SEARCH_EXPORT_CONTENT_API}${this.finalExportJobId}`;
      }
    },
  },
  async asyncData(context) {
    let chemicals = [];
    let chemical;
    try {
      chemical = await context.app.store.state.results.activeChemical;
      // chemical.dtxsid = chemical.dsstoxSubstanceId
      const encoded = encodeURIComponent(chemical.smiles);
      const response = await context.app.$repositories.similarCompounds.search(`${chemical.dsstoxCompoundId}/0.8?smiles=${encoded}`);
      if (response.length) {
        chemicals = response.map((chem, idx) => ({
          ...chem, uuId: idx + 1, preferredName: chem.preferredName || chem.iupacName,
        }));
      }
    } catch (e) {
      context.$sentry.captureMessage(`Similar molecules data retrieval error. dtxsid:$${chemical.dsstoxCompoundId} :  ${e}`);
    }
    return {chemicals, chemical};
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Similar Compounds`,
      meta: [],
    };
  },
  beforeCreate() {
    if (this.$route.query.list) {
      this.$store.dispatch('results/fetchChemicals', 'chemicallists');
    } else {
      this.$store.dispatch('results/fetchChemicals', 'assayChemicals');
    }
  },
  created() {
    this.setSortOptions(toolbarConfig.sortOptions);
    this.setFilterOptions(toolbarConfig.filterOptions);
    this.setTileInfoOptions(toolbarConfig.tileInfoOptions);
    this.setFilterModel(this.filterModel);
  },
  beforeMount() {
    this.columnDefs = this.getGridDefs();
    this.columnDefs = this.columnDefs.map((col) => {
      if (col.children) {
        col.children.map((child) => {
          if (child.valueFormatter) {
            child.valueFormatter = this[child.valueFormatter];
          }
          if (child.valueGetter) {
            child.valueGetter = this[child.valueGetter];
          }
          return child;
        });
      }
      if (col.valueFormatter) {
        col.valueFormatter = this[col.valueFormatter];
      }
      if (col.valueGetter) {
        col.valueGetter = this[col.valueGetter];
      }
      if (col.getQuickFilterText) {
        col.getQuickFilterText = this[col.getQuickFilterText];
      }
      return col;
    });
    this.columnDefs.push({
      headerName: 'Similarity',
      minWidth: 90,
      maxWidth: 135,
      width: 95,
      floatingFilterComponentParams: {suppressFilterButton: false},
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'similarity',
      suppressMenu: true,
      valueFormatter: this.similarityValue,
      filterValueGetter: this.similarityValue,
    });
    this.exportColDefs = this.getExportColDefs();
    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridOptions: {
        unSortIcon: true,
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          roundTo2: this.roundTo2,
          roundTo6: this.roundTo6,
          formatPreferredName: this.formatPreferredName,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
        },
        valueCache: true,
        suppressContextMenu: true,
        enableCellTextSelection: true,
        ensureDomOrder: true,
        rowHeight: 100,
        tooltipShowDelay: 500,
        rowSelection: 'multiple',
        headerHeight: 60,
      },
    };
    this.gridConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
  },
  methods: {
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setFilterModel: 'results/setFilterModel',
    }),

    onExportData(params) {
      const timeStamp = this.dateFormat();
      if (params.fileType === 'sdf2' || params.fileType === 'sdf3') {
        switch (params.fileType) {
        case 'sdf2':
          this.molVersion = 'V2000';
          break;
        case 'sdf3':
          this.molVersion = 'V3000';
          break;

        default:
          this.molVersion = 'V2000';
          break;
        }
        this.startBatchExport();
      } else {
        this.exportData({
          fileName: `${this.chemical.preferredName}-Similar Compounds-${timeStamp}`,
          gridApi: this.gridApi,
          fileFormat: params.fileType,
          columns: this.exportColDefs,
          splitSheet: {xSplit: 1, ySplit: 1},
        });
      }
    },


    startInterval(exportJobId) {
      this.pollInterval = setInterval(() => {
        this.fetchData(exportJobId);
      }, 5000);
    },


    async startBatchExport() {
      this.batchObj = {
        identifierTypes: [
          'chemical_name',
          'CASRN',
          'INCHIKEY',
          'dtxsid',
        ],
        massError: 0,
        downloadItems: [
          'CASRN',
          'INCHIKEY',
          'IUPAC_NAME',
          'SMILES',
          'INCHI_STRING',
          'MOLECULAR_FORMULA',
          'AVERAGE_MASS',
          'MONOISOTOPIC_MASS',
          'DTXSID',
          'PREFERRED_NAME',
          'MOL_FILE',
        ],
        searchItems: '',
        inputType: 'IDENTIFIER',
        downloadType: 'SDF',
        molVersion: this.molVersion,
      };

      this.exportDownloadLink = '';
      this.finalExportJobId = null;
      this.exportStatus = false;
      const hasSelectedRows = this.gridApi.getSelectedRows().length > 0;
      this.gridApi.forEachNodeAfterFilterAndSort((node, index) => {
        if (((hasSelectedRows && (node.data.selected || node.selected))) || !hasSelectedRows) {
          this.chemicalsToSubmit.push(node.data.dtxsid);
        }
      });

      this.batchObj.searchItems = this.chemicalsToSubmit.join('\n');
      const exportJobId = await this.$repositories.batchSearch.startBatchSearchExportJob(this.batchObj);
      this.showExportModal = true;

      this.fetchData(exportJobId);
      // check if the status is completed, if not fetch data every 10 secs
      if (this.exportStatus !== true) {
        this.startInterval(exportJobId);
      }
    },

    fetchData(exportJobId) {
      const statusURL = `${process.env.APPLICATION_BASE_API}${this.apiSettings().BATCH_SEARCH_EXPORT_STATUS_API}${exportJobId}?${Date.now().toString(36)}`;
      this.$axios.get(statusURL)
        .then((response) => {
          // check if status is completed, if it is stop polling
          if (response.data === true) {
            clearInterval(this.pollInterval);
            this.exportStatus = response.data;
            this.finalExportJobId = exportJobId;
          }
          this.exportStatus = response.data;
        });
    },

    showHideExportModal() {
      this.showExportModal = !this.showExportModal;
    },

    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },

    customSortApplied() {

    },
  },
};
</script>
<style lang="scss">
  @import "~/assets/styles/global-styles/agGrid.scss";
</style>

