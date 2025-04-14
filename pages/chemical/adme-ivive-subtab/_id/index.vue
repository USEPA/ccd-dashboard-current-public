<template>
  <div class="mr-3">
    <client-only>
      <div class="h2">
        <ccte-help-text
          data-cy="ADME-IVIVEHeader"
          label-type="span"
          heading-text="ADME - IVIVE"
          help-key="ADME IVIVE"
        />
      </div>
      <chemical-detail-tab-grid-toolbar
        :cname="cname"
        :toolbar-config="toolbarConfig"
        @onFilter="quickFilter"
      />
      <grid-tips
        :cname="cname"
        grid-reference="ivive"
        grid-heading="IVIVE"
        :toolbar-config="toolbarConfig"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @onExport="exportData"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
    </client-only>
  </div>
</template>

<script>
import {
  mapState, mapGetters,
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
  name: 'IviveView',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
  },
  data() {
    return {
      cname: {
        camelName: 'admeIvive',
        hyphenName: 'adme-ivive',
        baseName: 'ADME IVIVE',
      },
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: false,
      },
      gridConfigurationObj: {},
      gridSize: 'width:100% overflow:auto',
      columnDefs: [],
      gridApi: null,
      columnApi: null,
      title: '',
      activeTab: 'adme-ivive-subtab',
    };
  },
  computed: {
    ...mapGetters({
      getColumnDefs: 'chemicalADME/getColumnDefs',
    }),
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData({app, params}) {
    try {
      const admeIv = await app.$repositories.admeIvive.find(params.id);
      const iviveSortOrder = [
        'Intrinsic Hepatic Clearance',
        'Fraction Unbound in Plasma',
        'Volume of Distribution',
        'Days to Steady State',
        'PK Half Life',
        'Steady-State Plasma Concentration',
      ];
      if (admeIv.ivive) {
        return {iviveData: admeIv.ivive.map((c) => {
          c.orderBy = iviveSortOrder.indexOf(c.label);
          return c;
        })};
      }
      return {iviveData: []};
    } catch (err) {
      console.error(`Error in ADME - IVIVE: ${err}`);
    }
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - IVIVE`,
      meta: [],
    };
  },
  beforeMount() {
    this.gridConfigurationObj = {
      gridColumnDefs: this.getColumnDefs(),
      gridData: this.iviveData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        headerClass: 'hide-filter-icon',
        floatingFilter: true,
      },
      gridOptions: {
        popupParent: document.querySelector('body'),
        components: {
          roundTo2: this.roundTo2,
          whenEmpty: this.whenEmpty,
        },
        unSortIcon: true,
        headerHeight: 60,
        suppressContextMenu: true,
        domLayout: 'autoHeight',
        animateRows: true,
        isExternalFilterPresent: true,
      },
    };
  },
  mounted() {
    if (window.localStorage.getItem('gridState')) {
      const saved = JSON.parse(window.localStorage.getItem('gridState'));
      const pagePath = this.$route.path.split('/')[2];
      if (saved.page === pagePath) {
        this.pageState = saved;
        // eslint-disable-next-line radix
        this.activeSection = saved.activeSection;
        this.activeCategory = saved.category;
        this.selectDataType(this.activeSection);
        if (this.activeCategory === 'eco') {
          this.radioConfig.selected[0] = false;
          this.radioConfig.selected[1] = true;
        }
      }
    }
  },
  methods: {
    onGridState(params) {
      const pageState = {};
      pageState.page = params.page;
      pageState.gridRef = params.reference;
      pageState.colStateSort = params.colStateSort;
      pageState.sort = params.sort;
      pageState.filter = params.filter;
      pageState.activeSection = this.activeSection;
      pageState.category = this.activeCategory;
      window.localStorage.setItem('gridState', JSON.stringify(pageState));
    },
    exportData(params) {
      params.fileName = `${this.chemical.dtxsid}_${params.fileName}.${params.fileType}`;
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridApi.exportDataAsExcel(params);
      }
    },
    quickFilter(input) {
      this.gridApi.setQuickFilter(input);
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      // percentile: {
      //     filterType: 'text',
      //     operator: 'AND',
      //     condition1: {filterType: 'text', type: 'notEqual', filter: 'NA'},
      //     condition2: {filterType: 'text', type: 'notEqual', filter: '-'},
      //     condition2: {filterType: 'text', type: 'notEqual', filter: '-'},
      //   },
      const gridFilter = {
        species: {values: ['Human'], filterType: 'set'},
        model: {values: ['1compartment', '3compartmentss', 'NA', 'ADMet'], filterType: 'set'},
        percentile: {values: ['NA', '95%'], filterType: 'set'},
      };
      this.gridApi.setFilterModel(gridFilter);
      this.gridApi.onFilterChanged();
    },
  },
};
</script>
<style scoped lang="scss">
.toolbar {margin-top: 1rem !important;}
.row {
    flex-wrap: nowrap ;
}
</style>

