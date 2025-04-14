<template>
  <mdb-container fluid class="content left-fullwidth-container pl-0 pr-0">
    <div class="">
      <ccte-help-text
        data-cy="AssayEndpointHeader"
        label-type="h1"
        :heading-text="assayComputed.name"
        help-key="AssayEndpointHeader"
      />
    </div>

    <client-only>
      <mdb-accordion class="assayAccordion" table>
        <mdb-accordion-pane
          title="Assay Details"
          class=""
          type="table"
          :is-open="detailsOpen"
          data-cy="assayDetails"
          @pane-clicked="togglePane('detailsOpen')"
        >
          <div class="card-body">
            <p class="ml-3">
              <span class="card-title">Description: </span>
              <span
                v-if="assayComputed.desc.length > 0"
                class="card-text ml-3"
                data-cy="assayDescription"
                v-html="assayComputed.desc"
              />
              <span v-else class="card-text ml-3" data-cy="assayDescription" v-html="'N/A'" />
            </p>
            <p class="ml-3">
              <span class="card-title" data-cy="chemicalCount">Number of Chemicals: </span>
              <span class="card-text ml-3" data-cy="chemicalCount">
                {{ assayComputed.multi_conc_assay_chemical_count.total }}
              </span>
            </p>
          </div>
        </mdb-accordion-pane>

        <mdb-accordion-pane
          title="Detailed Assay Information"
          class=""
          type="table"
          :is-open="tabbedDetailsOpen"
          data-cy="detailedAssayInformation"
          @pane-clicked="togglePane('tabbedDetailsOpen')"
        >
          <assay-detail-tabs :endpoint-name="$route.params.id" />
        </mdb-accordion-pane>
        <!--  <mdb-accordion-pane
          title="Histograms"
          type="table"
          :is-open="histogramOpen"
          data-cy="histogram"
          @pane-clicked="togglePane('histogramOpen')"
        >
          <div class="histograms">
            <div>
              <assay-histogram
                v-model="chemicalsSelectedBy.logAc50"
                :chemicals="chemicals"
                title="Histogram of LogAC50 Values of All Active Chemicals"
                label="AC50 (µM)"
                type="logAc50"
                @input="updateSelectedChemicals"
              />
            </div>
            <div>
              <assay-histogram
                v-model="chemicalsSelectedBy.scaledTopCutoff"
                :chemicals="chemicals"
                title="Histogram of Scaled Responses of All Active Chemicals"
                label="Scaled Top (= Top / Cutoff)"
                type="scaled"
                @input="updateSelectedChemicals"
              />
            </div>
          </div>
        </mdb-accordion-pane> -->
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
        data-cy="resultsGrid"
        grid-reference="assayEndpointLists"
        grid-heading="Assay Endpoint"
        @gridRef="onGridRef"
        @exportData="onExportData"
      />
    </client-only>
  </mdb-container>
</template>

<script>
import {
  mapGetters, mapMutations, mapState, mapActions,
} from 'vuex';
import {
  mdbContainer, mdbAccordion, mdbAccordionPane,
} from 'mdbvue';
import AssayDetailTabs from '~/components/assays/AssayDetailTabs.vue';
import AssayHistogram from '~/components/assays/AssayHistogram.vue';
import ExportModal from '~/components/batch-search/ExportModal.vue';
import Results from '~/components/results/Results.vue';
import toolbarConfig from './toolbar_config.json';

