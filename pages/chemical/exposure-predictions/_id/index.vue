<template>
  <client-only>
    <div style="margin-top:10px">
      <div class="h2">
        <ccte-help-text
          data-cy="ExposurePredictionsHeader"
          label-type="span"
          :heading-text="`Exposure - Exposure Predictions (mg/kg-bw/day)`"
          help-key="SR Expo Pred. Table"
        />
      </div>
      <chemical-detail-tab-grid-toolbar
        :cname="cname"
        :toolbar-config="toolbarConfig"
        :qsearch="qsearch"
        data-cy="DemographicsPredictionsToolbar"
        @onExport="exportData"
        @onFilter="quickFilter"
      />
      <grid-tips
        :cname="cname"
        grid-reference="demographic"
        :grid-heading="cname.baseName"
        :show-export="false"
        :toolbar-config="toolbarConfig"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @gridRef="onGridRef"
      />
      <chemical-detail-tab-grid-toolbar
        :cname="genericCname"
        :toolbar-config="toolbarConfigG"
        :qsearch="qsearch"
        data-cy="GeneralPredictionsToolbar"
        @onExport="exportData"
        @onFilter="quickFilter"
      />
      <grid-tips
        :cname="genericCname"
        grid-reference="generic"
        :grid-heading="genericCname.baseName"
        :show-export="false"
        :grid-size="gridSize"
        :config-obj="genericGridConfigurationObj"
        @gridRef="onGridRef"
      />
    </div>
  </client-only>
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
  name: 'ExposurePredictionsView',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
  },

  data() {
    return {
      exposurePredictionData: null,
      activeSection: 0,
      currentSectionName: '',
      cname: {
        camelName: 'DemographicsPredictionsData',
        hyphenName: 'demographics-predictions-data',
        baseName: 'Demographics Predictions Data',
      },
      genericCname: {
        camelName: 'GeneralPredictionsData',
        hyphenName: 'general-predictions-data',
        baseName: 'General Predictions Data',
      },
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: true,
      },
      toolbarConfigG: {
        select: false,
        search: false,
        radio: false,
        export: true,
      },
      qsearch: '',
      selectOptions: [],
      gridConfigurationObj: {},
      genericGridConfigurationObj: {},
      tableHeader: 'Exposure Predictions',
      gridSize: 'height:320px;width:100%; overflow:auto',
      genericGridApi: null,
      genericColumnApi: null,
      gridApi: null,
      columnApi: null,
    };
  },
  computed: {
    ...mapGetters({
      getDemographicGridDefs: 'exposurePredictions/getDemographicGridDefs',
      getGenericGridDefs: 'exposurePredictions/getGenericGridDefs',
    }),
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    const exposureSortOrder = [
      'SEEM2 Heuristic',
      'SEEM3 Consensus',
      'FINE',
      'Food.Contact',
      'RAIDAR',
      'SHEDS.Direct',
      'SHEDS.Indirect',
      'USETox.Diet',
      'USETox.Indust',
      'USETox.Pest',
      'USETox.Res',
    ];
    let exposurePredictionData = [];
    let exposurePredictionGenericData = [];
    try {
      exposurePredictionData = await context.app.$repositories.exposure.demographicPredictionSearchByDtxsid(context.params.id);
      if (exposurePredictionData === undefined) {
        exposurePredictionData = [];
      }
    } catch (err) {
      context.$sentry.captureMessage(`EXPOSURE PREDICTIONS ERROR-demographicPredictionSearchByDtxsidy ${context.params.id} :  ${err}`);
    }
    try {
      exposurePredictionGenericData = await context.app.$repositories.exposure.predictionGenericByDtxsid(context.params.id);
      if (exposurePredictionGenericData === undefined) {
        exposurePredictionGenericData = [];
      }
    } catch (err) {
      context.$sentry.captureMessage(`EXPOSURE PREDICTIONS ERROR-predictionGenericByDtxsid ${context.params.id} :  ${err}`);
    }
    return {
      exposurePredictionData: exposurePredictionData.map((c) => {
        c.orderBy = exposureSortOrder.indexOf(c.predictor);
        return c;
      }),
      exposurePredictionGenericData,

    };
  },
  beforeMount() {
    let gridColumnDefs = this.getDemographicGridDefs();
    let gridData = this.exposurePredictionData;
    this.gridConfigurationObj = {
      gridColumnDefs,
      gridData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        suppressMenu: false,
        headerClass: 'hide-filter-icon',
        floatingFilter: true,
        unSortIcon: true,
      },
      gridOptions: {
        rowHeight: 28,
        suppressContextMenu: true,
        headerHeight: 40,
        unSortIcon: true,
        domLayout: 'normal',
        animateRows: true,
        rowStyle: {fontSize: '11px', color: '#444'},
        components: {
          ncctRound2: this.ncctRound2,
        },
      },
    };
    gridColumnDefs = this.getGenericGridDefs();
    gridData = this.exposurePredictionGenericData;
    this.genericGridConfigurationObj = {
      gridColumnDefs,
      gridData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: false,
        suppressMenu: false,
        floatingFilter: false,
        unSortIcon: true,
      },
      gridOptions: {
        rowHeight: 28,
        headerHeight: 40,
        domLayout: 'normal',
        unSortIcon: true,
        animateRows: true,
        rowStyle: {fontSize: '11px', color: '#444'},
        components: {
          ncctRound2: this.ncctRound2,
          ncctNumericCommaSep: this.ncctNumericCommaSep,
        },
      },
    };
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Exposure: Exposure Predictions`,
      meta: [],
    };
  },
  methods: {
    onGridRef(params) {
      if (params.reference === 'demographic') {
        this.gridApi = params.gridApi;
        this.columnApi = params.columnApi;
        const instance = this.gridApi.getFilterInstance('predictor');
        instance.setModel({values: ['SEEM2 Heuristic', 'SEEM3 Consensus']});
        this.gridApi.onFilterChanged();
      }
      if (params.reference === 'generic') {
        this.genericGridApi = params.gridApi;
        this.genericColumnApi = params.columnApi;
      }
    },
    quickFilter(input) {
      this.gridApi.setQuickFilter(input);
    },
    exportData(params) {
      params.fileName = `${this.chemical.dtxsid || this.chemical.dtxcid}_${params.fileName}`;
      let gridApiInstance = this.gridApi;
      if (params.fileName.includes('general')) {
        gridApiInstance = this.genericGridApi;
      }
      if (params.fileType === 'csv') {
        gridApiInstance.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        gridApiInstance.exportDataAsExcel(params);
      }
    },
  },
};
</script>
