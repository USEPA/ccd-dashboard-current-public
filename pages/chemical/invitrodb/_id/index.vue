<template>
  <div>
    <client-only>
      <div class="row pr-4">
        <div class="col-sm-12 h2 pl-4">
          <ccte-help-text
            cy-data="TOXCAST-Header"
            label-type="span"
            :heading-text="`Bioactivity - TOXCAST Summary`"
            help-key="SR ToxCast Graph"
          />
        </div>
      </div>
      <div v-if="bioactivityCount > 0" class="row pr-4">
        <div class="col-sm-12 h2">
          <div id="toxcast-plot-container" class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
            <div
              v-if="showPlotLoading"
              class="d-flex justify-content-center mt-5 loading-spinner"
            >
              <div
                class="spinner-border text-primary"
                style="width: 3rem; height: 3rem"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <iframe
              id="summaryPlot"
              ref="summaryPlot"
              data-cy="toxcastSummaryPlot"
              class="embed-responsive-item plotly-iframe"
              :src="plotUrl"
              frameborder="0"
              style="height:100%;"
            />
          </div>
        </div>
      </div>
      <div class="toolbar">
        <div class="row d-flex justify-content-start">
          <div class="col-3">
            <div style="display: inline-block">
              <grid-export-with-options
                class="pr-2"
                :export-options="exportOptions"
                @concExport="onExportData"
              />
            </div>
          </div>
          <div class="col-4">
            <div class="h2 mb-1">
              <ccte-help-text
                data-cy="TOXCAST-summary-help"
                label-type="span"
                :heading-text="`Bioactivity Summary Grid`"
                help-key="SR ToxCast Grid"
              />
            </div>
          </div>

          <div class="col-3">
            <div class="custom-control custom-checkbox">
              <input
                id="showRepToggle"
                data-cy="representitiveToggle"
                type="checkbox"
                :checked="showRepToggle"
                class="custom-control-input"
                @change="toggleRep"
              >
              <label
                class="custom-control-label"
                for="showRepToggle"
                style="font-size: 10px; display:inline-block;"
              >
                <mdb-popover trigger="hover" :append-to-body="true" :options="{placement: 'right'}">
                  <span slot="body" data-cy="repMessage">
                    A single chemical may have been tested as multiple samples in an assay,
                    and representative sample is determined using the ToxCast Pipeline function tcplSubsetChid().
                  </span>
                  <span slot="reference" data-cy="RepMessageTrigger" style="width: 100%;">Filter out
                    non-representative sample (Repr.) results. <mdb-icon class="h2" icon="exclamation-circle" />
                  </span>
                </mdb-popover>
              </label>
            </div>
          </div>
          <div class="col-2">
            <div class="custom-control custom-checkbox">
              <input
                id="backgroundCheck"
                type="checkbox"
                :checked="showBackgroundToggle"
                class="custom-control-input"
                @change="toggleBackground"
              >
              <label
                class="custom-control-label"
                for="backgroundCheck"
                style="font-size: 10px"
              >
                Filter out 'background'<br>
                from Intended Target Family
              </label>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 600px; width: 100%">
        <ag-grid-vue
          id="bioactivitySummary"
          alt="Bioactivity Summary Grid"
          data-cy="bioactivitySummaryGrid"
          class="ag-theme-balham"
          style="height: 94%; width: 100%"
          :row-data="rowData"
          :grid-options="gridOptions"
          @cell-clicked="onCellClicked"
          @grid-ready="onGridReady"
        />
        <div class="alert alert-light alertMessage" role="alert">
          Denominator is the total number of sample assay endpoint pairs (including non-representative samples).
        </div>
      </div>
      <assay-modal
        :title="modal.assayEndpointName"
        :visibility="modal.display"
        @toggleVisibility="
          () => {
            modal.display = !modal.display;
          }
        "
      />
    </client-only>
  </div>
</template>

<script>

/* eslint-disable  vue/no-unused-components */

