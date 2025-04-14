<template>
  <div class="mr-3">
    <client-only>
      <div class="h2">
        <ccte-help-text
          data-cy="CancerHeader"
          label-type="span"
          heading-text="Cancer"
          help-key="Cancer"
        />
      </div>
      <chemical-detail-tab-grid-toolbar
        :cname="cname"
        :toolbar-config="toolbarConfig"
        @onFilter="quickFilter"
      />
      <grid-tips
        :cname="cname"
        grid-reference="cancer"
        grid-heading="Cancer"
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
  mapState,
} from 'vuex';
import ChemicalDetailTabGridToolbar from '~/components/toolbars/gridToolbar/ChemicalDetailTabGridToolbar.vue';
import GridTips from '~/components/grids/GridWithToolTips.vue';
import LinkRenderer from '~/components/cellRenderers/LinkRenderer.vue';

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
  name: 'CancerView',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
    LinkRenderer,
  },
  data() {
    return {
      cname: {
        camelName: 'cancer',
        hyphenName: 'cancer',
        baseName: 'Cancer',
      },
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: false,
      },
      gridConfigurationObj: {},
      gridSize: ' overflow:auto',
      gridApi: null,
      columnApi: null,
      title: '',
      activeTab: 'cancer-subtab',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  // eslint-disable-next-line
  async asyncData({app, params}) {
    try {
      const cancerObj = await app.$repositories.cancer.find(params.id);
      const cancerData = cancerObj._embedded.CancerSummary;
      return {cancerData};
    } catch (err) {
      return {cancerData: []};
    }
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Cancer`,
      meta: [],
    };
  },
  beforeMount() {
    const columnDefs = [
      {
        headerName: 'DTXSID',
        width: 100,
        floatingFilter: false,
        field: 'dtxsid',
        filter: 'agTextColumnFilter',
        headerClass: 'hide-filter-icon',
        hide: true,
      },
      {
        headerName: 'Source',
        width: 100,
        colId: 'source',
        field: 'source',
        cellClass: 'hyperlinks',
        headerTooltip: 'Indicates source the data was obtained from and links to the source url',
        filter: 'agTextColumnFilter',
        sortable: true,
        headerClass: 'hide-filter-icon',
        cellRenderer: 'LinkRenderer',
        cellRendererParams: params => ({
          text: params.data.source, url: params.data.sourceUrl,
        }),
      },
      {
        headerName: 'Exposure Route',
        width: 100,
        field: 'exposureRoute',
        filter: 'agTextColumnFilter',
        sortable: true,
        headerClass: 'hide-filter-icon',
      },
      {
        headerName: 'Cancer Call',
        field: 'cancerCall',
        tooltipField: 'cancerCall',
        filter: 'agTextColumnFilter',
        sortable: true,
        headerClass: 'hide-filter-icon',
      },
    ];
    this.gridConfigurationObj = {
      gridColumnDefs: columnDefs,
      gridData: this.cancerData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        floatingFilter: true,
      },
      gridOptions: {
        popupParent: document.querySelector('body'),
        components: {
          roundTo2: this.roundTo2,
          whenEmpty: this.whenEmpty,
        },
        headerHeight: 40,
        suppressContextMenu: true,
        domLayout: 'autoHeight',
        animateRows: true,
        isExternalFilterPresent: false,
        defaultExcelExportParams: {
          autoConvertFormulas: true,
          processCellCallback: (params) => {
            const {field} = params.column.getColDef();
            const url = params.node?.data?.sourceUrl;
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
    sourceRenderer(params) {
      const title = `Link to the source url (${params.data.sourceUrl}). Note: The urls provided may no longer be maintained.`;
      return `<a href='${params.data.sourceUrl}' title="${title}" target="_blank" rel="noopener" style="text-decoration: underline; text-decoration-style: dashed;">${params.data.source}  <i class="fa fa-external-link" aria-hidden="true" style="color: black;"></i></a>`;
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
<style scoped lang="scss">
.toolbar {margin-top: 1rem !important;}
.row {
    flex-wrap: nowrap ;
}
</style>
