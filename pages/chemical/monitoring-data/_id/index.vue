<template>
  <div>
    <client-only>
      <div class="h2">
        <ccte-help-text
          data-cy="MonitoringDataHeader"
          label-type="span"
          :heading-text="`National Health and Nutrition Examination Survey`"
          help-key="SR NHANES Table"
        /> (<a href="http://www.cdc.gov/nchs/nhanes" target="_blank">NHANES</a>) Inferences (mg/kg-bw/day)
      </div>

      <div class="row pr-4">
        <div class="col">
          <chemical-detail-tab-grid-toolbar
            :cname="cname"
            :toolbar-config="toolbarConfig"
            :qsearch="qsearch"

            @onExport="exportData"
            @onFilter="quickFilter"
          />
        </div>
      </div>
      <div class="row pr-4">
        <div class="col">
          <grid-tips
            :cname="cname"
            grid-reference="summary"
            :grid-heading="tableHeader"
            :show-export="false"
            :toolbar-config="toolbarConfig"
            :grid-size="gridSize"
            :config-obj="gridConfigurationObj"
            @cellClicked="onSummaryClick"
            @gridRef="onGridRef"
          />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import {
  mapGetters, mapState,
} from 'vuex';
import ChemicalDetailTabGridToolbar from '~/components/toolbars/gridToolbar/ChemicalDetailTabGridToolbar.vue';
import GridTips from '~/components/grids/GridWithToolTips.vue';

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
  name: 'MonitoringDataView',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
  },

  data() {
    return {
      exposureMonitoringData: null,
      activeSection: 0,
      currentSectionName: '',

      cname: {
        camelName: 'monitoringData',
        hyphenName: 'monitoring-data',
        baseName: 'Monitoring Data',
      },
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: true,
      },
      qsearch: '',
      selectOptions: [],

      gridConfigurationObj: {},
      tableHeader: 'Monitoring Data',
      gridSize: 'height:450px;width:100%; overflow:auto',

      gridApi: null,
      columnApi: null,
    };
  },
  computed: {
    ...mapGetters({
      getSummaryGridDefs: 'exposureMonitoring/getSummaryGridDefs',

    }),
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    const exposureMonitoringData =
      await context.app.$repositories.exposure.monitoringSearchByDtxsid(context.params.id);
    return {exposureMonitoringData};
  },
  beforeMount() {
    const gridColumnDefs = this.getSummaryGridDefs();
    const gridData = this.exposureMonitoringData;

    this.gridConfigurationObj = {
      gridColumnDefs,
      gridData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: false,
        unSortIcon: true,
      },
      gridOptions: {
        headerHeight: 40,
        rowHeight: 28,
        unSortIcon: true,
        domLayout: 'autoHeight',
        rowStyle: {fontSize: '11px', color: '#444'},
        components: {
          ncctRound2: this.ncctRound2,
        },
      },
    };
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Exposure: Monitoring Data`,
      meta: [],
    };
  },
  methods: {
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },

    quickFilter(input) {
      this.gridApi.setQuickFilter(input);
    },
    exportData(params) {
      params.fileName = `${this.chemical.dtxsid} ${params.fileName}.${params.fileType}`;
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridApi.exportDataAsExcel(params);
      }
    },


    onSummaryClick(params) {
      // if (params.colId === 'property') {
      //   this.getSelectValue(params.value, params.text)
      // }
    },


  },

};
</script>
