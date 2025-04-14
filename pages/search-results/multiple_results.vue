<template>
  <client-only>
    <div class="content left-fullwidth-container">
      <div class="h2">
        <ccte-help-text
          data-cy="SearchResults"
          label-type="span"
          :heading-text="`Search Results`"
          help-key="SearchResults"
        />
      </div>
      <div class="card">
        <div class="card-body">
          <p class="ml-3" data-cy="searched-with">
            <span class="card-text"> {{ searchTerm }}</span>
          </p>
        </div>
      </div>
      <export-modal
        :title="title"
        :visibility="showExportModal"
        :export-download-link="exportDownloadLink"
        @toggleVisibility="showHideExportModal"
      />
      <Results
        :row-data="chemicals"
        :cname="cname"
        :loading="isLoading"
        :percent-done="percentDone"
        :chunk-data="chunkData"
        :grid-size="gridSize"
        :custom-sort="customSort"
        :config-obj="gridConfigurationObj"
        grid-reference="results"
        grid-heading="Search Results"
        @gridRef="onGridRef"
        @exportData="onExportData"
      />
    </div>
  </client-only>
</template>

<script>
/* eslint-disable no-case-declarations */

import {
  mapGetters, mapMutations, mapState,
} from 'vuex';
import ExportModal from '~/components/batch-search/ExportModal.vue';
import Results from '~/components/results/Results.vue';


export default {
  name: 'SearchResultsPage',
  components: {
    Results,
    ExportModal,
  },
  data: () => ({
    gridConfigurationObj: {},
    gridSize: 'height: 600px; overflow:auto',
    cname: {
      camelName: 'results',
      hyphenName: 'results',
      baseName: 'Results',
    },
    exportColDefs: [],
    isLoading: false,
    chunkData: [],
    percentDone: 0,
    additionalTileOptions: [],
    customSort: {},

    batchObj: {},
    showExportModal: false,
    exportDownloadLink: '',
    finalExportJobId: '',
    exportStatus: null,
    pollInterval: null,
    title: 'Exporting in progress',
    chemicalsToSubmit: [],
    molVersion: '',

  }),
  computed: {
    ...mapGetters({
      getGridDefs: 'chemicalResultsConfig/getBaseGridDefs',
      getExportColDefs: 'chemicalResultsConfig/getExportColDefs',
      getToolBar: 'chemicalResultsConfig/getBaseToolBar',
      getTileInfo: 'results/getTileInfo',
    }),
    massTotal() {
      const adducts = parseFloat(this.$route.query.mass_adducts) || 0;
      return parseFloat(this.$route.query.mass) + adducts;
    },
    minMaxMassTotal() {
      const adducts = parseFloat(this.$route.query.mass_adducts) || 0;
      const formattedMassRange = `${parseFloat(this.$route.query.min) + adducts} to ${parseFloat(this.$route.query.max) + adducts} `;
      return formattedMassRange;
    },
    searchTerm() {
      let headText = '';
      const text = this.formulaListDisplay;

      headText = 'Searched for MS Ready Formula(e)';

      return `${headText}: ${text}`;
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
    let inputType = context.query.input_type || '';
    if (!context.query.inputs) {
      inputType = '';
    }
    let chemicals = [];
    let formulaListDisplay = '';
    let formulaListArray = [];
    let currentCount = 0;
    const additionalTileOptions = [];
    const additionalSortOptions = [];
    const additionalColumns = [];


    let hasPagedOption = false;
    const altTileInfo = [];
    const preferredSort = [];

    switch (inputType) {
    case 'ms_ready_formula':
      hasPagedOption = true;
      formulaListArray = typeof context.query.inputs === 'string' ? Array.of(context.query.inputs) : context.query.inputs;

      formulaListDisplay = formulaListArray.join(', ');
      const firstFormula = formulaListArray[0];
      const params = {
        formula: firstFormula,
        currentCount: currentCount,
      };
      const chunk = await context.app.$repositories.chemicalSearch.msReadySearch(params);
      chemicals = chunk.content;
      currentCount = chunk.currentCount;

      break;

    default:
      chemicals = [];
    }
    return {
      chemicals,
      currentCount,
      loading: false,
      inputType: inputType,
      formulaListDisplay,
      formulaListArray,
      additionalTileOptions,
      additionalSortOptions,
      additionalColumns,
      hasPagedOption,
      altTileInfo,
      preferredSort,
    };
  },
  created() {
    let baseSortOptions = this.getToolBar().sortOptions;
    if (this.additionalSortOptions.length > 0) {
      baseSortOptions = baseSortOptions.concat(this.additionalSortOptions);
    }
    this.setSortOptions(baseSortOptions);

    this.setFilterOptions(this.getToolBar().filterOptions);
    this.setTileInfoOptions(this.getToolBar().tileInfoOptions);
    let baseToolInfoOptions = this.getToolBar().tileInfoOptions;
    if (this.additionalTileOptions.length > 0) {
      baseToolInfoOptions = baseToolInfoOptions.concat(this.additionalTileOptions);
    }
    this.setTileInfoOptions(baseToolInfoOptions);

    this.setFilterModel(['multicomponent']);
  },
  beforeMount() {
    if (this.altTileInfo.length > 0) {
      this.setTileInfo(this.altTileInfo);
    }
    if (this.preferredSort.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      this.customSort = this.preferredSort[0];
    }

    this.exportColDefs = this.getExportColDefs();
    this.colDefs = this.getGridDefs();
    if (this.additionalColumns.length > 0) {
      this.colDefs = this.colDefs.concat(this.additionalColumns);
    }
    this.colDefs = this.colDefs.map((col) => {
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

    this.gridConfigurationObj = {
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridColumnDefs: this.colDefs,
      gridOptions: {
        suppressContextMenu: true,
        rowHeight: 100,
        rowSelection: 'multiple',
        headerHeight: 50,
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          roundTo6: this.roundTo6,
          formatPreferredName: this.formatPreferredName,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
          toxcastPercent: this.toxCastPercent,
        },
      },
    };
  },
  methods: {
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setFilterModel: 'results/setFilterModel',
      setTileInfo: 'results/setTileInfo',
    }),

    async getChemicalChunks() {
      this.isLoading = true;

      const percentChunk = Math.ceil(100 / this.formulaListArray.length);
      this.percentDone = percentChunk;

      try {
        for (let index = 1; index < this.formulaListArray.length; index += 1) {
          const params = {
            formula: this.formulaListArray[index],
            currentCount: this.currentCount,
          };
          // eslint-disable-next-line no-await-in-loop
          const response = await this.$repositories.chemicalSearch.msReadySearch(params);

          this.chunkData = response.content;
          this.currentCount = response.currentCount;
          this.percentDone += percentChunk;
        }
      } catch (ex) {
        this.$sentry.captureMessage(`multiple_results - error getting chunked data ${ex.toString()}`);
      }
      this.isLoading = false;
    },
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
          fileName: `SearchResults-${timeStamp}`,
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
          // console.log('RESPONSE FROM FETCH STATUS', response.data)
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

      if (this.hasPagedOption) {
        this.getChemicalChunks();
      }
    },
  },
};
</script>