import {AgGridVue} from 'ag-grid-vue';
import {
  mdbIcon, mdbPopover,
} from 'mdbvue';
import {round} from 'lodash';
import AssayModal from '~/components/assays/AssayModal.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';
import AssayListsPopover from '~/components/cellRenderers/AssayListsPopover.vue';
import AssayListsSelect from '~/components/toolbars/gridToolbar/AssayListsSelect.vue';
import GenePopOverList from '~/components/cellRenderers/GenePopOverList.vue';
import GridExportWithOptions from '~/components/toolbars/gridToolbar/GridExportWithOptions.vue';
import SeqaPassList from '~/components/cellRenderers/SeqaPassList.vue';

let observer = null;

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (
        currentChem.dtxsid === data.params.id ||
        currentChem.dtxcid === data.params.id
      ) {
        return true;
      /*  eslint-disable-next-line no-else-return */
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical',
          data,
          data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'ToxcastSummaryView',
  components: {
    AgGridVue,
    GridExportWithOptions,
    AssayModal,
    AssayListsSelect,
    PopOverUnderline,
    AssayListsPopover,
    GenePopOverList,
    SeqaPassList,
    mdbIcon,
    mdbPopover,
  },
  data: () => ({
    showPlotLoading: true,
    filterColumn: 'assayListName',
    active: 'toxicity-values',
    gridApi: null,
    columnApi: null,
    exportKeys: [],
    rowData: null,
    gridOptions: {},
    cname: {
      camelName: 'toxvalSummary',
      hyphenName: 'toxval-summary',
      baseName: 'Toxval Summary',
    },
    bioactivitySummary: null,
    showBackgroundToggle: true,
    showRepToggle: '1',
    modal: {
      display: false,
      assayEndpointName: null,
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
    plotUrl() {
      return `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotSummary?dsstox_id=${this.chemical.dsstoxSubstanceId}&url_env=${process.env.APPLICATION_BASE_API}`;
    },
  },
  async asyncData(context) {
    let bioactivityCount = null;
    let bioactivity = [];
    const chemical = await context.app.store.state.results.activeChemical;
    try {
      bioactivity = await context.app.$repositories.bioactivity.summary(context.params.id);
      bioactivityCount = await context.app.$repositories.bioactivity.count(context.params.id);
    } catch (err) {
      bioactivityCount = 0;
      context.$sentry.captureMessage(`Toxcast summary ERROR-bioactivity Count/Summary ${context.params.id} :  ${err}`);
    }
    const all = new Map();
    const blanks = {
      assay_list_id: '-',
      assay_list_nm: '(Blanks)',
      assay_list_descr: '',
    };
    bioactivity.forEach((rec) => {
      (rec.assayList || [blanks]).forEach((list) => {
        all.set(JSON.stringify(list), list);
      });
    });
    const assaySelectList = Array.from(all.values());
    const bioactivitySummary = bioactivity.map(bio => ({
      ...bio,
      geneName: bio.geneInfo,
      geneUrl: bio.geneInfo,
    }));
    const bioactivityFinal = bioactivitySummary.map((bio) => {
      if (bio.assayList) {
        bio.assayListName = bio.assayList.map(list => (list.assay_list_nm));
      } else {
        bio.assayListName = null;
      }
      if (bio.chidRep === '1') {
        bio.chidRep = 'True';
      } else {
        bio.chidRep = 'False';
      }
      return bio;
    });
    return {
      chemical,
      bioactivityCount,
      assaySelectList,
      bioactivityFinal,
    };
  },
  beforeMount() {
    this.gridApi = null;
    this.columnApi = null;
    this.rowData = this.bioactivityFinal;
    this.gridOptions = {
      domLayout: 'normal',
      valueCache: true,
      unSortIcon: true,
      rowSelection: 'multiple',
      headerHeight: 50,
      tooltipShowDelay: 500,
      suppressContextMenu: true,
      enableCellTextSelection: true,
      components: {
        detailsBtn: this.detailsBtn,
        repBtn: this.repBtn,
        allBtn: this.allBtn,
        geneSymbol: this.geneSymbol,
        geneName: this.geneName,
        ncctRound2: this.ncctRound2,
        flagParser: this.flagParser,
        pdfFileNameRenderer: this.pdfFileNameRenderer,
      },
      defaultColDef: {
        filter: 'agTextColumnFilter',
        colId: '',
        sortable: true,
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

      columnDefs: this.getColumnDefs(),
    };
  },
  mounted() {
    this.gridApi = null;
    this.columnApi = null;
    const iframe = this.$refs.summaryPlot;
    this.$nextTick(() => {
      if (iframe) {
        this.$nuxt.$loading.start();
      }
      setTimeout(() => {
        this.$nuxt.$loading.finish();
      }, 2000);
    });
  },
  methods: {
    getColumnDefs() {
      const columnDefs = [
        {
          filter: false,
          colId: 'selectBox',
          suppressSizeToFit: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          sortable: false,
          resizable: false,
          width: 40,
        },
        {
          headerName: 'Name',
          field: 'assayComponentEndpNm',
          filter: 'agTextColumnFilter',
          width: 170,
          minWidth: 150,
          cellRenderer: 'PopOverUnderline',
          cellRendererParams: {popField: 'assayComponentEndpDesc'},
          floatingFilterComponentParams: {suppressFilterButton: false},
          filterParams: {
            maxNumConditions: 4,
            defaultJoinOperator: 'OR',
          },
        },
        {
          headerName: 'Assay Endpoint Description',
          field: 'assayComponentEndpDesc',
          hide: true,
        },
        {
          headerName: 'Assay Component Name',
          field: 'assayComponentName',
          hide: true,
        },
        {
          headerName: 'Assay Component Description',
          field: 'assayComponentDesc',
          hide: true,
        },
        {
          headerName: 'Assay Lists',
          field: 'assayListName',
          wrapText: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: false},
          headerTooltip: 'Curated assay lists to group endpoints',
          width: 140,
          minWidth: 130,
          cellRenderer: 'AssayListsPopover',
        },
        {
          headerName: 'Details',
          minWidth: 80,
          width: 80,
          field: 'assayComponentEndpNm',
          colId: 'details',
          suppressMenu: true,
          filter: false,
          sortable: false,
          cellRenderer: params => '<i class="fas fa-file-alt"></i>',
        },
        {
          headerName: 'Description',
          field: 'pdfFileName',
          colId: 'pdfFileName',
          headerTooltip: 'Curated description document aligned with OECD GD211, if available',
          width: 150,
          suppressMenu: true,
          filter: 'agTextColumnFilter',
          cellRenderer: 'pdfFileNameRenderer',
          hide: true,
        },
        {
          headerName: 'SeqAPASS',
          field: 'seqAPASS',
          cellRenderer: 'SeqaPassList',
          sortable: false,
          minWidth: 100,
          width: 120,
          headerTooltip: 'Sequence Alignment to Predict Across Species Susceptibility (SeqAPASS) output corresponding to the assay protein target',
        },
        {
          headerName: 'Gene Symbol',
          colId: 'gene_symbol',
          headerTooltip: 'NCBI gene identifier',
          minWidth: 90,
          width: 100,
          filter: 'agTextColumnFilter',
          sortable: true,
          wrapText: true,
          cellRenderer: 'GenePopOverList',
          cellRendererParams: {
            showItem: 'symbol',
          },
          cellStyle: {'white-space': 'normal', 'line-height': '20px'},
          valueGetter: this.geneFilterText,
          autoHeight: true,
        },
        {
          headerName: 'Gene URL',
          colId: 'gene_url',
          minWidth: 200,
          width: 240,
          cellClass: 'p-0 m-0',
          filter: false,
          sortable: false,
          suppressMenu: true,
          cellRenderer: 'GenePopOverList',
          cellRendererParams: {
            showItem: 'url',
          },
          wrapText: true,
          cellStyle: {'white-space': 'normal', 'line-height': '20px'},
          valueGetter: this.geneFilterText,
          autoHeight: true,
          hide: true,
        },
        {
          headerName: 'Gene Name',
          minWidth: 100,
          width: 130,
          colId: 'gene_name',
          cellStyle: {'white-space': 'normal', 'line-height': '20px'},
          cellRenderer: 'GenePopOverList',
          cellRendererParams: {
            showItem: 'name',
          },
          sortable: true,
          wrapText: true,
          autoHeight: true,
          valueGetter: this.geneFilterText,
          suppressMenu: true,
          hide: true,
        },
        {
          headerName: 'AOP',
          colId: 'aop',
          field: 'aop',
          minWidth: 80,
          width: 80,
          headerTooltip: 'Associated Adverse Outcome Pathways (AOPs)',
          sortable: true,
          cellRenderer: this.aopRenderer,
          wrapText: true,
          cellStyle: {'white-space': 'normal', 'line-height': '20px'},
          valueGetter: this.aopFilterText,
          autoHeight: true,
        },
        {
          headerName: 'Event',
          colId: 'event',
          field: 'event',
          headerTooltip: 'Associated Key Events within Adverse Outcome Pathways (AOPs)',
          sortable: true,
          cellRenderer: this.eventRenderer,
          minWidth: 80,
          width: 90,
          cellStyle: {'white-space': 'normal', 'line-height': '20px'},
          autoHeight: true,
          valueGetter: this.eventFilterText,
        },
        {
          headerName: 'Repr. Plot',
          minWidth: 60,
          width: 80,
          filter: false,
          sortable: false,
          field: 'assayEndpointName',
          colId: 'repPlot',
          suppressMenu: true,
          cellRenderer: 'repBtn',
          headerClass: 'hide-filter-icon',
        },
        {
          headerName: 'All Plots',
          minWidth: 80,
          width: 90,
          filter: false,
          sortable: false,
          field: 'assayEndpointName',
          colId: 'allPlot',
          suppressMenu: true,
          cellRenderer: 'allBtn',
          headerClass: 'hide-filter-icon',
        },
        {
          headerName: 'Hit Call',
          field: 'hitCall',
          colId: 'hitCall',
          filter: 'agSetColumnFilter',
          suppressMenu: true,
          suppressColumnsToolPanel: true,
          floatingFilterComponentParams: {suppressFilterButton: false},
          minWidth: 80,
          width: 100,
          valueGetter: params => this.displayHitCall(params),
          cellStyle: this.activeColor,
          headerTooltip: 'Binarized activity hit call. For research application, a continuous hit call value >= 0.9 is considered active whereas < 0.9 is inactive',
        },
        {
          headerName: 'Continuous Hit Call',
          field: 'hitcallContinuous',
          headerTooltip: 'Continuous activity hit call value',
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          floatingFilterComponentParams: {suppressFilterButton: false},
          suppressMenu: true,
          minWidth: 90,
          width: 90,
          valueFormatter: params => this.genericNumRound2ValueGetter(params.data.hitcallContinuous || '-', 4),
        },
        {
          headerName: 'Top',
          field: 'top',
          minWidth: 70,
          width: 80,
          suppressMenu: true,
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          headerTooltip: 'Top of the curve',
        },
        {
          headerName: 'Scaled Top',
          field: 'scaledTop',
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          suppressMenu: true,
          width: 90,
          hide: true,
          headerTooltip: 'Ratio of top divided by cutoff',
        },
        {
          headerName: 'AC50',
          field: 'ac50',
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          minWidth: 80,
          width: 100,
          headerTooltip: 'Concentration at 50% of maximal activity, uM',
        },
        {
          headerName: 'logAC50',
          field: 'logac50',
          colId: 'logac50',
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          suppressMenu: true,
          minWidth: 90,
          width: 100,
          headerTooltip: 'Concentration at 50% of maximal activity, log10 uM',
        },
        {
          headerName: 'Cutoff',
          field: 'cutoff',
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          suppressMenu: true,
          minWidth: 65,
          width: 90,
          headerTooltip: 'User defined response cutoff used to set the activity hitcall and acc',
        },
        {
          headerName: 'ACC',
          field: 'acc',
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          suppressMenu: true,
          minWidth: 65,
          width: 90,
          headerTooltip: 'Concentration at user-defined cutoff (threshold) for response, uM',
        },
        {
          headerName: 'AC10',
          field: 'ac10',
          colId: 'ac10',
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          suppressMenu: true,
          minWidth: 65,
          width: 100,
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          hide: true,
          headerTooltip: 'Concentration at 10% of maximal activity, uM',
        },
        {
          headerName: 'BMR',
          field: 'bmr',
          floatingFilterComponentParams: {suppressFilterButton: false},
          suppressMenu: true,
          width: 80,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          hide: true,
          headerTooltip: 'Benchmark response (1.349 standard deviations from baseline as defined by the lowest two test concentrations), units of y-axis response',
        },
        {
          headerName: 'BMD',
          field: 'bmd',
          floatingFilterComponentParams: {suppressFilterButton: false},
          suppressMenu: true,
          width: 80,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          hide: true,
          headerTooltip: 'Benchmark dose (concentration producing the BMR with the estimated curve-fit model), uM',
        },
        {
          headerName: 'BMAD',
          field: 'bmad',
          floatingFilterComponentParams: {suppressFilterButton: false},
          suppressMenu: true,
          width: 80,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          hide: true,
          headerTooltip: 'Baseline median absolute deviation (noise around baseline) using either the lowest two test or neutral control wells as defined by user',
        },
        {
          headerName: 'Max Med Conc.',
          colId: 'maxMedConc',
          field: 'maxMedConc',
          filter: 'agNumberColumnFilter',
          headerTooltip: 'Corresponding concentration at maximal median response, uM',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          suppressMenu: true,
          minWidth: 95,
          width: 120,
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
        },
        {
          headerName: 'Normalized Data Type',
          field: 'normalizedDataTypCd',
          colId: 'normalizedDataTypCd',
          suppressMenu: true,
          filter: 'agSetColumnFilter',
          width: 110,
          headerTooltip: 'Normalized response unit',
          hide: true,
        },
        {
          headerName: 'Assay Source',
          field: 'assaySourceName',
          filter: 'agTextColumnFilter',
          width: 130,
          hide: true,
        },
        {
          headerName: 'Assay Name',
          field: 'assayName',
          filter: 'agTextColumnFilter',
          width: 100,
          hide: true,
        },
        {
          headerName: 'Assay Desc.',
          field: 'assayDesc',
          wrapText: true,
          autoHeight: true,
          filter: 'agTextColumnFilter',
          width: 150,
          hide: true,
        },
        {
          headerName: 'Assay Function Type',
          field: 'assayFunctionType',
          colId: 'assayFunctionType',
          hide: true,
        },
        {
          headerName: 'Flags',
          field: 'flag',
          colId: 'flag',
          suppressMenu: true,
          autoHeight: true,
          cellStyle: {'white-space': 'normal', 'line-height': '15px'},
          valueFormatter: 'this.flagParser',
          width: 120,
          hide: true,
          headerTooltip: 'List of cautionary flags from curve-fitting, see tcpl documentation',
        },
        {
          headerName: 'Stock Conc.',
          field: 'stockConcentration',
          colId: 'stockConcentration',
          suppressMenu: true,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          width: 150,
          hide: true,
          headerTooltip: 'Stock concentration tested',
        },
        {
          headerName: 'Stock Conc. Units',
          headerTooltip: 'Unit of stock concentration tested',
          field: 'stockConcentrationUnits',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 180,
          hide: true,
        },
        {
          headerName: 'Organism',
          field: 'organism',
          width: 100,
          hide: true,
          suppressMenu: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          autoHeight: true,
        },
        {
          headerName: 'Cell Line',
          field: 'cellShortName',
          width: 100,
          filter: 'agTextColumnFilter',
          wrapText: true,
          hide: true,
          autoHeight: true,
        },
        {
          headerName: 'Cell Format',
          field: 'cellFormat',
          width: 100,
          suppressMenu: true,
          hide: true,
          wrapText: true,
          autoHeight: true,
        },
        {
          headerName: 'Concentration',
          field: 'logcAgg',
          hide: true,
          width: 110,
          wrapText: true,
          autoHeight: true,
          headerTooltip: 'List of all concentrations tested',
        },
        {
          headerName: 'Response',
          field: 'respAgg',
          width: 180,
          wrapText: true,
          autoHeight: true,
          hide: true,
          headerTooltip: 'List of all responses measured',
        },
        {
          headerName: 'Cytotox Burst',
          field: 'cytotoxBurst',
          width: 100,
          wrapText: true,
          autoHeight: true,
          hide: true,
          cellRendererParams: {format: 'fixed2'},
          cellRenderer: this.ncctRound2,
          headerTooltip: 'Median AC50 value across “burst” endpoints, also known as cytotoxicity point. If the burst percent was less than 5%, default value is set as 1000 uM',
        },
        {
          headerName: 'Intended Target Family',
          field: 'intendedTargetFamily',
          cellRenderer: 'PopOverUnderline',
          cellRendererParams: {popField: 'intendedTargetFamily'},
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agTextColumnFilter',
          wrapText: true,
          autoHeight: true,
          suppressMenu: true,
          minWidth: 130,
          width: 150,
        },
        {
          headerName: 'Intended Target Type',
          field: 'intendedTargetType',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 150,
          hide: true,
        },
        {
          headerName: 'Intended Target Type Sub',
          field: 'intendedTargetSubType',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 150,
          hide: true,
        },
        {
          headerName: 'Intended Target Family Sub',
          field: 'intendedTargetFamSub',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 150,
          hide: true,
        },
        {
          headerName: 'Biological Process Target',
          field: 'biologicalProcessTarget',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 150,
          hide: true,
        },
        {
          headerName: 'Detection Technology Type',
          field: 'detectionTechnologyType',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 150,
          hide: true,
        },
        {
          headerName: 'Tissue',
          field: 'tissue',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 100,
          hide: true,
        },
        {
          headerName: 'Sample ID',
          field: 'sampleId',
          autoHeight: true,
          filter: 'agTextColumnFilter',
          wrapText: true,
          width: 100,
          hide: true,
          headerTooltip: 'Sample id that can link to chemical source; typically blindly provided to vendors',
        },
        {
          headerName: 'Repr.',
          headerTooltip: 'Representative sample, as defined by tcpl logic, out of multiple samples of the same chemical tested for a given endpoint',
          autoHeight: true,
          filter: 'agSetColumnFilter',
          wrapText: true,
          width: 100,
          field: 'chidRep',
          hide: true,
        },
      ];
      return columnDefs;
    },
    applyInitialFilters() {
      if (this.gridApi) {
        const hitCallFilter = this.gridApi.getFilterInstance('hitCall');
        const hitCallFilterVal = this.bioactivityCount > 0 ? 'Active' : 'Inactive';
        if (this.bioactivityCount > 0) {
          hitCallFilter.setModel({
            filterType: 'set',
            values: [hitCallFilterVal],
          });
          hitCallFilter.applyModel();
        }
        const repFilter = this.gridApi.getFilterInstance('chidRep');
        const repFilterValue = 'True';
        repFilter.setModel({
          filterType: 'set',
          values: [repFilterValue],
        });
        repFilter.applyModel();

        const intendedTargetFamilyFilter = this.gridApi.getFilterInstance('intendedTargetFamily');
        intendedTargetFamilyFilter.setModel({
          type: 'notContains',
          filter: 'background',
        });
        this.gridApi.onFilterChanged();
      }
    },
    clearSelectedFilter(column) {
      const selectedFilter = this.gridApi.getFilterInstance(column);
      selectedFilter.setModel(null);
      this.gridApi.onFilterChanged();
    },
    onCellClicked(params) {
      const plotParams = {};
      switch (params.column.colId) {
      case 'details':
        this.modal.assayEndpointName = params.data.assayComponentEndpNm;
        this.modal.display = true;
        break;
      default:
      }
    },

    detailsBtn(params) {
      return '<i class="fas fa-file-alt"></i>';
    },
    seqapassRenderer(params) {
      if (params.data.seqAPASS !== null) {
        return `<a target='_blank' href='https://dmap-data-commons-ord.s3.amazonaws.com/ccte/dmap-ccte-ccd/current/seqapass_reports/${params.data.seqAPASS}.zip'>${params.data.seqAPASS} <i class='fa fas fa-download'></i></a> `;
      }
      return '-';
    },
    geneFilterText(params) {
      const col = params.column.colId;
      if (Array.isArray(params.data.geneInfo)) {
        const symbols = params.data.geneInfo;
        const valueText = symbols.reduce((text, symbol, idx) => {
          const delim = idx === symbols.length - 1 ? '' : ' | ';
          text += `${symbol[col]}${delim}`;
          return text;
        }, '');
        return valueText;
      }
    },
    assayListText(params) {
      const col = params.column.colId;
      if (Array.isArray(params.data.assayList)) {
        return params.data.assayList.reduce((acc, al) => {
          if (al[col] !== null) {
            acc += `${al[col]} `;
          }
          return acc;
        }, '');
      }
      return '-';
    },
    genericNumRound2(value) {
      return Number.isNaN(value) || value === '-' ? value : round(value, 2);
    },
    genericNumRound2ValueGetter(value, place) {
      // eslint-disable-next-line radix
      const places = parseInt(place) || 2;
      return Number.isNaN(value) || value === '-' ? value : round(value, places);
    },
    pdfFileNameRenderer(params) {
      if (params.data.pdfFileName !== null) {
        const pdfLink = `<a target='_blank' href='https://dmap-data-commons-ord.s3.amazonaws.com/ccte/dmap-ccte-ccd/current/bioassay_assay_description/${params.data.pdfFileName}'>${params.data.pdfFileName}</a>`;
        return pdfLink;
      }
      return '-';
    },
    aopRenderer(params) {
      if (params.data.aop !== null) {
        const ft = params.data.aop.reduce((acc, aop, idx) => {
          const delim =
            idx === params.data.aop.length - 1 ?
              '' :
              "<span style='color:#aaa'> | </span>";
          acc += `<a target='_blank' href='https://aopwiki.org/aops/${aop}'>${aop}</a>${delim}`;
          return acc;
        }, '');
        return ft;
      }
      return '-';
    },
    aopFilterText(params) {
      if (Array.isArray(params.data.aop)) {
        const symbols = params.data.aop;
        const nameText = symbols.reduce((text, symbol, idx) => {
          const delim = idx === symbols.length - 1 ? '' : ' | ';
          text += `${symbol} ${delim}`;
          return text;
        }, '');
        return nameText;
      }
      return '-';
    },
    geneName(params) {
      if (Array.isArray(params.data.geneName)) {
        const symbols = params.data.geneName;
        const nameText = symbols.reduce((text, symbol, idx) => {
          const delim = idx === symbols.length - 1 ? '' : ' | ';
          text += `${symbol.gene_name}${delim}`;
          return text;
        }, '');
        return nameText;
      }
      return '-';
    },
    geneUrl(params) {
      if (Array.isArray(params.data.geneUrl)) {
        const url = params.data.geneInfo[0].gene_url;
        if (url) {
          return `<a href='${url}' title='Link to gene information' target='_blank' rel='noopener noreferrer'>${url}</a>`;
        }
        return '-';
      }
      return '-';
    },
    geneNameFilterText(params) {
      const ft = params.data.gene.reduce((acc, gene) => {
        acc += `${gene.gene_name} `;
        return acc;
      }, '');
      return ft;
    },
    eventRenderer(params) {
      if (params.data.event !== null) {
        const ft = params.data.event.reduce((acc, e, idx) => {
          const delim =
            idx === params.data.event.length - 1 ?
              '' :
              "<span style='color:#aaa'> | </span>";
          acc += `<a target='_blank' href='https://aopwiki.org/events/${e}'>${e}</a>${delim}`;
          return acc;
        }, '');
        return ft;
      }
      return '-';
    },
    eventFilterText(params) {
      if (!params.data.event) {
        return '';
      }
      const ft = params.data.event.reduce((acc, ev) => {
        acc += `${ev} `;
        return acc;
      }, '');
      return ft;
    },

    flagParser(params) {
      const {flag} = params.data;
      if (!flag) {
        return '-';
      }
      let flagText = '';
      flag.forEach((item, idx) => {
        const textItem = `${idx < flag.length - 1 ? `${item} ; ` : item}`;
        flagText += textItem;
      });
      return flagText;
    },

    maxMedValue(params) {
      const roundedMaxMedVal = parseFloat(params.data.maxMedVal).toFixed(3);
      return `${roundedMaxMedVal}`;
    },
    activeColor(params) {
      params.data.hitc = parseInt(params.data.hitCall, 10);

      return params.data.hitCall === 0 ? {color: '#1565c0'} : {color: '#c62828'};
    },
    plotLink(params) {
      const rep = params.column?.colId === 'repPlot' ? true : false || false;
      const representative = `representative_sample=${rep}&url_env=${encodeURIComponent(process.env.APPLICATION_BASE_API)}`;
      const dtxsid = `&dsstox_id=${this.chemical.dtxsid}`;
      const endpoint = `&assay_endpoint_nm=${encodeURIComponent(params.data.assayComponentEndpNm)}`;
      const bioRepPlotUrl = `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plot?${representative}${endpoint}${dtxsid}`;
      return bioRepPlotUrl;
    },
    repBtn(params) {
      const linkString = this.plotLink(params);
      return `<a href="${linkString}" data-cy="repPlotUrl" target="_blank"><i class="fas fa-chart-line" style="cursor: pointer;"></i></a>`;
    },
    allBtn(params) {
      const linkString = this.plotLink(params, false);
      return `<a href="${linkString}" data-cy="allPlotsUrl" target="_blank"><i class=" fas fa-table" style="cursor: pointer;"></i></a>`;
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.applyInitialFilters();
    },
    toggleRep() {
      this.showRepToggle = !this.showRepToggle;

      const repFilter = this.gridApi.getFilterInstance('chidRep');
      if (this.showRepToggle) {
        const filterVal = 'True';
        repFilter.setModel({
          filterType: 'set',
          values: [filterVal],
        });
        this.gridApi.onFilterChanged();
        return;
      }
      repFilter.setModel(null);
      this.columnApi.setColumnVisible('chidRep', true);
      this.gridApi.onFilterChanged();
    },
    toggleBackground() {
      this.showBackgroundToggle = !this.showBackgroundToggle;
      const intendedTargetFamilyFilter = this.gridApi.getFilterInstance('intendedTargetFamily');
      intendedTargetFamilyFilter.setModel({
        type: 'notContains',
        filter: this.showBackgroundToggle ? 'background' : null,
      });
      this.gridApi.onFilterChanged();
    },
    onExportData(exportType) {
      const excludedExportsCols = ['assayListName', 'selectBox', 'repPlot', 'allPlot', 'details'];
      this.exportKeys = this.parseExportColumns(this.columnApi.getColumns(), excludedExportsCols);

      const timeStamp = this.dateFormat();
      const exportParams = {
        fileName: `${this.chemical.preferredName} Toxcast Summary -${timeStamp}`,
        columnKeys: this.exportKeys,
        autoConvertFormulas: true,
        processHeaderCallback(params) {
          return `${params.columnApi.getDisplayNameForColumn(params.column, null).replaceAll('.', '').replaceAll(' ', '_').toUpperCase()}`;
        },
        processCellCallback(params) {
          const {value} = params;
          const node = params.node.data;
          if (params.column.colDef.colId.includes('gene_url') && node.geneUrl) {
            const newData = params.value.split('|');
            if (newData.length > 1) {
              return params.value;
            }
            if (newData.length === 1) {
              let links = '';
              newData.forEach((item) => {
                const builtLink = `=HYPERLINK("${item}", "${item}") `;
                links += builtLink;
              });
              return links;
            }
            return ' - ';
          }
          if (!value) {
            return ' -  ';
          }
          return value === undefined ? '-' : `${value}`;
        },
        columnApi: this.columnApi,
      };
      if (exportType === 'csv') {
        this.gridApi.exportDataAsCsv(exportParams);
      }
      if (exportType === 'xlsx') {
        this.gridApi.exportDataAsExcel(exportParams);
      }
    },
  },

  head() {
    if (!this.chemical) {
      return {
        title: 'Data Exception -  Toxcast Summary',
        meta: [
          {
            hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  Toxcast Summary`,
            name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  Toxcast Summary`,
            content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}   Toxcast Summary`,
          },
        ],
      };
    }
    return {
      title: `${this.chemical.preferredName} -  Toxcast Summary`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} ${this.chemical.preferredName}  Toxcast Summary`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName}  Toxcast Summary`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName} Chemical Details -  Toxcast Summary`,
        },
      ],
    };
  },
};
</script>

<style scoped type="text/css">
.alertMessage {
  height: 34px !important;
  padding: .25rem .80rem !important;
  color: rgb(36, 33, 33) !important;
  font-weight: 700 !important;
  border: 1px solid grey !important;
}
.loading-spinner {
  z-index: 1070 !important;
}
</style>
