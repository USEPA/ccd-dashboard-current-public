<template>
  <div class="mr-4" style="margin-top:10px">
    <client-only>
      <div class="h2">
        <ccte-help-text
          data-cy="Properties"
          label-type="span"
          :heading-text="`Properties: ${currentSectionName}`"
          help-key="PropertiesHeader"
        />
      </div>
      <chemical-detail-tab-grid-toolbar
        :cname="cname"
        :toolbar-config="toolbarConfig"
        :select-options="selectOptions"
        :select-default="activeSection"
        @onFilter="quickFilter"
      />
      <grid-tips
        v-if="activeSection == 'SUMMARY'"
        ref="summary"
        :saved-state="pageState"
        :cname="cname"
        grid-reference="summary"
        grid-heading="Summary"
        :toolbar-config="toolbarConfig"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @selectProperty="onSummaryClick"
        @onExport="onExport"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
      <grid-tips
        v-show="activeSection != 'SUMMARY'"
        ref="minisummary"
        :saved-state="pageState"
        :cname="minicname"
        grid-reference="minisummary"
        grid-heading="Summary"
        :grid-size="miniSummaryGridSize"
        :config-obj="miniConfigurationObj"
        @onExport="onExport"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
      <grid-tips
        v-show="activeSection != 'SUMMARY' && exConfigurationObj.gridData.length > 0"
        ref="experimental"
        :saved-state="pageState"
        :cname="excname"
        grid-reference="experimental"
        grid-heading="Experimental"
        :grid-size="altgridSize"
        :config-obj="exConfigurationObj"
        @onExport="onExport"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
      <grid-tips
        v-show="activeSection != 'SUMMARY'"
        ref="predicted"
        :saved-state="pageState"
        :cname="predcname"
        grid-reference="predicted"
        grid-heading="Predicted"
        :grid-size="altgridSize"
        :config-obj="predConfigurationObj"
        @onExport="onExport"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
    </client-only>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations, mapState, mapActions,
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
  name: 'PropertiesView',
  components: {
    GridTips,
    ChemicalDetailTabGridToolbar,
  },
  data() {
    return {
      activeProperties: {},
      activeSection: 'SUMMARY',
      selectOptions: [],
      pageState: {
        section: null,
        gridRef: null,
        colState: null,
        filter: null,
        sort: null,
      },
      currentSectionName: '',
      tableHeader: 'Summary',
      active: 'properties',
      cname: {
        camelName: 'chemicalProperties',
        hyphenName: 'chemical-properties',
        baseName: 'Chemical Properties',
      },
      excname: {
        camelName: 'experimental',
        hyphenName: 'experimental',
        baseName: 'Experimental',
      },
      predcname: {
        camelName: 'predicted',
        hyphenName: 'predicted',
        baseName: 'Predicted',
      },
      minicname: {
        camelName: 'summary',
        hyphenName: 'summary',
        baseName: 'Summary',
      },
      toolbarConfig: {
        select: true,
        search: true,
        radio: false,
        export: false,
      },
      gridConfigurationObj: {},
      miniConfigurationObj: {},
      exConfigurationObj: {},
      predConfigurationObj: {},
      gridSize: 'height: 400px; width: 100%; padding: .75rem; overflow:auto;',
      miniSummaryGridSize: 'width:100%; overflow:auto',
      altgridSize: ' width:100%; overflow:auto',
      gridRefs: {},
    };
  },
  computed: {
    ...mapGetters({
      getSummaryGridDefs: 'chemicalProperties/getSummaryGridDefs',
      getExperimentalGridDefs: 'chemicalProperties/getExperimentalGridDefs',
      getPredictedGridDefs: 'chemicalProperties/getPredictedGridDefs',
      getMiniSummaryGridDefs: 'chemicalProperties/getMiniSummaryGridDefs',
      getPropertyData: 'chemicalProperties/getPropertyData',
      getSummaryData: 'chemicalProperties/getSummaryData',
      getSelectListValues: 'chemicalProperties/getSelectListValues',
      getMiniSummaryData: 'chemicalProperties/getMiniSummaryData',
    }),
    ...mapState({
      activeChemical: state => state.results.activeChemical,
      propertySelection: state => state.chemicalProperties.propertySelection,
    }),
  },
  watch: {
    propertySelection(n, o) {
      this.getSelectValue(n);
    },
  },
  head() {
    return {
      title: `${this.activeChemical.preferredName} Properties`,
      meta: [],
    };
  },
  async asyncData(context) {
    try {
      await context.app.store.dispatch('chemicalProperties/asyncChemicalProperties', context);
      if (context.route.query.deepLink) {
        const linkId = context.route.query.deepLink;
        const deepLink = await context.app.$repositories.deepLinks.find(linkId);
        return deepLink;
      }
    } catch (err) {
      // console.error(`ERROR CALLING chemical properties api ${err}`)
    }
  },
  beforeMount() {
    this.activeProperties = this.getPropertyData();
    this.selectOptions = this.getSelectListValues();
    this.currentSectionName = 'Summary';
    this.gridConfigurationObj = {
      gridColumnDefs: this.getSummaryGridDefs(),
      gridData: this.getSummaryData(),
      gridOptions: {
        unSortIcon: true,
        components: {
          qmrfUrl: this.qmrfUrl,
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        suppressContextMenu: true,
        domLayout: 'normal',
        headerHeight: 40,
        popupParent: document.querySelector('body'),
        defaultColDef: {
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
          floatingFilter: false,
        },
      },
    };

    this.miniConfigurationObj = {
      gridColumnDefs: this.getMiniSummaryGridDefs(),
      gridData: [],
      gridOptions: {
        popupParent: document.querySelector('body'),
        headerHeight: 40,
        unSortIcon: true,
        components: {
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        suppressContextMenu: true,
        domLayout: 'autoHeight',
        defaultColDef: {
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
          floatingFilter: false,
        },
      },
    };

    this.exConfigurationObj = {
      gridColumnDefs: this.getExperimentalGridDefs(),
      gridData: [],
      gridOptions: {
        popupParent: document.querySelector('body'),
        headerHeight: 40,
        unSortIcon: true,
        components: {
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },

        suppressContextMenu: true,
        domLayout: 'autoHeight',
        defaultColDef: {
          floatingFilter: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: true},
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
        },
      },
    };

    this.predConfigurationObj = {
      gridColumnDefs: this.getPredictedGridDefs(),
      gridData: [],
      gridOptions: {
        popupParent: document.querySelector('body'),
        unSortIcon: true,
        components: {
          qmrfUrl: this.qmrfUrl,
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        defaultColDef: {
          floatingFilter: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: true},
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
        },
        suppressContextMenu: true,
        headerHeight: 50,
        domLayout: 'autoHeight',
        animateRows: false,
        isExternalFilterPresent: true,
      },
    };
  },
  mounted() {
    if (this.deepLink) {
      this.pageState = this.deepLink;
      // console.log(this.pageState)
      this.activeSection = this.deepLink.activeSection;
      // console.log(this.activeSection)
      this.getSelectValue(this.activeSection, '');
    } else if (window.localStorage.getItem('gridState')) {
      const saved = JSON.parse(window.localStorage.getItem('gridState'));
      const pagePath = this.$route.path.split('/')[2];
      if (saved.page === pagePath) {
        this.pageState = saved;
        // eslint-disable-next-line radix
        this.activeSection = this.pageState.activeSection;
        this.getSelectValue(this.activeSection, '');
      }
    }
  },
  methods: {
    ...mapMutations('chemicalProperties', ['setPropertySelection']),
    onExport(params) {
      params.processCellCallback = (p) => {
        const rangeCols = ['predrange', 'exrange', 'range'];
        if (rangeCols.includes(p.column.colId) && p.node.id !== 0) {
          return this.rangeStringFormat(p.value);
        }
        return p.value;
      };
      params.fileName = `${this.activeChemical.dtxsid}-${params.fileName}-${this.currentSectionName}.${params.fileType}`;
      if (params.fileType === 'csv') {
        this.gridRefs[params.reference].gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridRefs[params.reference].gridApi.exportDataAsExcel(params);
      }
    },

    quickFilter(input) {
      this.gridRefs.summary.gridApi.setQuickFilter(input);
    },

    onSummaryClick(params) {
      if (params.column.colId === 'property') {
        this.setPropertySelection(params.data.propId);
        this.getSelectValue(params.data.propId, params.text);
      }
    },

    getSelectValue(value, text) {
      this.activeSection = value;

      if (this.activeSection === 'SUMMARY') {
        this.gridConfigurationObj.gridData = this.getSummaryData();
        this.currentSectionName = 'Summary';
      } else {
        this.miniConfigurationObj.gridData = this.getMiniSummaryData(this.activeSection);
        this.currentSectionName = this.selectOptions.find(obj => obj.value === this.activeSection).text;
        if (this.activeProperties.find(obj => obj.arrKey === this.activeSection).experimental) {
          this.exConfigurationObj.gridData = this.activeProperties.find(obj => obj.arrKey === this.activeSection).experimental.rawData;
        } else {
          this.exConfigurationObj.gridData = [];
        }

        if (this.activeProperties.find(obj => obj.arrKey === this.activeSection).predicted) {
          this.predConfigurationObj.gridData = this.activeProperties.find(obj => obj.arrKey === this.activeSection).predicted.rawData;
        } else {
          this.predConfigurationObj.gridData = [];
        }
      }
    },
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
    onGridRef(params) {
      this.gridRefs[params.reference] = params;
    },
  },
};
</script>
<style>
.ag-header-cell-label {
  justify-content: left !important;
  margin-top: .15rem;
  margin-bottom: .35rem;
  font-weight: bold  !important;
}
.ag-header-cell-text {
    justify-content: center;
    color: #222;
    font-size: 11px;
    font-weight: 600  !important;
}

</style>
