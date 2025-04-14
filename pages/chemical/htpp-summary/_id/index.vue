<template>
  <mdb-container fluid class="content left-fullwidth-container pl-0 pr-0">
    <div class="row pr-4">
      <div class="col-sm-12 h2 pl-4">
        <ccte-help-text
          data-cy="BioactivityHtppSummary"
          label-type="span"
          :heading-text="`Bioactivity - HTPP Summary`"
          help-key="SR HTPP Summary"
        />
      </div>
      <div
        class="skiplinks"
        role="navigation"
        aria-labelledby="Assay Description"
      >
        <a
          id="DetailsLink"
          data-cy="details-link"
          href="javascript:void(0)"
          class="skiplinks__link sr-only sr-only-focusable"
          @keyup.enter.prevent="toggleDetails('htppDetails')"
        >Toggle Assay Description</a>
      </div>
    </div>
    <client-only>
      <div id="htpp-plot-container" class="row p-0">
        <div class="col-12 pr-0 m-0">
          <div v-if="showPlotLoading && beenLoaded" class="d-flex justify-content-center mt-5 loading-spinner">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <mdb-accordion class="assayAccordion mt-5 my-4 pb-4 shadow-none" aria-label="accordion" role="contentInfo" table>
            <mdb-accordion-pane
              id="AssayDescription"
              title="Assay Description"
              type="table"
              tabindex="0"
              data-cy="assay-description-header"
              :is-open="htppDetails"
              @keydown="toggleDetails('htppDetails')"
              @pane-clicked="toggleDetails('htppDetails')"
            >
              <div class="card">
                <div class="card-body">
                  <span class="card-title text-bold">
                    <h3>
                      Assay Description
                    </h3>
                  </span>
                  <p>
                    <strong>HTPP Bioactivity</strong> High-throughput phenotypic profiling (HTPP) with the Cell Painting assay Nyffeler et al. 2020, (<a href="https://pubmed.ncbi.nlm.nih.gov/31899216/" alt="Bioactivity screening of environmental chemicals using imaging-based high-throughput phenotypic profiling" target="_blank" referrerpolicy="no-referrer">PMID: 31899216</a>) uses high content imaging of cells labeled with organelle-targeting fluoroprobes to profile chemical effects on cell morphology. The information displayed in this tab are results from global, category-level, and feature-level modeling of HTPP data as described in Nyffeler et al. 2021 (<a href="https://pubmed.ncbi.nlm.nih.gov/32862757/" target="_blank" alt="Comparison of Approaches for Determining Bioactivity Hits from High-Dimensional Profiling Data" referrerpolicy="no-referrer">PMID: 32862757</a>). Endpoints were subject to concentration-response modeling using the tcplfit2 package described in Sheffield et al. 2021(<a href="https://pubmed.ncbi.nlm.nih.gov/34791027/" target="_blank" alt="tcplfit2: an R-language general purpose concentration-response modeling package" referrerpolicy="no-referrer">PMID:  34791027</a>).
                  </p>
                  <p>
                    <strong>Category Level Summary</strong> Points are plotted according to the potency (i.e. BMD, x-axis) and efficacy (i.e. Top/Cutoff, y-axis) determined from concentration-response modeling of global or category-level endpoints based on Mahalanobis distance modeling approaches described in Nyffeler et al. 2021.  For each Sample ID × cell type × seeding density × exposure duration combination tested, up to 49 category-level endpoints and 1 global endpoint may be displayed on this plot if active (i.e. a hit). An example of a category-level endpoint is Mito_Texture_Cytoplasm, a latent variable measuring the texture of mitochondrial labeling in the cytoplasm compartment of the cells. If the global endpoint was active for a Sample ID × cell type × seeding density × exposure duration combination, the BMD is displayed as a large purple point.  In addition, if category-level endpoint(s) for a Sample ID × cell type × seeding density × exposure duration combination were affected, the BMD of the most-sensitive category is also displayed as a large point color-coded to match the fluorescent channel / organelle from which it was derived. Points are shape coded based the compartment from which they were derived (i.e. cytoplasm, nuclei, membrane, ring or cell). Mouse over each point to display metadata and modeling results associated with that point.  Click the cell type, exposure duration and/or seeding density checkboxes to display data associated with those conditions.
                  </p>
                  <p>
                    <strong>Feature Level Summary</strong> Points are plotted according to the potency (i.e. BMD, x-axis) and efficacy (i.e. Top/Cutoff, y-axis) determined from concentration-response modeling of normalized and z-scaled feature-level data. Up to 1300 feature-level endpoints may be displayed on this plot if active for each Sample ID × cell type × seeding density × exposure duration combination tested. If present on the graph, large purple points represent the global BMD and large not purple points represent the most sensitive category-level BMD for a given Sample ID × cell type × seeding density × exposure duration combination. Points are shape coded based the compartment from which they were derived (i.e. cytoplasm, nuclei, membrane, ring or cell). Mouse over each point to display metadata and modeling results associated with that point. Click the cell type, exposure duration and/or seeding density checkboxes to display data associated with those conditions.
                  </p>
                  <p>
                    Toggle Switches Set to No Filtering as the Default View
                  </p>
                  <p>
                    Global- , category- , and feature-level mapping information can be <a href="https://epa.figshare.com/articles/dataset/High_Throughput_Phenotypic_Profiling_HTPP/21502782" target="_blank" alt="Chemistry Dashboard Data: High Throughput Phenotypic Profiling (HTPP)" referrerpolicy="no-referrer">found here</a>
                  </p>
                </div>
              </div>
            </mdb-accordion-pane>
          </mdb-accordion>
          <div
            v-if="hasCategoryPlot > 0 && htppSummaryPlot"
            class="embed-responsive embed-responsive-16by9 z-depth-1-half ml-0"
          >
            <iframe
              id="categoryPlot"
              ref="categoryPlot"
              if="hasCategoryPlot > 0"
              data-cy="htppCategoryPlot"
              class="embed-responsive-item plotly-iframe shadow-none"
              :src="categoryPlotUrl"
              frameborder="0"
            />
          </div>
          <mdb-accordion class="assayAccordion" aria-label="accordion 2" role="contentInfo" table>
            <mdb-accordion-pane
              v-if="hasFeaturePlot > 0"
              ref="featurePane"
              title="HTPP Feature Plot"
              class=" py-0 px-0 my-4"
              type="table"
              :is-open="htppSecondPlot"
              @pane-clicked="togglePane('htppSecondPlot')"
            >
              <div class="embed-responsive embed-responsive-16by9 z-depth-1-half" style="min-height: 100%;">
                <div v-if="showPlotLoading" class="d-flex justify-content-center mt-5 loading-spinner">
                  <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <iframe
                    ref="featurePlot"
                    if="hasFeaturePlot > 0"
                    data-cy="htppFeaturePlot"
                    class="embed-responsive-item plotly-iframe"
                    style="min-height: 100%;"
                    :src="featurePlotUrl"
                    frameborder="0"
                  />
                </div>
                <iframe
                  ref="featurePlot"
                  if="hasFeaturePlot > 0"
                  data-cy="htppFeaturePlot"
                  class="embed-responsive-item plotly-iframe"
                  style="min-height: 100%;"
                  :src="featurePlotUrl"
                  frameborder="0"
                />
              </div>
            </mdb-accordion-pane>
          </mdb-accordion>
        </div>
      </div>
    </client-only>
    <div class="row pr-0">
      <div class="col-12">
        <div class="toolbar">
          <div class="row d-flex justify-content-start">
            <div class="col-2">
              <grid-export-with-options
                class="pr-2"
                :export-options="exportOptions"
                @concExport="onExportData"
              />
            </div>
            <div class="col-3">
              <div v-if="exportBusy" class="alert alert-info" style="margin-bottom:0;padding:6px" role="alert">
                Retrieving Export Data, please wait... <i class="fas fa-cog fa-spin" />
              </div>
            </div>
          </div>
        </div>
        <div class="container-fluid pr-0 pl-0" style="overflow: auto;">
          <ag-grid-vue
            id="bioactivityHttrSummary"
            class="ag-theme-balham"
            style="height: 600px; minWidth: 1300px; width: 100%; overflow: auto;"
            :row-data="rowData"
            :grid-options="gridOptions"
            @cell-clicked="onCellClicked"
            @grid-ready="onGridReady"
            @column-visible="onColumnVisible"
          />
        </div>
      </div>
    </div>
    <assay-modal
      :title="modal.assayEndpointName"
      :visibility="modal.display"
      @toggleVisibility="() => {
        modal.display = !modal.display
      }"
    >
      <template #header>
        HTPP Details
      </template>
      <template #tabs>
        <httr-htpp-detail-tabs :data-identifiers="modal.dataIdentifiers" />
      </template>
    </assay-modal>
  </mdb-container>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import {
  mdbContainer, mdbAccordion, mdbAccordionPane,
} from 'mdbvue';
import {AgGridVue} from 'ag-grid-vue';
import htppDefs from './htppColumnDefs';
import htppExportDefs from './htppExportDefs';
import AssayModal from '~/components/assays/AssayModal.vue';
import HttrHtppDetailTabs from '~/components/httrHtpp/HttrHtppDetailTabs.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';
import GeneNamePopOverList from '~/components/cellRenderers/GeneNamePopOverList.vue';
import GeneSymbolPopOverList from '~/components/cellRenderers/GeneSymbolPopOverList.vue';
import GridExportWithOptions from '~/components/toolbars/gridToolbar/GridExportWithOptions.vue';
import SeqaPassList from '~/components/cellRenderers/SeqaPassList.vue';
import GridCopyUrlButtonVue from '../../../../components/toolbars/gridToolbar/GridCopyUrlButton.vue';
import QcFlagPopover from '~/components/cellRenderers/QCFlagPopover.vue';

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
  name: 'HtppSummaryView',
  components: {
    AgGridVue,
    GridExportWithOptions,
    AssayModal,
    HttrHtppDetailTabs,
    // eslint-disable-next-line vue/no-unused-components
    PopOverUnderline,
    // eslint-disable-next-line vue/no-unused-components
    QcFlagPopover,
    // eslint-disable-next-line vue/no-unused-components
    SeqaPassList,
    mdbContainer,
    mdbAccordion,
    mdbAccordionPane,
  },
  data: () => ({
    showPlotLoading: true,
    beenLoaded: false,
    htppSummaryPlot: false,
    htppDetails: false,
    htppFirstPlot: true,
    htppSecondPlot: false,
    loadedFeaturePlot: false,
    loadedCategoryPlot: false,
    active: 'toxicity-values',
    gridApi: null,
    columnApi: null,
    rowData: null,
    gridOptions: {},
    showBackgroundToggle: true,
    modal: {
      display: false,
      dataIdentifiers: null,
    },
    exportBusy: false,
    exportOptions: [
      {
        label: 'Excel (.xlsx)',
        key: 'xlsx',
      },
      {
        label: 'CSV  (.csv)',
        key: 'csv',
      },
    ],

  }),
  computed: {
    categoryPlotUrl() {
      return `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotSummaryHTPP?dsstox_id=${this.chemical.dsstoxSubstanceId}&approach=category&url_env=${process.env.APPLICATION_BASE_API}`;
    },
    featurePlotUrl() {
      return `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotSummaryHTPP?dsstox_id=${this.chemical.dsstoxSubstanceId}&approach=feature&url_env=${process.env.APPLICATION_BASE_API}`;
    },
  },
  async asyncData(context) {
    const chemical = await context.app.store.state.results.activeChemical;
    const htppArray = await context.app.store.dispatch('htpp/asyncHtpp', context);
    const hasFeaturePlot = await context.app.store.dispatch('htpp/hasFeaturePlot', context);
    const hasCategoryPlot = await context.app.store.dispatch('htpp/hasCategoryPlot', context);
    return {
      chemical, htppArray, hasFeaturePlot, hasCategoryPlot,
    };
  },
  beforeMount() {
    this.exportColDefs = htppExportDefs;
    this.rowData = this.htppArray;
    /*
    TODO: This is an example of how flag to message would work.  There is a lot
    more to this than what's here, however, and we need to wait on API changes to
    complete
    */
    /*
    for (const a of this.rowData) {
      a.qcFlag = 'F'
      a.qcPopover = qcFlagDefs[a.qcFlag]
    }
    */
    this.gridOptions = {
      domLayout: 'normal',
      valueCache: true,
      rowSelection: 'multiple',
      headerHeight: 50,
      unSortIcon: true,
      suppressContextMenu: true,
      enableCellTextSelection: true,
      tooltipShowDelay: 0,
      components: {
        detailsBtn: this.detailsBtn,
        repBtn: this.repBtn,
        numberFieldRenderer: this.numberFieldRenderer,
        roundTo2: this.roundTo2,
        ncctRound2: this.ncctRound2,
      },
      defaultColDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        minWidth: 80,
        width: 100,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        resizable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'center',
          },
          {statusPanel: 'agFilteredRowCountComponent'},
          {statusPanel: 'agSelectedRowCountComponent'},
          {statusPanel: 'agAggregationComponent'},
        ],
      },

      columnDefs: htppDefs,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const iframe = this.$refs.categoryPlot;
      if (iframe) {
        this.$nuxt.$loading.start();
      } else {
        setTimeout(() => this.htppSummaryPlot = true, 1500);
        this.showPlotLoading = true;
        setTimeout(() => this.showPlotLoading = false, 2000);
        this.beenLoaded = true;
      }
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.showPlotLoading = false, 3000);
    });
  },
  methods: {
    toggleDetails(paneName) {
      this[paneName] = !this[paneName];
    },
    togglePane(paneName) {
      this[paneName] = !this[paneName];
      if (paneName === 'htppSecondPlot' && !this.loadedFeaturePlot) {
        this.$nextTick(() => {
          const iframe = this.$refs.featurePlot;
          if (iframe) {
            this.$nuxt.$loading.start();
            iframe.addEventListener('load', () => {
              this.$nuxt.$loading.finish();
              this.loadedFeaturePlot = true;
              return true;
            });
          }
        });
      }
      if (paneName !== 'htppSecondPlot' && !this.loadedCategoryPlot) {
        this.$nextTick(() => {
          const iframe = this.$refs.categoryPlot;
          if (iframe) {
            this.$nuxt.$loading.start();
            iframe.addEventListener('load', () => {
              this.$nuxt.$loading.finish();
              this.loadedCategoryPlot = true;
              return true;
            });
          }
        });
      }
    },
    onColumnVisible(params) {
      this.gridApi.resetRowHeights();
    },
    onCellClicked(e) {
      switch (e.column.colId) {
      case 'detailsPopup': {
        this.modal.dataIdentifiers = {
          annotations: e.data.endpoint,
          dataset: e.data.dataset,
          citations: e.data.dataset,
          type: 'HTPP',
        };
        this.modal.display = true;
        break;
      }
      default:
      }
    },
    openPlot(params) {
      const appEnv = `&url_env=${encodeURIComponent(process.env.APPLICATION_BASE_API)}`;
      const sampleId = `&sampleId=${params.data.sampleId}`;
      const categoryName = `&categoryName=${params.data.categoryName}`;
      const concRespPlotUrl = `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotfit2_HTPP?${appEnv}${categoryName}${sampleId}`;
      return concRespPlotUrl;
    },
    repBtn(params) {
      const linkString = this.openPlot(params);
      return `<a href="${linkString}" data-cy="concRespPlotUrl" target="_blank"><i class="fas fa-chart-line" style="cursor: pointer;"></i></a>`;
    },
    detailsBtn(params) {
      return '<i class="fas fa-file-alt" style="cursor: pointer;"></i>';
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.onFilterChanged();
      this.gridApi.sizeColumnsToFit();
    },
    toggleBackground() {
      this.showBackgroundToggle = !this.showBackgroundToggle;
      const intendedTargetFamilyFilter = this.gridApi.getFilterInstance('intendedTargetFamily');
      intendedTargetFamilyFilter.setModel({
        type: 'notContains',
        filter: (this.showBackgroundToggle) ? 'background' : null,
      });
      this.gridApi.onFilterChanged();
    },
    onExportData(params) {
      const timeStamp = this.dateFormat();
      this.exportData({
        fileName: `${this.chemical.preferredName} HTPP Summary -${timeStamp}`,
        gridApi: this.gridApi,
        fileFormat: params,
        columns: this.exportColDefs,
      });
    },
  },

  head() {
    if (!this.chemical) {
      return {
        title: 'Data Exception - HTPP Summary',
        meta: [
          {
            hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  HTPP Summary`,
            name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  HTPP Summary`,
            content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}   HTPP Summary`,
          },
        ],
      };
    }
    return {
      title: `${this.chemical.preferredName} - HTPP Summary`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} ${this.chemical.preferredName}  HTPP Summary`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName}  HTPP Summary`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName} HTPP Details -  Toxcast Summary`,
        },
      ],
    };
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
        .card-header {
          border-radius: calc(.25rem - 1px) calc(.25rem - 1px) 0 0;
          background-color: #87b4c9!important;
          padding: .6rem !important;
          h5 {
            background-color: #87b4c9!important;
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
  .embed-responsive .embed-responsive-item, .embed-responsive iframe {
    min-height: 99% !important;
    width: 99% !important;
  }

</style>
