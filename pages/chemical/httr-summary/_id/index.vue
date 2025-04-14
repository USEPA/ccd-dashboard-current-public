<template>
  <div>
    <div class="row pr-4">
      <div class="col-12 h2 pl-4">
        <ccte-help-text
          data-cy="BioactivityHttrSummary"
          label-type="span"
          :heading-text="`Bioactivity - HTTr Summary`"
          help-key="SR HTTr Summary"
        />
      </div>
    </div>
    <client-only>
      <div v-if="isPlot > 0" class="row pr-4">
        <div class="col-12 h2">
          <div id="httr-plot-container" class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
            <div v-if="showPlotLoading" class="d-flex justify-content-center mt-5 loading-spinner">
              <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <iframe
              v-if="isPlot > 0"
              ref="plotlyPlot"
              data-cy="httrSummaryPlot"
              class="embed-responsive-item plotly-iframe"
              :src="plotUrl"
              frameborder="0"
            />
          </div>
        </div>
      </div>
      <div class="row pr-4">
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
              style="height: 600px; min-width: 1250px; width: 100%; overflow: auto;"
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
          HTTr Details
        </template>
        <template #tabs>
          <httr-htpp-detail-tabs :data-identifiers="modal.dataIdentifiers" />
        </template>
      </assay-modal>
    </client-only>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';

