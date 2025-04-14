<!-- eslint-disable vue/return-in-computed-property -->
<!-- eslint-disable indent -->
<template>
  <mdb-container v-if="chemListComputed" fluid class="content left-fullwidth-container pl-0 pr-0">
    <div class="">
      <ccte-help-text
        data-cy="ChemicalList"
        label-type="h1"
        :heading-text="`${chemListComputed.label}`"
        help-key="ChemicalListHeader"
      />
    </div>

    <chemical-search
      data-cy="chemical-search"
      :cname="'ChemicalSearch'"
      :placeholder="'Search for chemical by systematic name, synonym, CAS number, DTXSID or InChIKey'"
      :override-enter="true"
      :chemical-list="$route.params.id"
      @chemical-search="handleChemicalSearch"
    />
    <mdb-accordion class="assayAccordion" table>
      <mdb-accordion-pane
        title="List Details"
        class=" py-0 px-0 m-0"
        type="table"
        :is-open="detailsOpen"
        @pane-clicked="togglePane('detailsOpen')"
      >
        <div class="card">
          <div class="card-body">
            <p class="ml-0">
              <span class="card-title">Description: </span>
              <span
                v-if="chemListComputed.longDescription.length > 0"
                class="card-text ml-3"
                data-cy="chemListDescription"
                v-html="chemListComputed.longDescription"
              />
              <span
                v-else
                class="card-text ml-3"
                data-cy="chemListDescription"
                v-html="chemListComputed.shortDescription "
              />
            </p>
            <p class="ml-0">
              <span class="card-title">Number of Chemicals: </span>
              <span class="card-text ml-3">
                {{ chemListComputed.chemicalCount }}
              </span>
            </p>
          </div>
        </div>
      </mdb-accordion-pane>
    </mdb-accordion>
    <export-modal
      :title="title"
      :visibility="showExportModal"
      :export-download-link="exportDownloadLink"
      @toggleVisibility="showHideExportModal"
    />
    <Results
      :row-data="chemicals"
      :loading="isLoading"
      :percent-done="percentDone"
      :chunk-data="chunkData"
      :cname="cname"
      :grid-size="gridSize"
      :config-obj="gridConfigurationObj"
      :copy-url-config="copyUrlConfig"
      :chem-list-substring="chemListSubstring"
      :csearch="csearch"
      grid-reference="chemicalLists"
      grid-heading="Chemical Lists"
      @gridRef="onGridRef"
      @exportData="onExportData"
    />
  </mdb-container>
</template>
<script>
import {
  mdbContainer, mdbAccordion, mdbAccordionPane,
} from 'mdbvue';
import {
  mapGetters, mapMutations,
} from 'vuex';

import ExportModal from '~/components/batch-search/ExportModal.vue';
import Results from '~/components/results/Results.vue';
import ChemicalSearch from '~/components/homepageSearch/ChemicalSearch.vue';


