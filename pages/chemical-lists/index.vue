/* eslint-disable vue/no-unused-components */
<template>
  <div class="container-fluid left-fullwidth-container content pt-3">
    <ccte-help-text
      data-cy="ChemicalLists"
      label-type="h2"
      :heading-text="`Chemical Lists`"
      help-key="Chemical Lists"
    />
    <div v-if="notFound" class="alert alert-warning" role="alert">
      {{ notFound }}
    </div>
    <grid-with-tools
      :cname="cname"
      :toolbar-config="toolbarConfig"
      grid-reference="chemicalLists"
      grid-heading="Chemical Lists"
      :show-record-counts="true"
      :grid-size="gridSize"
      :config-obj="gridConfigurationObj"
      @gridRef="onGridRef"
      @exportData="onExportData"
    />
  </div>
</template>

<script>
import {
  mapGetters, mapActions,
} from 'vuex';
import GridWithTools from '~/components/grids/GridWithTools.vue';

export default {
  name: 'ChemicalLists',
  components: {
    GridWithTools,
  },
  data() {
    return {
      cname: {
        camelName: 'chemicalLists',
        hyphenName: 'chemical-lists',
        baseName: 'Chemical Lists',
      },
      toolbarConfig: {
        search: true,
        filter: false,
        export: true,
        copy: true,
      },
      gridConfigurationObj: {},
      gridSize: 'height: 500px;',
      gridOptions: null,
      exportColDefs: [],
      gridApi: null,
      columnApi: null,
      defaultColumnDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        resizable: true,
        autoHeight: true,
        floatingFilter: true,
      },
      columnDefs: null,
      rowData: null,
      gridRefs: {},
    };
  },
  computed: {
    ...mapGetters({
      getChemicalLists: 'chemicalLists/getChemicalLists',
      getGridDefs: 'chemicalLists/getGridDefs',
      getExportColDefs: 'chemicalLists/getExportColDefs',
    }),
    notFound() {
      let nfString = '';
      if (this.$route.query.notFound) {
        nfString = `The list "${this.$route.query.search}" was not found. Please search through the lists below and see if you can find the list you are looking for`;
      }
      return nfString;
    },
  },
  async asyncData(context) {
    const response = await context.store.dispatch('chemicalLists/asyncChemicalLists', context);
  },
  head() {
    return {
      title: `${process.env.APPLICATION_TITLE} Chemical Lists`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Lists`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Lists`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Lists - Over 150 curated chemical  lists`,
        },
      ],
    };
  },
  beforeMount() {
    // onNuxtReady is called _after_ the Nuxt.js app is fully mounted,
  // so Sentry is not yet loaded when beforeMount is called
  // But when you set injectMock: true this call will be captured
  // and executed after Sentry has loaded
  // this.$sentry.captureMessage('Hello!')
    this.columnDefs = this.getGridDefs();
    this.exportColDefs = this.getExportColDefs();

    this.gridOptions = {
      headerHeight: 50,
      unSortIcon: true,
      suppressContextMenu: true,
      components: {
        acronymRenderer: this.acronymRenderer,
      },
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },
        ],
      },
    };
    const data = this.getChemicalLists();
    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      gridData: data,
      gridOptions: this.gridOptions,
      defaultColDef: this.defaultColumnDef,
    };
  },
  mounted() {
    this.gridConfigurationObj.gridOptions = {
      headerHeight: 70,
    };
  },
  methods: {
    ...mapActions(['fetchLists']),
    acronymRenderer(params) {
      return `<a href="${process.env.APPLICATION_ROUTER_BASE}chemical-lists/${params.value}">${params.value} </a>`;
    },
    getContextMenuItems(params) {
      const result = [
        'separator',
        'resetColumns',
        'copyWithHeaders',
        'export',
        'separator',
        'chartRange',
      ];
      return result;
    },
    onExportData(params) {
      const fname = `${params.fileName}`;
      const exportConfig = {
        gridApi: this.gridApi,
        columns: this.exportColDefs,
        fileName: fname,
        splitSheet: {xSplit: 1, ySplit: 1},
        fileFormat: params.fileType,
      };
      this.exportData(exportConfig);
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },
  },
};
</script>
<style >
.toolbar {margin-top: .7rem !important;}

.ag-header-cell-text{
  color:#222;
  font-size:10px;
  font-weight:400;

}
.ag-header-cell{
  padding-left:6px!important;
  padding-right:6px!important;
}
.ag-header-cell-label {
   justify-content: center;
}
</style>
