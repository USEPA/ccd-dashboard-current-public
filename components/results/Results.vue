<template>
  <div>
    <client-only>
      <section v-if="rowData?.length > 0 || isBatch" id="results-display">
        <component
          :is="`${cname.hyphenName}-toolbar`"
          :cname="cname"
          :filter="filter"
          :copy-url-config="copyUrlConfig"
          :qsearch="csearch"
          :custom-sort="currentSort"
          :data-cy="`${cname.camelName}Toolbar`"
          :chemical-count="selectedRecords"
          :tile-info-items="configObj"
          :loading="loading"
          @onFilter="quickFilter"
          @sendtoBatch="sendtoBatch"
          @onExport="exportData"
          @doToggle="doToggle"
          @emitViewPref="setSelectedView"
          @selectAll="selectAll"
        />
        <div class="row">
          <div class="col">
          &nbsp;
            <span v-if="missedRecords" class="font-weight-bold mb-4">
              (There was an error loading some chemicals.)
            <!--{{ missedRecords?.toLocaleString() }} chemicals were not loaded.) -->
            </span>
          </div>
          <div class="col">
            <div class="chemCount">
              <h3 class="font-weight-bold">
                <span class="mb-4">
                  Showing {{ chemicalCount?.toLocaleString() }} of
                  {{ totalRecordsCount?.toLocaleString() }} chemicals
                </span>
                <i v-if="loading" alt="Loading icon with spinning animation" class="fas fa-cog fa-spin fa-2x ml-2" />
                <span v-if="showTruncatedResultMsg">
                  (Only the first {{ totalRecordsCount?.toLocaleString() }} results retrieved)
                </span>
                <span v-if="chemListSubstring">
                  (Chemical list details have been filtered by substring search. Use reset button
                  to clear the filter.)
                </span>
              </h3>
            </div>
          </div>
          <div class="col">
            <div v-if="loading" class="progress" alt="animated progress bar">
              <div
                class="progress-bar bg-success"
                role="progressbar"
                :style="{ width: percentDone + '%' }"
              >
                <!-- {{ percentDone }}% loaded -->
                loading..
              </div>
            </div>
          </div>
        </div>
        <div v-if="filterModel.length > 0" class="row">
          <div class="col filter-info">
            Filtering out chemicals that are:
            <span
              class="text-capitalize"
            ><strong>{{ filterInfo }}</strong></span>
          </div>
        </div>
        <ag-grid-vue
          v-show="getGridToggle === 'th'"
          id="resultsGrid"
          :ref="gridReference"
          un-sort-icon="true"
          :enable-cell-text-selection="true"
          :cname="cname.camelName"
          :style="gridSize"
          class="ag-theme-balham"
          :grid-options="configObj.gridOptions"
          :row-data="rowData"
          :default-col-def="configObj.defaultColDef"
          :column-defs="configObj.gridColumnDefs"
          :sorting="true"
          :filter="true"
          :suppress-row-click-selection="true"
          :data-cy="`${cname.camelName}Grid`"
          :get-row-height="getRowHeight"
          @handleResize="handleResize"
          @model-updated="onModelUpdated"
          @first-data-rendered="onFirstDataRendered"
          @filter-changed="onFilterChanged"
          @sort-changed="onSortChanged"
          @cell-clicked="onCellClicked"
          @selection-changed="onSelectionChanged"
          @grid-ready="onGridReady"
          @column-visible="onColumnVisible"
        />
        <ChemicalTiles v-show="getGridToggle === 'table'" @selectTile="onSelectTile" />
        <chem-img-modal />
      </section>
      <section v-else id="no-results" data-cy="no-results">
        <h2 class="w-100 p-3">
          No results found for requested search.
        </h2>
        <div>
          <p class="h3 blue-text">
            Our <NuxtLink title="Home Page" to="/">
              Home Page
            </NuxtLink> has searches for chemicals, product and use categories, assays and genes.
          </p>
          <p class="h3 blue-text">
            You can access our <NuxtLink title="Chemical lists" to="/chemical-lists">
              Chemical Lists
            </NuxtLink> to view specific EPA  chemical lists and view the chemicals in those lists.
          </p>
          <p class="h3 blue-text">
            You can see our <NuxtLink title="Assay Endpoints" to="/assay-endpoints">
              Assay Endpoints
            </NuxtLink> and access details of specific assays with a single click.
          </p>
          <p class="h3 blue-text">
            Our <NuxtLink title="Advanced Search" to="/advanced-search">
              Advanced Search
            </NuxtLink> page allows you to search on mass, molecular formula,
            or to generate molecular formulae for searching.
          </p>
          <p class="h3 blue-text">
            The <NuxtLink title="Batch Search" to="/batch-search">
              Batch Search
            </NuxtLink> page allows you to enter a list of mixed chemical identifiers
            and use the results of the search to generate advanced reports that are downloadable in multiple file types.
          </p>
        </div>
      </section>
    </client-only>
  </div>
