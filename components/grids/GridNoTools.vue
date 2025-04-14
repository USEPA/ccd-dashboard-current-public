<template>
  <div>
    <div v-if="gridHeading" class="grid-header">
      {{ gridHeading }}
    </div>
    <ag-grid-vue
      :ref="gridReference"
      :cname="cname.camelName"
      :style="gridSize"
      class="ag-theme-balham"
      :grid-options="configObj.gridOptions"
      :row-data="configObj.gridData"
      :default-col-def="defaultColDef"
      :column-defs="configObj.gridColumnDefs"
      :sorting="true"
      :filter="true"
      :enable-cell-text-selection="true"
      :suppress-row-click-selection="false"
      :data-cy="`${cname.camelName}Grid`"
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
import LabelRenderer from '~/components/cellRenderers/chemicalLists/LabelRenderer.vue';
import BadgeRenderer from '~/components/cellRenderers/chemicalLists/BadgeRenderer.vue';
import MdbCardTextRenderer from '~/components/cellRenderers/MdbCardTextRenderer.vue';

export default {
  name: 'GridNoTools',
  components: {
    AgGridVue,
    LabelRenderer,
    BadgeRenderer,
    MdbCardTextRenderer,
  },
  props: {
    cname: {
      type: Object,
      default: null,
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
      default: 'height: auto; minHeight:50px maxWidth: 1070px; minWidth: 400px;',
    },
    gridReference: {type: String, default: 'grid-reference'},
    gridHeading: {type: String, default: 'Heading'},
  },
  data() {
    return {
      defaultColDef: {
        width: 100,
        editable: false,
        sortable: true,
        resizable: true,
        filter: true,
        tooltipComponent: 'customTooltip',
      },
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      gridComponent: '',
    };
  },
  computed: {

  },
  created() {
    this.gridOptions = {};
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
    exportData(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridApi.exportDataAsExcel(params);
      }
    },
    getContextMenuItems(params) {
      const result = [
        'separator',
        'resetColumns',
        'copyWithHeaders',
        'export',
        'separator',
      ];
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
      // leave for future use
    },
    onModelUpdated(params) {
      this.handleResize();
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
  },
};

</script>
<style scoped>
.grid-header {
  font-weight:bold;
  color:#444;
  text-align:center;
  margin-top: 1.25rem;
  margin-bottom: .75rem;
}
</style>