export default {
  name: 'ChemicalListPage',
  components: {
    mdbContainer,
    mdbAccordion,
    mdbAccordionPane,
    ExportModal,
    Results,
    ChemicalSearch,
  },
  async validate(data) {
    let chemList = data.store.state.chemicalLists.chemicalLists;
    if (data.params.id) {
      if (!Array.isArray(chemList) || chemList.length < 1) {
        chemList = await data.store.dispatch('chemicalLists/asyncChemicalLists', data, data);
      }
      if (Array.isArray(chemList)) {
        return true;
      }
      return false;
    }
    return false;
  },
  data() {
    return {
      id: this.$route.params.id,
      detailsOpen: true,
      gridConfigurationObj: {},
      gridSize: 'height: 600px; width:99%;',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      exportColDefs: [],
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      isLoading: false,
      chunkData: [],
      percentDone: 0,
      copyUrlConfig: {
        copy: true,
        copyButtonTipText: 'Copy Url',
      },

      batchObj: {},
      showExportModal: false,
      exportDownloadLink: '',
      finalExportJobId: '',
      exportStatus: null,
      pollInterval: null,
      title: 'Exporting in progress',
      chemicalsToSubmit: [],
      molVersion: '',
      showResetList: false,
      missedChemicals: 0,
      chemicalLoadError: false,
    };
  },
  computed: {
    ...mapGetters({
      getGridDefs: 'chemicalListDetailsConfig/getBaseGridDefs',
      getExportColDefs: 'chemicalListDetailsConfig/getExportColDefs',
      getToolBar: 'chemicalResultsConfig/getBaseToolBar',
      getChemicalLists: 'chemicalLists/getChemicalLists',
      getFiltered: 'chemicalLists/getFiltered',
      getChemicals: 'results/getFilteredChemicals',
      getOriginalChemicals: 'results/getOriginalChemicals',
    }),
    chemListComputed() {
      const chem = this.getFiltered(this.$route.params.id);
      if (chem.length > 0) {
        return chem[0];
      }
      return false;
    },
    chemListSubstring() {
      const filtered = this.getFiltered(this.$route.params.id);
      if (filtered.length > 0) {
        return filtered[0].substring;
      }
      return false;
    },
    csearch() {
      let searchStr = '';
      if (this.$route.query.search) {
        searchStr = this.$route.query.search;
      }
      return searchStr;
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
    const listId = `?name=${encodeURIComponent(context.route.params.id)}`;
    const chunk = (arr, size) => Array
      .from({length: Math.ceil(arr.length / size)}, (v, i) => arr.slice(i * size, i * size + size));
    const getDtxsidDetails = await context.app.$repositories
      .chemicalList.detailsDtxsids(encodeURIComponent(context.route.params.id), context.$sentry);
    let getListDetails = '';
    let chunked = [];
    if (getDtxsidDetails.length > 1000) {
      chunked = chunk(getDtxsidDetails, 1000);
      getListDetails = await context.app.$repositories.chemicalList.listDetailsDtxsids(chunked[0], 0, context.$sentry);
    } else {
      getListDetails = await context.app.$repositories.chemicalList.listDetailsDtxsids(getDtxsidDetails, 0, context.$sentry);
    }

    return {chemicals: getListDetails, chunks: chunked};
  },
  created() {
    this.setFilterOptions(this.getToolBar().filterOptions);
    this.setSortOptions(this.getToolBar().sortOptions);
    this.setTileInfoOptions(this.getToolBar().tileInfoOptions);
    this.$nuxt.$on('zoomImage', (data) => {
      this.imagePath = data.image;
      this.showImageZoom = true;
    });
  },
  beforeMount() {
    if (!this.chemListComputed) {
      this.$store.$router.push({path: `/chemical-lists?filtered&search=${this.$route.params.id}&notFound=true`});
    }
    this.columnDefs = this.getGridDefs();
    this.columnDefs.push({
      headerName: 'InchiString',
      valueGetter: this.splitInchi,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    });
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
    const newArr = this.getExportColDefs();
    newArr.forEach((item) => {
      if (item.key !== 'massDiff') {
        this.exportColDefs.push(item);
      }
    });

    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        autoHeight: true,
        sortable: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
        floatingFilter: true,
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
          formatPreferredName: this.formatPreferredName,
          roundTo6: this.roundTo6,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
        },
        valueCache: true,
        suppressContextMenu: true,
        rowHeight: 110,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        headerHeight: 50,
      },
    };

    this.gridConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
  },
  mounted() {
    this.$nuxt.$on('resetChemicaLlist', this.resetList);
  },
  methods: {
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      addChemicals: 'results/addChemicals',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setChemicalListFilteredChemicals: 'results/setChemicalListFilteredChemicals',
      resetChemicalListChemicals: 'results/resetChemicalListChemicals',
      setFilterModel: 'results/setFilterModel',
    }),
    resetList() {
      this.chemicals = this.getOriginalChemicals();
      this.resetChemicalListChemicals();
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

          fileName: `Chemical List ${this.id}-${timeStamp}`,
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
      this.getChemicalChunks();
    },

    async getChemicalChunks() {
      // set inital chemicals
      this.setChemicals(this.chemicals);
      this.isLoading = true;
      const percentChunk = parseInt(100 / this.chunks.length, 10);
      this.percentDone = percentChunk;

      try {
        for (let index = 1; index < this.chunks.length; index += 1) {
          let counter = index * 1000 + 1;
          // eslint-disable-next-line no-await-in-loop
          const response = await this.$store.$repositories.chemicalList
            .listDetailsDtxsids(this.chunks[index], counter, this.$sentry);
          this.chunkData = response;

          this.addChemicals(this.chunkData);
          this.percentDone += percentChunk;
        }

        this.percentDone = 100;
      } catch (ex) {
        this.$sentry.captureMessage(`chemicallist error getting chunked data ${ex.toString()}`);
      }
      this.isLoading = false;
    },
    togglePane(paneName) {
      this[paneName] = !this[paneName];
    },
    async handleChemicalSearch(e) {
      if (e.isSubstringSearch) {
        const searchResults = await this.$repositories
          .chemicalSearch.chemListContains(e.searchTerm, this.$route.params.id, this.$sentry);
        if (searchResults.length > 0) {
          const filteredChemicals = await this.$store.$repositories.chemicalList
            .listDetailsDtxsids(searchResults);
          if (filteredChemicals.length > 0) {
            const counter = 0;
            this.setChemicalListFilteredChemicals(filteredChemicals, counter, this.$sentry);
            this.chemicals = this.getChemicals();
          }
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
@import "~/assets/styles/global-styles/agGrid.scss";

 .md-accordion {
   margin-top: 1rem;

    .card {
      margin-top: 2px;
      margin-bottom: 2px !important;
        .card-body {
          border-top: 0px !important;
        }
        .card-header {
          border-radius: calc(.25rem - 1px) calc(.25rem - 1px) 0 0;
          background-color: $primary-color !important;
          padding: .6rem !important;
          h5 {
            background-color: $primary-color !important;
            color: white !important;
            font-size: 1rem;
            font-weight: 400;
          }
        }
    }
    .collapse-item {
      overflow: hidden !important;
    }
  }

</style>
