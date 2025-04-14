<template>
  <client-only>
    <div class="mr-4" style="margin-top:10px">
      <div class="h2">
        <ccte-help-text
          data-cy="ExposureProductionVolume"
          label-type="span"
          :heading-text="`Exposure - Production Volume`"
          help-key="SR Exposure Production Volume"
        />
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
  name: 'ExposureProductionView',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
  },

  data() {
    return {
      productionVolumeData: null,
      activeSection: 0,
      currentSectionName: '',

      cname: {
        camelName: 'ProductionData',
        hyphenName: 'productions-data',
        baseName: 'Production Volume Data',
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
      tableHeader: 'Production Volume',
      gridSize: 'height:450px;width:100%; overflow:auto',
      gridApi: null,
      columnApi: null,
    };
  },
  computed: {
    ...mapGetters({
      getSummaryGridDefs: 'exposureProduction/getSummaryGridDefs',
    }),
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    const productionVolumeData = await context.app.$repositories.exposure.productionVolumeSearchByDtxsid(context.params.id);
    return {productionVolumeData};
  },
  beforeMount() {
    const gridColumnDefs = this.getSummaryGridDefs();
    const gridData = this.productionVolumeData;
    gridData.forEach(row => row.amount = ((row.amount === null) ? '-' : row.amount) + ((row.cnt > 0) ? '*' : ''));
    this.gridConfigurationObj = {
      gridColumnDefs,
      gridData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
      gridOptions: {
        headerHeight: 40,
        unSortIcon: true,
        floatingFilter: false,
        rowHeight: 28,
        domLayout: 'autoHeight',
        rowStyle: {fontSize: '11px', color: '#444'},
      },
    };
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Exposure: Exposure Production Volumes`,
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
      params.fileName = `${this.chemical.dtxsid} Production Volume.${params.fileType}`;
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
