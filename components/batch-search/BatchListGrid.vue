<template>
  <div>
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
          <span v-if="gridHeading" class="grid-header">
            {{ gridHeading }}
          </span>
          <slot />
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
      <div v-if="loading" class="progress" style="width:500px">
        <div
          class="progress-bar bg-success"
          role="progressbar"
          :style="{width:percentDone +'%'}"
        >
          {{ progressMsg }}
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
      @handleResize="handleResize"
      @first-data-rendered="onModelUpdated"
      @grid-ready="onGridReady"
      @cell-clicked="onCellClicked"
      @selection-changed="onSelectionChanged"
      @firstDataRendered="onFirstDataRendered"
      @column-visible="onColumnVisible"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {AgGridVue} from 'ag-grid-vue';
import PopOverRenderer from '~/components/cellRenderers/PopOverRenderer.vue';

export default {
  name: 'BatchListGrid',
  components: {
    AgGridVue,
    PopOverRenderer,
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
    if (this.$route.query.showSaveState) {
      this.showSaveState = true;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('load', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.addEventListener('load', this.handleResize);
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
      // console.log(JSON.stringify(gridState.filter))
      this.$emit('gridState', gridState);
    },
    scrollToLink() {
      if (this.savedState.gridRef === this.cname.hyphenName) {
        this.$nextTick(() => {
          const savedGrid = this.$refs[this.savedState.gridRef];
          const elTop = savedGrid.$el.offsetTop;
          window.scroll({
            top: elTop, left: 0, behavior: 'smooth',
          });
        });
      }
    },
    restoreFilterModel() {
      if (this.savedState.gridRef === this.cname.hyphenName) {
        this.gridApi.setFilterModel(this.savedState.filter);
        // console.log(this.savedState.colStateSort)
        this.columnApi.applyColumnState({
          state: this.savedState.colStateSort,
        });
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
    onColumnVisible() {
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
