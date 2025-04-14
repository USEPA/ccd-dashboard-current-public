<template>
  <div class="mr-4" style="margin-top:10px">
    <div class="h2 ml-1">
      <ccte-help-text
        data-cy="SynonymsHeader"
        label-type="span"
        heading-text="Synonyms"
        help-key="SynonymsHeader"
      />
    </div>
    <grid-with-tools
      v-if="synonymList.length > 0"
      :cname="cname"
      :toolbar-config="toolbarConfig"
      grid-reference="chemicalSynonyms"
      grid-heading="Chemical Synonyms"
      :grid-size="gridSize"
      :config-obj="gridConfigurationObj"
      @gridRef="onGridRef"
      @exportData="onExportData"
    />
  </div>
</template>

<script>
import {
  mapState, mapGetters,
} from 'vuex';

import GridWithTools from '~/components/grids/GridWithTools.vue';

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
  name: 'SynonymsView',
  components: {
    GridWithTools,
  },
  data() {
    return {
      synonymList: [],
      cname: {
        camelName: 'chemicalSynonyms',
        hyphenName: 'chemical-synonyms',
        baseName: 'Chemical Synonyms',
      },
      toolbarConfig: {
        search: true,
        filter: false,
        export: true,
        copy: false,
      },
      gridConfigurationObj: {},
      gridSize: 'height: 500px; ',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      exportColDefs: [],
      columnDefs: null,
      gridData: null,
      active: 'synonym',
      statusbar: false,
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    ...mapGetters({
      getSynonyms: 'synonyms/getSynonyms',
      getSynonymGridDefs: 'synonyms/getSynonymGridDefs',
      getExportColDefs: 'synonyms/getExportColDefs',
    }),
  },
  async asyncData(context) {
    try {
      const response = await context.app.$repositories.synonyms.find(context.params.id);
      context.app.store.dispatch('synonyms/loadSynonyms', response.data);
    } catch (err) {
      console.error(`ERROR CALLING synonym ${err}`);
    }
  },
  head() {
    return {
      title: `${this.chemical.preferredName} Synonyms`,
      meta: [],
    };
  },
  created() {
    this.synonymList = this.getSynonyms();
  },
  beforeMount() {
    this.gridDefs = this.getSynonymGridDefs();
    this.exportColDefs = this.getExportColDefs();

    this.gridConfigurationObj = {
      gridColumnDefs: this.gridDefs,
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
      gridData: this.synonymList,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
      gridOptions: {
        unSortIcon: true,
        suppressContextMenu: true,
        headerHeight: 60,
      },
    };
  },
  methods: {

    onExportData(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        const fname = `${params.fileName}`;

        const exportConfig = {
          gridApi: this.gridApi, columns: this.exportColDefs, fileName: fname, splitSheet: {xSplit: 1, ySplit: 1},
        };
        this.exportData(exportConfig);
      }
    },

    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },

  },
};
</script>

<style lang="scss">

</style>