import {AgGridVue} from 'ag-grid-vue';
import httrDefs from './httrColumnDefs';
import AssayModal from '~/components/assays/AssayModal.vue';
import HttrHtppDetailTabs from '~/components/httrHtpp/HttrHtppDetailTabs.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';
import GridExportWithOptions from '~/components/toolbars/gridToolbar/GridExportWithOptions.vue';
import SeqaPassList from '~/components/cellRenderers/SeqaPassList.vue';
import ExposureTimePopup from '~/components/cellRenderers/ExposureTimePopup.vue';
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
  name: 'HttrSummaryView',
  components: {
    AgGridVue,
    GridExportWithOptions,
    // eslint-disable-next-line vue/no-unused-components
    QcFlagPopover,
    HttrHtppDetailTabs,
    AssayModal,
    // eslint-disable-next-line vue/no-unused-components
    ExposureTimePopup,
    // eslint-disable-next-line vue/no-unused-components
    PopOverUnderline,
    // eslint-disable-next-line vue/no-unused-components
    SeqaPassList,
  },
  data: () => ({
    showPlotLoading: true,
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
    plotUrl() {
      return `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotSummaryHTTr?url_env=${process.env.APPLICATION_BASE_API}&dsstox_id=${this.chemical.dsstoxSubstanceId}`;
    },
    ...mapGetters({
      getExportHttrColDefs: 'biosummary/getExportHttrColDefs',
      getIsPlot: 'httr/getIsPlot',
    }),
  },
  async asyncData(context) {
    const thisContext = context;
    const chemical = await context.app.store.state.results.activeChemical;
    const httrArray = await context.app.store.dispatch('httr/asyncHttr', context);
    const isPlot = await context.app.store.dispatch('httr/isPlot', context);
    return {
      chemical, httrArray, isPlot,
    };
  },
  beforeMount() {
    this.exportColDefs = this.getExportHttrColDefs();
    this.rowData = this.httrArray;
    this.gridOptions = {
      domLayout: 'normal',
      valueCache: true,
      rowSelection: 'multiple',
      headerHeight: 50,
      unSortIcon: true,
      tooltipShowDelay: 0,
      suppressContextMenu: true,
      enableCellTextSelection: true,
      components: {
        detailsBtn: this.detailsBtn,
        repBtn: this.repBtn,
        roundTo2: this.roundTo2,
        ncctRound2: this.ncctRound2,
      },
      defaultColDef: {
        filter: 'agTextColumnFilter',
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
      columnDefs: httrDefs,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const iframe = this.$refs.plotlyPlot;
      if (iframe) {
        this.$nuxt.$loading.start();
      }
      setTimeout(() => {
        this.$nuxt.$loading.finish();
      }, 2000);
    });
  },
  methods: {
    onColumnVisible(params) {
      this.gridApi.resetRowHeights();
    },
    onCellClicked(e) {
      let params = {};
      switch (e.column.colId) {
      case 'detailsPopup': {
        this.modal.dataIdentifiers = {
          annotations: e.data.signature,
          dataset: e.data.dataset,
          citations: e.data.dataset,
          type: 'HTTr',
        };
        this.modal.display = true;
        break;
      }
      case 'concRespPlot':
        params = {data: e.data};
        this.openPlot(params);
        break;
      case 'allPlot':
        params = {endpoint: e.value, rep: false};
        this.openPlot(params);
        break;
      default:
      }
    },
    repBtn(params) {
      const linkString = this.openPlot(params);
      return `<a href="${linkString}" data-cy="concRespPlotUrl" target="_blank"><i class="fas fa-chart-line" style="cursor: pointer;"></i></a>`;
    },
    openPlot(params) {
      const appEnv = `&url_env=${encodeURIComponent(process.env.APPLICATION_BASE_API)}`;
      const sampleId = `&sampleId=${params.data.sampleId}`;
      const signature = `&signature=${params.data.signature}&cellType=${params.data.cellType}&dataset=${params.data.dataset}`;
      const concRespPlotUrl = `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotfit2?${appEnv}${sampleId}${signature}`;
      return concRespPlotUrl;
    },
    detailsBtn(params) {
      return '<i class="fas fa-file-alt" style="cursor: pointer;"></i>';
    },
    geneFilterText(params) {
      const ft = params.data.geneInfo.reduce((acc, gene) => {
        acc += `${gene.gene_symbol} `;
        return acc;
      }, '');
      return ft;
    },
    aopRenderer(params) {
      if (params.data.aop !== null) {
        const ft = params.data.aop.reduce((acc, aop, idx) => {
          const delim = (idx === params.data.aop.length - 1) ? '' : '<span style=\'color:#aaa\'> | </span>';
          acc += `<a target='_blank' href='https://aopwiki.org/aops/${aop}'>${aop}</a>${delim}`;
          return acc;
        }, '');
        return ft;
      }
      return '-';
    },
    aopFilterText(params) {
      if (!params.data.aop) { return ''; }
      const ft = params.data.aop.reduce((acc, aop) => {
        acc += `${aop} `;
        return acc;
      }, '');
      return ft;
    },
    geneName(params) {
      const symbols = params.data.geneInfo;
      const nameText = symbols.reduce((text, symbol, idx) => {
        const delim = (idx === symbols.length - 1) ? '' : '<br>';
        text += `${symbol.gene_name}${delim}`;
        return text;
      }, '');
      return nameText;
    },
    geneUrl(params) {
      const url = params.data.geneInfo[0].gene_url;
      if (url) {
        return `<a href='${url}' title='Link to gene information' target='_blank'>${url}</a>`;
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
          const delim = (idx === params.data.event.length - 1) ? '' : '<span style=\'color:#aaa\'> | </span>';
          acc += `<a target='_blank' href='https://aopwiki.org/events/${e}'>${e}</a>${delim}`;
          return acc;
        }, '');
        return ft;
      }
      return '-';
    },
    eventFilterText(params) {
      if (!params.data.event) { return ''; }
      const ft = params.data.event.reduce((acc, ev) => {
        acc += `${ev} `;
        return acc;
      }, '');
      return ft;
    },

    flagParser(params) {
      const {flag} = params.data;
      if (!flag) { return '-'; }
      let flagText = '';
      flag.forEach((item, idx) => {
        const textItem = `${idx < flag.length - 1 ? `${item} ; ` : item}`;
        flagText += textItem;
      });
      return flagText;
    },

    maxMedValue(params) {
      const roundedMaxMedVal = parseFloat(params.data.maxMedVal).toFixed(3);
      return `${roundedMaxMedVal} - ${params.data.maxMedUnits}`;
    },
    activeColor(params) {
      params.data.hitc = parseInt(params.data.hitCall, 10);

      return (params.data.hitCall === 0) ? {color: '#1565c0'} : {color: '#c62828'};
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
        fileName: `${this.chemical.preferredName}-HTTr-Summary-${timeStamp}`,
        gridApi: this.gridApi,
        fileFormat: params,
        columns: this.exportColDefs,
        deriveFields: [
          {
            source: 'geneInfo',
            target: 'geneSymbol',
          }, {
            source: 'geneInfo',
            target: 'geneName',
          }, {
            source: 'geneInfo',
            target: 'geneUrl',
          },
        ],
      });
    },
  },

  head() {
    if (!this.chemical) {
      return {
        title: 'Data Exception -  HTTr Summary',
        meta: [
          {
            hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  HTTr Summary`,
            name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  HTTr Summary`,
            content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}   HTTr Summary`,
          },
        ],
      };
    }
    return {
      title: `${this.chemical.preferredName} -  HTTr Summary`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} ${this.chemical.preferredName}  HTTr Summary`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName}  HTTr Summary`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName} Chemical Details -  HTTr Summary`,
        },
      ],
    };
  },
};
</script>
