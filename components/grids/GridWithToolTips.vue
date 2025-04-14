<template>
  <div>
    <div v-show="configObj?.gridData?.length > 0">
      <div>
        <div class="row no-gutters " style="margin-top:20px;margin-bottom:10px">
          <div class="col-2">
            <grid-export-dropdown
              v-if="showExport"
              :cname="cname"
              @onExport="onExport"
            />
          </div>
          <div class="col-8" style="text-align:center">
            <h3 v-if="gridHeading" class="grid-header text-capitalize">
              {{ gridHeading }}
              <slot />
            </h3>
          </div>
          <div class="col-2">
            <button
              v-if="showSaveState == true"
              data-cy="saveStateButton"
              class="commentsBtn mr-5 btn-sm default-color white-text mainNav nuxt-nav"
              @click="saveGridState"
            >
              Save Grid State
            </button>
          </div>
        </div>
      </div>
      <div v-if="loading" class="progress" style="width:500px">
        <div
          class="progress-bar bg-success"
          role="progressbar"
          :style="{width:percentDone +'%'}"
        >
          {{ progressMsg }}
        </div>
      </div>
      <ag-grid-vue
        v-if="configObj?.gridData?.length > 0"
        :ref="gridReference"
        :cname="cname.camelName"
        :style="gridSize"
        :status-bar="configObj.statusBar"
        class="ag-theme-balham"
        :grid-options="configObj.gridOptions"
        :row-data="configObj.gridData"
        :default-col-def="configObj.defaultColDef"
        :column-defs="configObj.gridColumnDefs"
        :enable-cell-text-selection="true"
        :sorting="true"
        :filter="true"
        :suppress-row-click-selection="false"
        :data-cy="`${cname.camelName}Grid`"
        :tooltip-show-delay="0"
        :is-external-filter-present="isExternalFilterPresent"
        :does-external-filter-pass="doesExternalFilterPass"
        @first-data-rendered="onModelUpdated"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
        @selection-changed="onSelectionChanged"
        @firstDataRendered="onFirstDataRendered"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {AgGridVue} from 'ag-grid-vue';
import GridExportDropdown from '~/components/toolbars/gridToolbar/GridExportDropdown.vue';
import RangeFormatter from '~/components/cellRenderers/RangeFormatter.vue';
import NCCTRoundFormatter from '~/components/cellRenderers/NcctRoundFormatter.vue';
import DtxsidDetailsRenderer from '~/components/cellRenderers/DtxsidDetailsRenderer.vue';
import CommentDtxsidLink from '~/components/cellRenderers/CommentDtxsidLink.vue';
import CalculationDetailsRenderer from '~/components/cellRenderers/CalculationDetailsRenderer.vue';
import MdbCardTextRenderer from '~/components/cellRenderers/MdbCardTextRenderer.vue';
import KeywordsRenderer from '~/components/cellRenderers/KeywordsRenderer.vue';
import PucPopOverUnderline from '~/components/cellRenderers/PucPopOverUnderline.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';
import PopOverRenderer from '~/components/cellRenderers/PopOverRenderer.vue';
import MoreButton from '~/components/cellRenderers/MoreButton.vue';

export default {
  name: 'GridWithToolTips',
  components: {
    AgGridVue,
    RangeFormatter,
    NCCTRoundFormatter,
    DtxsidDetailsRenderer,
    CommentDtxsidLink,
    CalculationDetailsRenderer,
    MdbCardTextRenderer,
    PopOverRenderer,
    PopOverUnderline,
    PucPopOverUnderline,
    MoreButton,
    GridExportDropdown,
    KeywordsRenderer,
  },
  props: {
    savedState: {
      type: Object,
      default() {
        return {
          colState: [],
          filter: {},
          gridRef: '',
        };
      },
    },
    cname: {
      type: Object,
      default() {
        return {
          camelName: 'a',
          hyphenName: 'b',
          baseName: 'c',
        };
      },
    },
    showExport: {
      type: Boolean,
      default: () => true,
    },

    gridType: {
      type: String,
      default: '',
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
    gridHeading: {type: String, default: ''},
    loading: {type: Boolean, default: false},
    percentDone: {type: Number, default: 0},
    progressMsg: {type: String, default: ' '},
  },
  data() {
    return {
      showSaveState: false,
      defaultColDef: null,
      gridApi: null,
      columnApi: null,
      gridComponent: '',
    };
  },
  created() {
    if (this.$route.query.showSaveState && process.env.APPLICATION_EXTERNAL_LINK_URL === 'https://ccte-ccd-dev.epa.gov') {
      this.showSaveState = true;
    }
  },

  methods: {
    onFirstDataRendered(params) {
      // params.api.sizeColumnsToFit()
    },
    onExport(params) {
      params.reference = this.gridReference;
      params.allColumns = true;
      this.$emit('onExport', params);
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
      if (params.column.colId === 'property') {
        this.$emit('selectProperty', params);
      }
      const clickedRow = {
        value: params.rowIndex,
        text: params.value,
        colId: params.column.colId,
        data: params.data,
      };
      this.$emit('onCellClicked', params);
    },
    onModelUpdated(params) {
      this.handleResize();
    },
    onSelectionChanged(params) {
      this.$emit('selectionChanged', params);
    },
    saveGridState() {
      const pagePath = this.$route.path.split('/')[2];
      const colState = this.columnApi.getColumnState();
      const colStateSort = colState.map(state => ({
        colId: state.colId,
        sort: state.sort,
        sortIndex: state.sortIndex,
      }));
      const gridState = {
        page: pagePath,
        colStateSort: colStateSort,
        filter: this.gridApi.getFilterModel(),
        gridModel: this.gridApi.getModel(),
        reference: this.gridReference,
      };

      this.$emit('gridState', gridState);
    },
    scrollToLink() {
      const vm = this;
      if (this.savedState.gridRef === this.cname.hyphenName) {
        this.$nextTick(() => {
          const savedGrid = vm.$refs[this.savedState.gridRef];
          const elTop = savedGrid?.$el?.offsetTop;
          window.scroll({
            top: elTop, left: 0, behavior: 'smooth',
          });
        });
      }
    },
    isExternalFilterPresent() {
      if ((this.savedState.gridRef === this.cname.hyphenName) && this.savedState.filter) {
        return true;
      }
      return false;
    },
    doesExternalFilterPass(node) {
      if ((this.savedState.gridRef === this.cname.hyphenName) && this.savedState.filter) {
        return true;
      }
      return true;
    },
    restoreFilterModel() {
      if (this.savedState.gridRef === this.cname.hyphenName) {
        if (this.savedState.filter) {
          this.gridApi.setFilterModel(this.savedState.filter);
          this.gridApi.onFilterChanged();
        }
        // console.log(this.savedState.colStateSort)
        if (this.savedState.colStateSort) {
          this.columnApi.applyColumnState({
            state: this.savedState.colStateSort,
          });
        }
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      const gridRef = {
        gridApi: params.api,
        columnApi: params.columnApi,
        reference: this.gridReference,
      };
      this.$emit('gridRef', gridRef);
      this.restoreFilterModel();
      this.scrollToLink();
      this.gridApi.sizeColumnsToFit();
    },
  },
};

</script>
<style scoped>
.grid-header {
  font-weight: bold;
  color:#444;
  text-align: center;
  margin-top: 1.25rem;
  margin-bottom: .75rem;
}
</style>
