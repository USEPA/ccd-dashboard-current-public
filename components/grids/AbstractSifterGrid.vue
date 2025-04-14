<template>
  <div>
    <ag-grid-vue
      :ref="gridReference"
      :enable-cell-text-selection="true"
      :cname="cname.camelName"
      :style="gridSize"
      class="ag-theme-balham"
      :grid-options="configObj.gridOptions"
      :row-data="configObj.gridData"
      :default-col-def="configObj.defaultColDef"
      :column-defs="configObj.gridColumnDefs"
      :suppress-row-click-selection="false"
      :row-multi-select-with-click="true"
      :sorting="true"
      :filter="true"
      :data-cy="`${cname.camelName}Grid`"
      :tooltip-show-delay="0"
      @handleResize="handleResize"
      @first-data-rendered="onModelUpdated"
      @grid-ready="onGridReady"
      @cell-clicked="onCellClicked"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'GridWithToolTips',
  components: {
    AgGridVue,

  },
  props: {
    cname: {
      type: Object,
      default: null,
    },

    gridType: {
      type: String,
      default: '',
    },
    toolbarConfig: {
      type: Object,
      default: () => {},
    },
    qsearch: {
      type: String,
      default: '',
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
    radioLabels: {
      type: Array,
      default: () => [],
    },
    configObj: {
      type: Object,
      default() {
        return {
          gridColumnDefs: [],
          gridData: [],
        };
      },
    },
    gridSize: {
      type: String,
      default: '',
    },
    gridReference: {type: String, default: 'grid-reference'},
    gridHeading: {type: String, default: 'Heading'},
  },
  data() {
    return {
      defaultColDef: null,
      gridApi: null,
      columnApi: null,
      gridComponent: '',
      domLayout: null,
    };
  },
  computed: {

  },
  created() {

  },
  beforeMount() {

  },
  mounted() {
    window.addEventListener('load', this.handleResize);
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('load', this.handleResize);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    onExport(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridApi.exportDataAsExcel(params);
      }
    },
    handleResize() {
      if (this.gridApi !== null) {
        this.gridApi.sizeColumnsToFit();
        if (window.screen.width === 1200 ||
            window.screen.width === 992 ||
            window.screen.width === 768 ||
            window.screen.width === 576) {
          this.gridApi.resetRowHeights();
        }
      }
    },
    onCellClicked(params) {
      const clickedRow = {
        value: params.rowIndex,
        text: params.value,
        colId: params.column.colId,
        data: params.data,
      };
      this.$emit('cellClicked', clickedRow);
    },
    onModelUpdated(params) {
      this.handleResize();
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();

      const gridRef = {
        gridApi: params.api,
        columnApi: params.columnApi,
        reference: this.gridReference,
      };
      this.$emit('gridRef', gridRef);
    },
  },
};

</script>
<style >
.grid-header {
  font-weight: bold;
  color:#444;
  text-align: center;
  margin-top: 1.25rem;
  margin-bottom: .75rem;
}

.totalYellow{
  background-color:yellow!important
}
</style>
