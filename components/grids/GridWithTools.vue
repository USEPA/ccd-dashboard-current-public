<template>
  <div>
    <chemical-assay-list-grid-toolbar
      :cname="cname"
      :toolbar-config="toolbarConfig"
      :qsearch="qsearch"
      :vfilter="vfilter"
      event
      @onFilter="quickFilter"
      @onFilterSelected="multiselectFilter"
      @onExport="exportData"
    />
    <slot name="toggles" />
    <div v-if="showRecordCounts" class="record-counts">
      Showing <span v-if="filteredRecords >0">{{ filteredRecords }} of</span> {{ totalRecords }} Records
    </div>
    <ag-grid-vue
      :ref="gridReference"
      :cname="cname.camelName"
      :style="gridSize"
      class="ag-theme-balham mt-2"
      :grid-options="configObj.gridOptions"
      :row-data="configObj.gridData"
      :default-col-def="configObj.defaultColDef"
      :column-defs="configObj.gridColumnDefs"
      :status-bar="configObj.statusBar"
      :dom-layout="configObj.domLayout"
      :sorting="true"
      :enable-filter="true"
      :enable-cell-text-selection="true"
      :suppress-row-click-selection="false"
      :data-cy="`${cname.camelName}Grid`"
      @handleResize="handleResize"
      @model-updated="onModelUpdated"
      @first-data-rendered="onModelUpdated"
      @filter-changed="onFilterChanged"
      @selection-changed="onSelectionChanged"
      @grid-ready="onGridReady"
      @cell-clicked="onCellClicked"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {AgGridVue} from 'ag-grid-vue';

import ChemicalAssayListGridToolbar from '~/components/toolbars/gridToolbar/ChemicalAssayListGridToolbar.vue';
import LabelRenderer from '~/components/cellRenderers/chemicalLists/LabelRenderer.vue';
import DateFormatter from '~/components/cellRenderers/DateFormatter.vue';
import BadgeRenderer from '~/components/cellRenderers/chemicalLists/BadgeRenderer.vue';
import SynonymRenderer from '~/components/cellRenderers/SynonymRenderer.vue';
import ListAcronymRenderer from '~/components/cellRenderers/chemicalLists/ListAcronymRenderer.vue';
import SynonymQualityRenderer from '~/components/cellRenderers/SynonymQualityRenderer.vue';
import MdbCardTextRenderer from '~/components/cellRenderers/MdbCardTextRenderer.vue';
import AssayModalToggle from '~/components/cellRenderers/assayLists/AssayModalToggle.vue';
import SingleConcRenderer from '~/components/cellRenderers/assayLists/SingleConcRenderer.vue';
import MultiConcRenderer from '~/components/cellRenderers/assayLists/MultiConcRenderer.vue';
import EndpointNameRenderer from '~/components/cellRenderers/assayLists/EndpointNameRenderer.vue';
import ResultsGridToolbar from '~/components/toolbars/gridToolbar/ResultsToolbar.vue';
import NCCTRoundFormatter from '~/components/cellRenderers/NcctRoundFormatter.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';
import GeneSymbolPopOverList from '~/components/cellRenderers/GeneSymbolPopOverList.vue';
import PredictionValues from '~/components/cellRenderers/PredictionValues.vue';

