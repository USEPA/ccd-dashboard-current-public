<template>
  <div class="mr-3">
    <client-only>
      <div class="h2">
        <ccte-help-text
          data-cy="skinEyeHeader"
          label-type="span"
          heading-text="Skin/Eye"
          help-key="Skin/Eye"
        />
      </div>
      <div v-if="skinEyeData.length > 0">
        <chemical-detail-tab-grid-toolbar
          :cname="cname"
          :toolbar-config="toolbarConfig"
          @onFilter="quickFilter"
        />
        <grid-tips
          :cname="cname"
          grid-reference="ivive"
          grid-heading="Skin/Eye"
          :toolbar-config="toolbarConfig"
          :grid-size="gridSize"
          :config-obj="gridConfigurationObj"
          @onExport="exportData"
          @gridRef="onGridRef"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue';
import {
  mapState, mapGetters,
} from 'vuex';
import ChemicalDetailTabGridToolbar from '~/components/toolbars/gridToolbar/ChemicalDetailTabGridToolbar.vue';
import GridTips from '~/components/grids/GridWithToolTips.vue';
import columnDefs from './skinEyeColumnDefs';
import LinkRenderer from '~/components/cellRenderers/LinkRenderer';

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
  name: 'SkinEyeView',
  components: {
    ChemicalDetailTabGridToolbar,
    AgGridVue,
    LinkRenderer,
    GridTips,
  },
  data() {
    return {
      cname: {
        camelName: 'skinEye',
        hyphenName: 'skin-eye',
        baseName: 'Skin/Eye',
      },
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: false,
      },
      gridConfigurationObj: {},
      gridSize: 'height:450px; width:100%; overflow:auto',
      columnDefs: [],
      gridApi: null,
      columnApi: null,
      title: '',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData({app, params}) {
    try {
      const skinEyeObj = await app.$repositories.skinEye.find(params.id);
      return {skinEyeData: skinEyeObj._embedded.SkinEye};
    } catch (err) {
      return {skinEyeData: []};
    }
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Skin/Eye`,
      meta: [],
    };
  },
  beforeMount() {
    this.gridConfigurationObj = {
      gridColumnDefs: columnDefs,
      gridData: this.skinEyeData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        headerClass: 'hide-filter-icon',
        sortable: true,
      },
      gridOptions: {
        unSortIcon: true,
        components: {
          roundTo2: this.roundTo2,
          whenEmpty: this.whenEmpty,
          yearRenderer: this.yearRenderer,
        },
        suppressContextMenu: true,
        domLayout: 'normal',
        headerHeight: 60,
        animateRows: true,
        rowSelection: 'multiple',
        isExternalFilterPresent: true,
        defaultExcelExportParams: {
          autoConvertFormulas: true,
          processCellCallback: (params) => {
            const {field} = params.column.getColDef();
            const url = params.node?.data?.recordUrl;
            if (field === 'source' && url && url !== '-') {
              return `=HYPERLINK("${url}", "${params.value}")`;
            }

            return params.value;
          },
        },
        excelStyles: [
          {
            id: 'hyperlinks',
            font: {
              underline: 'Single',
              color: '#358ccb',
            },
          },
        ],
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
    yearRenderer(params) {
      // eslint-disable-next-line radix
      if (parseInt(params.data.year) < 0) {
        return '-';
      }
      return params.data.year;
    },
    onGridState(params) {
      // this is used for saving the grid state for deeplinks
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

      // https://jira.epa.gov/browse/CE-4234 - remove leading blank column, uppercase all column headers.
      const exportColumns = columnDefs.filter(col => !col.checkboxSelection).map(col => col.field);
      params.processHeaderCallback = headerParams => headerParams?.column?.colDef?.headerName?.toUpperCase() || '';

      if (params.fileType === 'csv') {
        params.columnKeys = exportColumns;
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        params.columnKeys = exportColumns.filter(col => col !== 'recordUrl');
        this.gridApi.exportDataAsExcel(params);
      }
    },
    quickFilter(input) {
      this.gridApi.setQuickFilter(input);
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },
  },
};
</script>

<style>
.toolbar {
  margin-top: 1rem !important;
}

.row {
  flex-wrap: nowrap;
}

.skin-eye-wrapped span.ag-cell-value {
  word-break: break-word;
  word-wrap: normal;
  overflow-wrap: normal;
}
</style>
