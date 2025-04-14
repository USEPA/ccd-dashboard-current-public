<template>
  <div>
    <div v-if="getPredictions">
      <div v-if="getLoading()" class="d-flex justify-content-center mt-5 loading-spinner">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <grid-with-tools
        v-else
        :cname="cname"
        :toolbar-config="toolbarConfig"
        grid-reference="predictions"
        grid-heading="Predictions"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @gridRef="onGridRef"
        @exportData="onExportData"
      />
    </div>
  </div>
</template>

<script>
import {
  mapState, mapGetters, mapMutations,
} from 'vuex';
import GridWithTools from '~/components/grids/GridWithTools.vue';

export default {
  name: 'Prediction',
  components: {
    GridWithTools,
  },
  data() {
    return {
      cname: {
        camelName: 'predictions',
      },
      toolbarConfig: {
        search: false,
        filter: false,
        export: true,
        copy: false,
      },
      gridSize: 'height: 500px; width:100%; overflow-x: hidden;',
      gridConfigurationObj: {
        gridOptions: {
          rowHeight: 28,
          headerHeight: 50,
          unSortIcon: true,
          rowStyle: {fontSize: '11px', color: '#444'},
          suppressContextMenu: true,
        },
        gridApi: null,
        columnApi: null,
        exportColDefs: [],
        defaultColumnDef: {
          floatingFilter: false,
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
        },
        columnDefs: null,
        gridData: null,
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
      },
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
      predData: state => state.predictions.pred,
    }),
    ...mapGetters({
      getLoading: 'predictions/getLoading',
      getPredictions: 'predictions/getPredictions',
      getPredictionGridDefs: 'predictions/getPredictionGridDefs',
      getExportColDefs: 'predictions/getPredictionExportColDefs',
    }),
  },
  watch: {
    predData(n, o) {
      this.gridConfigurationObj.gridData = this.getPredictions();
    },
  },
  beforeMount() {
    this.gridDefs = this.getPredictionGridDefs();
    this.exportDefs = this.getExportColDefs();
    this.exportColDefs = this.getPredictionGridDefs();
    this.gridConfigurationObj.gridColumnDefs = this.gridDefs;
    this.gridConfigurationObj.gridData = false;
  },
  methods: {
    ...mapMutations({
      setLoading: 'predictions/setLoading',
    }),
    onExportData(params) {
      const utc = new Date().toJSON().slice(0, 10);
      if (params.fileType === 'csv') {
        const csvParams = {
          gridApi: this.gridApi,
          columns: this.exportDefs,
          fileType: 'csv',
          fileName: `Predictions-${utc}`,
          fileFormat: 'csv',
        };
        this.exportData(csvParams);
      } else if (params.fileType === 'xlsx') {
        const exportConfig = {
          gridApi: this.gridApi,
          columns: this.exportDefs,
          fileName: `Predictions-${utc}`,
          fileFormat: 'xlsx',
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
<style scoped lang="scss">
.loading-spinner{
  position: relative !important;
  top: 10px !important;
}
</style>