export default {
  name: 'GridWithTools',
  components: {
    AgGridVue,
    ChemicalAssayListGridToolbar,
    LabelRenderer,
    DateFormatter,
    BadgeRenderer,
    SynonymRenderer,
    EndpointNameRenderer,
    GeneSymbolPopOverList,
    SingleConcRenderer,
    MultiConcRenderer,
    SynonymQualityRenderer,
    MdbCardTextRenderer,
    AssayModalToggle,
    ResultsGridToolbar,
    NCCTRoundFormatter,
    PopOverUnderline,
    ListAcronymRenderer,
    PredictionValues,
  },
  props: {
    cname: {
      type: Object,
      default: () => null,
    },
    toolbarConfig: {
      type: Object,
      default: () => {},
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
          defaultColDef: {
            filter: 'agTextColumnFilter',
            resizable: true,
            autoHeight: true,
            minWidth: 70,
          },
          domLayout: 'normal',
          toolbarConfig: {
            copyButtonTipText: 'Copy URL',
          },
          gridData: [],
        };
      },
    },
    gridSize: {
      type: String,
      default: 'height: auto; ',
    },
    gridReference: {type: String, default: 'grid-reference'},
    gridHeading: {type: String, default: 'Heading'},
    showRecordCounts: {type: Boolean, default: false},
  },
  data() {
    return {
      defaultColDef: {
        width: 100,
        editable: false,
        sortable: true,
        resizable: true,
        filter: true,
      },
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      gridComponent: '',
      totalCount: false,
      filteredRecords: 0,
      totalRecords: 0,
    };
  },
  computed: {
    qsearch() {
      let searchStr = '';
      if (this.$route.query.search) {
        searchStr = this.$route.query.search;
      }
      return searchStr;
    },
    vfilter() {
      let vFilter = [];
      if (this.$route.query.vendorFilter) {
        vFilter = this.$route.query.vendorFilter.split('-');
      }
      return vFilter;
    },
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

    toggleRadioBth(typeId) {
      // console.log(`Active radio btn: ${this.radioLabels[typeId]}`)
    },
    selectDataType(selectedCode) {
      // console.log(`Selected item: ${selectedCode}`)
    },

    exportData(params) {
      this.$emit('exportData', params);
    },
    quickFilter(input) {
      this.gridApi.setQuickFilter(input);
    },
    multiselectFilter(params) {
      if (params.filterValue.length === 1 && params.filterValue[0] === null) {
        this.clearSelectedFilter(params.filterColumn);
        return;
      }
      if (params.filterValue.length === 0) {
        this.clearSelectedFilter(params.filterColumn);
        return;
      }
      const filterComponent = this.gridApi.getFilterInstance(params.filterColumn);
      const model = {
        type: 'set',
        values: params.filterValue,
      };
      filterComponent.setModel(model);
      this.gridApi.onFilterChanged();
    },
    clearSelectedFilter(column) {
      this.gridApi.destroyFilter(column);
      this.gridApi.onFilterChanged();
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
    onFilterChanged(params) {
      this.filteredRecords = this.gridApi.getDisplayedRowCount();
    },
    onCellClicked(params) {

    },
    onModelUpdated(params) {
      // this.handleResize()
    },
    onSelectionChanged(params) {
      const selectedAllocation = this.gridApi.getSelectedRows()[0];
    },
    onGridReady(params) {
      // console.log('onGridReady GridWithTools: ', this.configObj.gridData)
      this.totalCount = this.configObj.gridData.length;
      const {chemicalLists, assayEndpoints} = this.$refs;
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      // apply the search string from the url
      if (this.qsearch.length > 0) {
        this.gridApi.setQuickFilter(this.qsearch);
      }
      // console.log('this.vfilter : ', this.vfilter)
      if (this.vfilter.length > 0) {
        const filterParams = {
          filterColumn: 'vendorKey',
          filterValue: this.vfilter,
        };

        this.multiselectFilter(filterParams);
      }
      this.handleResize();
      const gridRef = {
        gridApi: params.api,
        columnApi: params.columnApi,
        reference: this.gridReference,
      };
      this.$emit('gridRef', gridRef);
      this.totalRecords = this.gridApi.getDisplayedRowCount();
    },
  },
};
</script>
<style lang="scss">
// @import "~/assets/styles/config-variables.scss";
// @import "~/assets/styles/imported-variables.scss";
// @import "~/assets/styles/_custom-variables.scss";

// .ag-header-cell{
//   padding-left:6px!important;
//   padding-right:6px!important;
// }
// .ag-header-cell-label .ag-header-cell-text{
//   justify-content: center;
//   color:#222;
//   font-size:10px;
//   font-weight:400;
//   white-space: normal!important;
// }
// .ag-theme-balham .ag-cell {
//     line-height: 26px;
//     padding-left: 7px;
//     padding-right: 3px;
//     border: 1px solid transparent;
// }
// .ag-header-cell-label {
//     padding: 10px 0px !important;
// }
.record-counts{
  text-align: center;
  font-size:12px;
}
</style>