</template>

<script>
import {
  mapMutations, mapState, mapGetters,
} from 'vuex';

import {AgGridVue} from 'ag-grid-vue';
import ResultsToolbar from '~/components/toolbars/gridToolbar/ResultsToolbar.vue';
import ChemicalTiles from '~/components/results/ChemicalTiles.vue';
import ChemImgModal from '~/components/modals/ChemImgModal.vue';
import DtxsidDetailsRenderer from '~/components/cellRenderers/DtxsidDetailsRenderer.vue';
import PopOverRenderer from '~/components/cellRenderers/PopOverRenderer.vue';
import GridPopover from '~/components/cellRenderers/GridPopover.vue';
import WrappedText from '~/components/cellRenderers/WrappedText.vue';

export default {
  name: 'Results',
  components: {
    AgGridVue,
    ResultsToolbar,
    ChemicalTiles,
    ChemImgModal,
    DtxsidDetailsRenderer,
    PopOverRenderer,
    GridPopover,
    WrappedText,
  },
  props: {
    rowData: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {type: Boolean, default: false},
    cname: {
      type: Object,
      default() {
        return {};
      },
    },
    csearch: {
      type: String,
      default: '',
    },
    filter: {
      type: Object,
      default: null,
    },
    customSort: {
      type: Object,
      default() {
        return {
          defaultState: {sort: null},
        };
      },
    },
    configObj: {
      type: Object,
      default() {
        return {
          gridColumnDefs: [],
          gridOptions: {
            headerHeight: 50,
          },
          defaultColDef: {
            filter: 'agTextColumnFilter',
            resizable: true,
            autoHeight: true,
            minWidth: 70,
          },
        };
      },
    },
    copyUrlConfig: {
      type: Object,
      default() {
        return {
          copyButtonTipText: 'Copy URL',
          copy: false,
        };
      },
    },
    gridSize: {
      type: String,
      default: 'height: auto; minHeight:50px maxWidth: 1070px; minWidth: 400px;',
    },
    gridReference: {type: String, default: 'grid-reference'},
    gridHeading: {type: String, default: 'Heading'},
    batchSearchItems: {type: Number, default: 0},
    percentDone: {type: Number, default: 0},
    chunkSize: {type: Number, default: 1000},
    chemListSubstring: {type: Boolean, default: false},
    chunkData: {
      type: Array,
      default() {
        return [];
      },
    },
    customExcelExport: {
      type: Function,
      default() {
        return 0;
      },
    },
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
      chemicalCount: 0,
      sortObj: {},
      currentSort: {},
      totalRecords: 0,
      missedRecords: 0,
      showReload: false,
      selectedRecords: 0,
      filterFlag: false,
      gridData: [],
      getRowHeight: null,
      customHeight: 100,
      filterInfo: '',
      tileSelectionClickFlag: false,
    };
  },
  computed: {
    ...mapState('results', [
      'filteredChemicals',
      'sortModel',
      'filterModel',
      'gridToggle',
    ]),
    ...mapState('assayEndpointResults', ['chemicalsSelectedBy']),
    ...mapGetters('results', [
      'getModalInfo',
      'getChemicals',
      'getSortModelState',
      'getGridToggle',
    ]),
    totalRecordsCount() {
      return !this.isBatch ? this.totalRecords : this.batchSearchItems;
    },
    showTruncatedResultMsg() {
      return this.isSss && this.totalRecordsCount >= 10000;
    },
    modalImageURL() {
      const {gsid} = this.getModalInfo();
      const url = `${process.env.APPLICATION_BASE_API}${this.imageApi}by-dtxsid/${gsid}`;
      return url;
    },
    isSss() {
      return this.$route.name === 'sss';
    },
    isBatch() {
      if (this.$route.name === 'batch-search') {
        return true;
      }
      return false;
    },
  },
  watch: {
    // sortModel(n) {
    //   this.sortObj = {colId: n.colId, sort: n.sort}
    //   console.log('in watch sortModel', n)
    //   this.columnApi.applyColumnState({
    //     state: [this.sortObj],
    //   })
    // },
    // deep: true,
    filterModel(n, o) {
      // console.log('filterModel', n)
      this.processExternalFilter(n);
      const outputInfo = n.map((item) => {
        let nVal = item;

        if (item === 'noStructure') {
          nVal = 'No Structures';
        }
        if (item === 'structure') {
          nVal = 'Are Structures';
        }
        return nVal;
      });
      this.filterInfo = outputInfo.join(', ');
    },
    chemicalsSelectedBy(n, o) {
      this.processExternalFilter(this.filterModel);
    },
    chunkData(newChunk) {
      if (newChunk && newChunk.length) {
        this.totalRecords += newChunk.length;
        this.gridApi.applyTransaction({add: newChunk});
        this.selectedRecords = this.gridApi.getDisplayedRowCount();
        // this.setChemicalsToGrid()
      } else {
        this.missedRecords += 1000;
      }
    },
  },
  created() {
    this.gridOptions = {
      components: {
        ncctRound: this.ncctRound,
        whenEmpty: this.whenEmpty,
        percentFormatter: this.percentFormatter,
        roundTo6: this.roundTo6,
        ncctRound2: this.ncctRound2,
      },
    };
  },
  beforeMount() {
    this.getRowHeight = params => this.customHeight;
    this.filterInfo = this.filterModel.join(', ');
  },
  mounted() {
    if (this.batchSearchItems > 0) {
      this.totalRecords = this.batchSearchItems;
    }
    this.$nuxt.$on('updateSort', (sortObj) => {
      this.listCustomSort(sortObj);
    });
    this.$nuxt.$on('clearCounts', (params) => {
      this.totalRecords = 0;
      this.chemicalCount = 0;
    });
    const savedView = window.localStorage.getItem('defaultView');
    if (savedView) {
      this.setGridToggle(savedView);
    }
    this.setChemicals(this.rowData);
    window.addEventListener('load', this.handleResize);
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('load', this.handleResize);
    window.removeEventListener('resize', this.handleResize);
  },
  destroyed() {
    this.setFilterModel([]);
  },
  methods: {
    ...mapGetters('results', ['getFilterOptions', 'getFilterModel']),
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      setSelectedChemical: 'results/setSelectedChemical',
      setSelectedTilesFromGrid: 'results/setSelectedTilesFromGrid',
      setChemicalImage: 'results/setChemicalImage',
      setModalVisibility: 'results/setModalVisibility',
      setGridToggle: 'results/setGridToggle',
      setFilterModel: 'results/setFilterModel',
      setCustomSort: 'results/setSort',
      setSendToBatchChemicals: 'batchSearchResults/setSendToBatchChemicals',
    }),
    processExternalFilter(newFilter) {
      if (!this.gridApi) {
        return;
      }
      const dtxsidFilter = this.gridApi.getFilterInstance('dtxsid');
      const compoundIdFilter = this.gridApi.getFilterInstance('compoundId');
      const selectedFilter = this.gridApi.getFilterInstance('selected');
      const isotopeFilter = this.gridApi.getFilterInstance('isotope');
      const hitCallfilter = this.gridApi.getFilterInstance('hitCall');
      const multiComponentFilter = this.gridApi.getFilterInstance('multicomponent');

      if (newFilter.includes('unselected')) {
        this.filterFlag = true;
        selectedFilter.setModel({
          type: 'equals',
          filter: 'true',
          filterTo: null,
        });
      } else if (selectedFilter) {
        selectedFilter.setModel(null);
      }

      if (newFilter.includes('isotope')) {
        isotopeFilter.setModel({
          type: 'notEqual',
          filter: '1',
          filterTo: null,
        });
      } else if (isotopeFilter) {
        isotopeFilter.setModel(null);
      }

      if (newFilter.includes('inactive') && !newFilter.includes('active')) {
        hitCallfilter.setModel({
          type: 'equals',
          filter: 'Active',
          filterTo: null,
        });
      } else if (hitCallfilter) {
        hitCallfilter.setModel(null);
      }

      if (newFilter.includes('inactive' && 'active')) {
        hitCallfilter.setModel([]);
      }

      if (newFilter.includes('active') && !newFilter.includes('inactive')) {
        hitCallfilter.setModel({
          type: 'equals',
          filter: 'Inactive',
          filterTo: null,
        });
      }

      if (newFilter.includes('multicomponent')) {
        multiComponentFilter.setModel({
          type: 'notEqual',
          filter: '1',
        });
      } else if (multiComponentFilter) {
        multiComponentFilter.setModel(null);
      }

      if (newFilter.includes('noStructure') && !this.filterModel.includes('structure')) {
        compoundIdFilter.setModel({
          type: 'notEqual',
          filter: '1',
        });
      } else if (
        newFilter.includes('structure') &&
        !this.filterModel.includes('noStructure')
      ) {
        compoundIdFilter.setModel({
          type: 'blank',
          filter: '0',
        });
      } else if (compoundIdFilter) {
        compoundIdFilter.setModel(null);
      }

      if (
        this.filterModel.includes('noStructure') &&
        this.filterModel.includes('structure')
      ) {
        // We need to filter out all if both no structure and are structure are selected.
        compoundIdFilter.setModel({
          type: 'equals',
          filter: 0,
        });
      }

      if (
        newFilter.includes('histogram_union') &&
        !newFilter.includes('histogram_intersection')
      ) {
        const union = this.chemicalsSelectedBy.logAc50.concat(this.chemicalsSelectedBy.scaledTopCutoff);
        dtxsidFilter.setModel({values: union});
      } else if (newFilter.includes('histogram_intersection')) {
        const intersection = [];
        this.chemicalsSelectedBy.logAc50.forEach((c) => {
          if (this.chemicalsSelectedBy.scaledTopCutoff.includes(c)) {
            intersection.push(c);
          }
        });
        this.gridApi.getFilterInstance('dtxsid').setModel({values: intersection});
      } else {
        dtxsidFilter.setModel(null);
      }
      this.gridApi.onFilterChanged();
    },
    listCustomSort(sort) {
      if (this.columnApi.columnModel) {
        this.columnApi.applyColumnState({
          defaultState: {sort: null},
        });
      }
      if (this.columnApi.columnModel) {
        this.columnApi.applyColumnState({
          state: [sort],
        });
      }
    },
    quickFilter(input) {
      this.gridApi.setQuickFilter(input);
    },
    selectAll(setSelectAll) {
      if (setSelectAll) {
        this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
          rowNode.setSelected(true);
          rowNode.data.selected = true;
        });
        this.updateFilteredChemicals();
      } else {
        this.gridApi.deselectAll();
        this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
          rowNode.setSelected(false);
          rowNode.data.selected = false;
        });
        this.updateFilteredChemicals();
      }
    },
    sendtoBatch(params) {
      let batchChemicals = [];
      if (this.gridApi.getSelectedRows().length > 0) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        batchChemicals = selectedNodes.map(node => node.data.dtxsid);
      } else {
        this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
          batchChemicals.push(rowNode.data.dtxsid);
        });
      }
      if (!this.isBatch) {
        this.setSendToBatchChemicals(batchChemicals);
        this.$router.push({
          path: '/batch-search',
          query: {sendToBatch: true},
        });
      }
      if (this.isBatch) {
        this.setSendToBatchChemicals(batchChemicals);
        this.$nuxt.$emit('replaceBatchList', batchChemicals);
      }
    },
    exportData(params) {
      params.allColumns = true;
      this.$emit('exportData', params);
    },

    handleResize() {
      if (this.gridApi !== null && this.getGridToggle === 'th') {
        this.gridApi.sizeColumnsToFit();
        if (
          window.screen.width === 1200 ||
          window.screen.width === 992 ||
          window.screen.width === 768 ||
          window.screen.width === 576
        ) {
          this.gridApi.resetRowHeights();
        }
      }
    },
    onCellClicked(params) {
      if (params.column.colId === 'structureImage' && params.data.hasStructureImage) {
        const chemicalInfo = {
          name: params.data.name,
          gsid: params.data.dtxsid,
          imageBy: 'by-dtxsid',
          visible: true,
        };
        this.setChemicalImage(chemicalInfo);
      }

      if (params.column.colId === 'preferredName') {
        this.$nuxt._router.push({
          path: `/chemical/details/${params.data.dtxsid}`,
        });
      }
    },
    onColumnVisible(params) {
      if (params.columns[0].colId === 'structureImage' && params.visible !== true) {
        this.customHeight = 25;
        this.gridApi.resetRowHeights();
      } else if (
        params.columns[0].colId === 'structureImage' &&
        params.visible === true
      ) {
        this.customHeight = 100;
        this.gridApi.resetRowHeights();
      }
    },
    updateFilteredChemicals() {
      // console.log('this.gridApi.rowModel.rowsToDisplay: ', this.gridApi.rowModel.rowsToDisplay)
      const sfChemicals = [];
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
        if (rowNode.selected) {
          rowNode.data.selected = true;
        } else {
          rowNode.data.selected = false;
        }
        sfChemicals.push(rowNode.data);
      });
      this.setChemicals(sfChemicals);
    },
    onModelUpdated(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.chemicalCount = params.api.getDisplayedRowCount();
      this.handleResize();
      if (this.gridApi) {
        this.setChemicalsToGrid();
      }
    },
    onFirstDataRendered(params) {
      this.processExternalFilter(this.filterModel);
    },
    onSortChanged(params) {
      const sfChemicals = [];
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
        sfChemicals.push(rowNode.data);
      });
      this.setChemicals(sfChemicals);
    },
    onFilterChanged(params) {
      if (!this.filterFlag) {
        this.gridApi.deselectAll();
      } else {
        this.filterFlag = false;
      }
      const sfChemicals = [];
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
        sfChemicals.push(rowNode.data);
      });
      this.setChemicals(sfChemicals);
    },
    onSelectTile(pObj) {
      this.tileSelectionClickFlag = true;
      const rn = this.gridApi.getRowNode(pObj.uuId);
      rn.setSelected(pObj.newState);
      this.setSelectedChemical({
        uuId: pObj.uuId,
        selectedState: pObj.newState,
      });
    },
    setGridSelectionFromTiles() {
      const chemicalsFromTiles = this.getChemicals;
    },
    onSelectionChanged(params) {
      if (this.tileSelectionClickFlag !== true) {
        // this.setSelectedTilesFromGrid(params.api.getSelectedNodes())
      } else {
        this.tileSelectionClickFlag = false;
      }
      if (this.gridApi.getSelectedRows().length > 0) {
        this.selectedRecords = this.gridApi.getSelectedRows().length;
      } else {
        this.selectedRecords = this.chemicalCount;
      }
      this.updateFilteredChemicals();
    },
    onGridReady(params) {
      const {
        chemicalLists, assayEndpoints, batchSearchChemicals,
      } = this.$refs;
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.totalRecords = this.gridApi.getDisplayedRowCount();
      if (this.customSort) {
        this.listCustomSort(this.customSort);
      }
      const gridRef = {
        gridApi: params.api,
        columnApi: params.columnApi,
        reference: this.gridReference,
      };
      this.$emit('gridRef', gridRef);
      if (this.csearch.length > 0) {
        this.gridApi.setQuickFilter(this.csearch);
      }
      params.api.sizeColumnsToFit();
    },
    setSelectedView(params) {
      window.localStorage.setItem('defaultView', params);
      this.doToggle(params);
    },
    doToggle(params) {
      // eslint-disable-next-line no-empty
      if (params === 'table') {
        this.updateFilteredChemicals();
        if (this.tileSelectionClickFlag !== true) {
          this.setSelectedTilesFromGrid(this.gridApi.getSelectedNodes());
        } else {
          this.tileSelectionClickFlag = false;
        }
        if (this.gridApi.getSelectedRows().length > 0) {
          this.selectedRecords = this.gridApi.getSelectedRows().length;
        } else {
          this.selectedRecords = this.chemicalCount;
        }
      }
      if (params === 'th') {
        this.setChemicalsToGrid();
        this.handleResize();
      }
      this.setGridToggle(params);
      this.configObj.gridOptions.rowHeight = 50;
    },
    setChemicalsToGrid() {
      const selected = this.getChemicals();
      if (selected) {
        this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
          if (selected[index]?.selected) {
            rowNode.setSelected(selected[index].selected);
          }
        });
      }
    },
    getColumnKeysForExport() {
      return this.columnApi
        .getAllDisplayedColumns()
        .filter(col => !col.getColDef().checkboxSelection)
        .filter(col => col.getId() !== 'structureImage')
        .map(col => col.getId());
    },
  },
};
</script>
<style>
.and,
.or {
  position: relative !important;
  opacity: 1 !important;
}

.related-cell {
  padding-top: 3px;
  white-space: normal !important;
  line-height: 1.2em !important;
}
.chemCount {
  padding: 3px 0;
  text-align: center;
  font-size: 12px;
}
.filter-info {
  font-size: 12px;
  text-align: center;
}
.ag-header-icon.ag-header-cell-menu-button {
  opacity: 1 !important;
}
</style>