export default {
  name: 'AssayEndpointPage',
  components: {
    mdbContainer,
    mdbAccordion,
    mdbAccordionPane,
    AssayDetailTabs,
    AssayHistogram,
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
      columnDefs: [],
      exportColDefs: [],
      defaultColumnDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
      },
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      elHeight: 0,
      histogramOpen: false,
      tabbedDetailsOpen: false,
      detailsOpen: true,
      chemicalsSelectedBy: {
        logAc50: [],
        scaledTopCutoff: [],
      },
      isLoading: false,
      chunkData: [],
      percentDone: 0,
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
      getGridDefs: 'assayEndpointResults/getGridDefs',
      getExportColDefs: 'assayEndpointResults/getExportColDefs',
      getAssayById: 'assayEndpoints/getAssayById',
      getFilterModel: 'results/getFilterModel',
    }),
    assayComputed() {
      const assay = this.getAssayById(this.$route.params.id);
      return assay[0];
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
    const endpoints = await context.store.dispatch('assayEndpoints/asyncAssayEndpoints', context);
    const response = await context.app.$repositories.assay.listDetails(`${listId}&size=1000`);
    const chemicals = response.data;
    const isLoading = response.paging.totalPages > 1;

    return {chemicals: chemicals, paging: response.paging};
  },
  created() {
    this.setSortOptions(toolbarConfig.sortOptions);
    this.setFilterOptions(toolbarConfig.filterOptions);
    this.setTileInfoOptions(toolbarConfig.tileInfoOptions);
    this.setFilterModel(['inactive']);
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
      return col;
    });
    this.exportColDefs = this.getExportColDefs();
    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridOptions: {
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          roundTo6: this.roundTo6,
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        valueCache: true,
        unSortIcon: true,
        suppressContextMenu: true,
        rowHeight: 100,
        tooltipShowDelay: 500,
        rowSelection: 'multiple',
        headerHeight: 45,
      },
    };
    this.gridConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
  },
  methods: {
    ...mapMutations({
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setFilterModel: 'results/setFilterModel',
      setChemicalsSelectedBy: 'assayEndpointResults/setChemicalsSelectedBy',
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
          fileName: `Assay List ${this.$route.params.id}-${timeStamp}`,
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
      this.isLoading = true;
      const listId = `?name=${this.$route.params.id}`;
      const percentChunk = Math.ceil(100 / this.paging.totalPages);
      this.percentDone = percentChunk;
      try {
        for (let index = 1; index < this.paging.totalPages; index += 1) {
          // eslint-disable-next-line no-await-in-loop
          const response = await this.$repositories.assay.listDetails(`${listId}&size=1000&page=${index}`);
          this.chunkData = response.data;
          this.percentDone += percentChunk;
        }
      } catch (ex) {
        this.$sentry.captureMessage(`Assay endpoints details ERROR- Assay-id: ${this.$route.params.id} :  ${ex}`);
      }
      this.isLoading = false;
    },
    beforeEnter(el) {
      this.elHeight = el.scrollHeight;
    },
    enter(el) {
      el.style.height = `${this.elHeight}px`;
    },
    beforeLeave(el) {
      el.style.height = 0;
    },
    togglePane(paneName) {
      this[paneName] = !this[paneName];
    },
    updateSelectedChemicals() {
      this.setChemicalsSelectedBy(this.chemicalsSelectedBy);
      this.updateFilterModel();
    },
    updateFilterModel() {
      // console.log('update histogram filter')
      const filterModel = this.getFilterModel();
      const hasSelections =
        this.chemicalsSelectedBy.logAc50.length > 0 ||
        this.chemicalsSelectedBy.scaledTopCutoff.length > 0;
      const hasHistogramFilter = filterModel.includes('histogram_union') || filterModel.includes('histogram_intersection');
      if (hasSelections && !hasHistogramFilter) {
        filterModel.push('histogram_union');
        this.setFilterModel(filterModel);
      }
      if (!hasSelections && hasHistogramFilter) {
        const newFilterModel = filterModel.filter(f => !['histogram_union', 'histogram_intersection'].includes(f));
        this.setFilterModel(newFilterModel);
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
   margin-top: 1.5rem;
    .card {
      margin-top: 0px;
      margin-bottom: 6px !important;
        .card-header {
          border-radius: calc(.25rem - 1px) calc(.25rem - 1px) 0 0;
          background-color: $primary-color !important;
          padding: .75rem 1.25rem !important;
          margin-top: 0px !important;
          margin-bottom: 0px !important;
          h5 {
            background-color: $primary-color !important;
            color: white !important;
            font-size: 1rem;
            font-weight: 400;
          }
        }
        .card-body {
    /* flex: 1 1 auto; */
    min-height: 1px;
    margin-right: 2px !important;
    padding: 0rem !important;
    border-top: 0px !important;
}
    }
    .collapse-item {
      overflow: auto !important;
    }
  }
  .tab-details {
   color: black !important;
   height: 100%;
   min-height: 500px;
   margin-top: 2em;
   .nav-link {
     color: black !important;
      .disabled {
        color: #6c757d !important;
        background-color: transparent;
        border-color: transparent;
        pointer-events: none !important;
      }
   }
 }

 .histograms {
  display: flex;
  justify-content: center;
}
</style>
