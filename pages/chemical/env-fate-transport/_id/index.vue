<template>
  <div>
    <client-only>
      <div class="h2">
        <ccte-help-text
          data-cy="EnvFateTransport"
          label-type="span"
          :heading-text="`Env. Fate/Transport: ${currentSectionName}`"
          help-key="FateTransportHeader"
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
        v-show="activeSection == 'SUMMARY'"
        ref="summary"
        :cname="cname"
        grid-reference="summary"
        grid-heading="Summary"
        :toolbar-config="toolbarConfig"
        :grid-size="gridSize"
        :saved-state="pageState"
        :config-obj="gridConfigurationObj"
        @onExport="onExport"
        @selectProperty="onSummaryClick"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
      <grid-tips
        v-show="activeSection != 'SUMMARY'"
        ref="minisummary"
        :cname="minicname"
        grid-reference="minisummary"
        grid-heading="Summary"
        :grid-size="miniSummaryGridSize"
        :saved-state="pageState"
        :config-obj="miniConfigurationObj"
        @onExport="onExport"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
      <grid-tips
        v-show="activeSection != 'SUMMARY' && exConfigurationObj.gridData.length"
        ref="experimental"
        :cname="excname"
        grid-reference="experimental"
        grid-heading="Experimental"
        :grid-size="exGridSize"
        :saved-state="pageState"
        :config-obj="exConfigurationObj"
        @onExport="onExport"
        @gridRef="onGridRef"
        @gridState="onGridState"
      />
      <grid-tips
        v-show="activeSection != 'SUMMARY'"
        ref="predicted"
        :cname="predcname"
        grid-reference="predicted"
        grid-heading="Predicted"
        :grid-size="predGridSize"
        :saved-state="pageState"
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
  mapGetters, mapMutations, mapState,
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
  name: 'EnvFateTransportView',
  components: {
    GridTips,
    ChemicalDetailTabGridToolbar,
  },
  data() {
    return {
      activeFateTransport: {},
      activeSection: 'SUMMARY',
      active: 'env-fate-transport',
      currentSectionName: '',
      selectOptions: [],
      tableHeader: 'Summary',
      pageState: {
        section: 99,
        gridRef: null,
        colState: null,
        filter: null,
      },
      cname: {
        camelName: 'fateTransport',
        hyphenName: 'fatetransport',
        baseName: 'Fate/Transport',
      },
      toolbarConfig: {
        select: true,
        search: true,
        radio: false,
        export: false,
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
      gridConfigurationObj: {},
      miniConfigurationObj: {},
      exConfigurationObj: {},
      predConfigurationObj: {},
      qsearch: '',
      gridSize: 'overflow:auto',
      miniSummaryGridSize: 'width:100%; overflow:auto',
      altgridSize: 'width:100%; overflow:auto',
      exGridSize: 'height:300px;width:100%; overflow:auto',
      predGridSize: 'height:300px; width:100%; overflow:auto',
      gridRefs: {},
    };
  },
  computed: {
    ...mapGetters({
      getFateTransport: 'fateTransport/getFateTransport',
      getSelectListValues: 'fateTransport/getSelectListValues',
      getSummaryData: 'fateTransport/getSummaryData',
      getSummaryGridDefs: 'fateTransport/getSummaryGridDefs',
      getExperimentalGridDefs: 'fateTransport/getExperimentalGridDefs',
      getPredictedGridDefs: 'fateTransport/getPredictedGridDefs',
      getMiniSummaryData: 'fateTransport/getMiniSummaryData',
      getMiniSummaryGridDefs: 'fateTransport/getMiniSummaryGridDefs',
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
  async asyncData(context) {
    try {
      const gotFate = await context.app.store.dispatch('fateTransport/asyncFateTransport', context);
      // if (context.route.query.deepLink && gotFate?.fateDetails.length > 0) {
      //   try {
      //     const linkId = context.route.query.deepLink;
      //     const deepLink = await context.app.$repositories.deepLinks.find(linkId);
      //     return deepLink;
      //   } catch (e) {
      //     console.error(`ERROR CALLING deepLink ${err}`);
      //   }
      // }
    } catch (err) {
      console.error(`ERROR CALLING fateTransport/asyncFateTransport ${err}`);
    }
  },
  head() {
    return {
      title: `${this.activeChemical.preferredName} Env. Fate/Transport`,
      meta: [],
    };
  },
  beforeMount() {
    this.activeFateTransport = this.getFateTransport();
    this.selectOptions = this.getSelectListValues();
    this.currentSectionName = 'Summary';

    this.gridConfigurationObj = {
      gridColumnDefs: this.getSummaryGridDefs().map((col) => {
        if (col.valueFormatter) {
          col.valueFormatter = this[col.valueFormatter];
        }
        if (col.valueGetter) {
          col.valueGetter = this[col.valueGetter];
        }
        return col;
      }),
      gridData: this.getSummaryData(),
      gridOptions: {
        unSortIcon: true,
        headerHeight: 50,
        components: {
          qmrfUrl: this.qmrfUrl,
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        suppressContextMenu: true,
        domLayout: 'autoHeight',
        defaultColDef: {
          filter: 'agTextColumnFilter',
          floatingFilter: false,
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
        },
      },
    };

    this.miniConfigurationObj = {
      gridColumnDefs: this.getMiniSummaryGridDefs().map((col) => {
        if (col.valueFormatter) {
          col.valueFormatter = this[col.valueFormatter];
        }
        if (col.valueGetter) {
          col.valueGetter = this[col.valueGetter];
        }
        return col;
      }),
      gridData: [],
      gridOptions: {
        unSortIcon: true,
        components: {
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        headerHeight: 40,
        suppressContextMenu: true,
        domLayout: 'autoHeight',
        defaultColDef: {
          floatingFilter: false,
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          wrapText: true,
          sortable: true,
        },
      },
    };

    this.exConfigurationObj = {
      gridColumnDefs: this.getExperimentalGridDefs(),
      gridData: [],
      gridOptions: {
        unSortIcon: true,
        components: {
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        headerHeight: 40,
        domLayout: 'normal',
        suppressContextMenu: true,
        defaultColDef: {
          filter: 'agTextColumnFilter',
          floatingFilter: true,
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
        unSortIcon: true,
        components: {
          qmrfUrl: this.qmrfUrl,
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        defaultColDef: {
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeight: true,
          sortable: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
        },
        domLayout: 'normal',
        headerHeight: 40,
        suppressContextMenu: true,
        animateRows: false,
        isExternalFilterPresent: true,
      },
    };
  },
  mounted() {
    if (this.deepLink) {
      this.pageState = this.deepLink;
      this.activeSection = this.deepLink.activeSection;
      this.selectDataType(this.activeSection);
    } else if (window.localStorage.getItem('gridState')) {
      const saved = JSON.parse(window.localStorage.getItem('gridState'));
      const pagePath = this.$route.path.split('/')[2];
      if (saved.page == pagePath) {
        this.pageState = saved;
        // eslint-disable-next-line radix
        this.activeSection = saved.activeSection;
        this.selectDataType(this.activeSection);
      }
    }
  },
  methods: {
    ...mapMutations('chemicalProperties', ['setPropertySelection']),

    quickFilter(input) {
      this.gridRefs.summary.gridApi.setQuickFilter(input);
    },
    rangeFormatter(params) {
      if (Array.isArray(params.value)) {
        const retVal = [...params.value].join(',');
        return retVal;
      }
      return params.value;
    },
    onExport(params) {
      if (params.fileType === 'csv') {
        params.fileName = `${this.activeChemical.dtxsid} Fate ${this.currentSectionName} ${params.reference}.csv`;
        this.gridRefs[params.reference].gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        params.fileName = `${this.activeChemical.dtxsid} Fate ${this.currentSectionName} ${params.reference}.xlsx`;
        this.gridRefs[params.reference].gridApi.exportDataAsExcel(params);
      }
    },

    onSummaryClick(params) {
      if (params.column.colId === 'property') {
        this.setPropertySelection(params.data.propId);
        this.getSelectValue(params.data.propId, params.text);
      }
    },
    selectDataType(selectedCode, selectedText) {
      this.getSelectValue(selectedCode, selectedText);
    },

    getSelectValue(value, text) {
      this.activeSection = value;
      this.tableHeader = text;
      if (this.activeSection === 'SUMMARY') {
        this.gridConfigurationObj.gridData = this.getSummaryData();
        this.currentSectionName = 'Summary';
      } else {
        this.miniConfigurationObj.gridData = this.getMiniSummaryData(this.activeSection);
        this.currentSectionName = this.selectOptions.find(obj => obj.value === this.activeSection).text;
        if (this.activeFateTransport.find(obj => obj.arrKey === this.activeSection).experimental) {
          this.exConfigurationObj.gridData = this.activeFateTransport.find(obj => obj.arrKey === this.activeSection).experimental.rawData || [];
        } else {
          this.exConfigurationObj.gridData = [];
        }
        if (this.activeFateTransport.find(obj => obj.arrKey === this.activeSection).predicted) {
          this.predConfigurationObj.gridData = this.activeFateTransport.find(obj => obj.arrKey === this.activeSection).predicted.rawData || [];
          if (this.predConfigurationObj.gridData.length < 5) {
            this.predConfigurationObj.predGridSize = 'height:150px; width:100%; overflow:auto';
          }
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
<style lang="scss">
.toolbar {margin-top: 1rem !important;}
.row {
    flex-wrap: nowrap ;
}
.ag-header-cell-label {
  justify-content: left !important;
  margin-top: .55rem;
  margin-bottom: .75rem;
  font-weight: bold  !important;
}
.ag-header-cell-text {
    justify-content: center;
    color: #222;
    font-size: 11px;
    font-weight: 600  !important;
}

</style>
