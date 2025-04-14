<template>
  <div class="container-fluid left-fullwidth-container content pt-3">
    <assay-modal
      :title="title"
      :visibility="showAssayModal"
      @toggleVisibility="showHideAssayModal"
    />
    <single-conc-modal
      :title="concTitle"
      :aeid="aeid"
      :visibility="showConcModal"
      :row-data="concData"
      :loading="isLoading"
      :percent-done="percentDone"
      @toggleConcVisibility="showHideConcModal"
    />
    <ccte-help-text
      data-cy="AssayEndpointsListHeader"
      label-type="h2"
      heading-text="Assay Endpoints List"
      help-key="Assay Endpoints List"
    />
    <grid-with-tools
      v-show="getAssayEndpoints.length"
      :cname="cname"
      :toolbar-config="toolbarConfig"
      grid-reference="assayLists"
      grid-heading="Assay Lists"
      :show-record-counts="true"
      :grid-size="gridSize"
      :config-obj="gridConfigurationObj"
      @gridRef="onGridRef"
      @exportData="onExportData"
    />
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import AssayModal from '~/components/assays/AssayModal.vue';
import SingleConcModal from '~/components/assays/SingleConcModal.vue';
import GridWithTools from '~/components/grids/GridWithTools.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';

const {mapGetters} = createNamespacedHelpers('assayEndpoints');
const {mapActions} = createNamespacedHelpers('assayEndpoints');

export default {
  name: 'AssayEndpoints',
  components: {
    AssayModal,
    // eslint-disable-next-line vue/no-unused-components
    PopOverUnderline,
    SingleConcModal,
    GridWithTools,
  },
  data() {
    return {
      cname: {
        camelName: 'assaylLists',
        hyphenName: 'assay-lists',
        baseName: 'Assay Lists',
      },
      toolbarConfig: {
        search: true,
        filter: true,
        export: true,
        copy: true,
      },
      gridConfigurationObj: {},
      exportColDefs: [],
      gridSize: 'height: 600px; overflow:auto',
      gridOptions: {
        defaultColDef: {
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeight: true,
          floatingFilter: true,
        },
        headerHeight: 70,
        columnDefs: null,
        rowData: null,
        animateRows: true,
        isExternalFilterPresent: true,
      },
      gridApi: null,
      columnApi: null,
      showAssayModal: false,
      showConcModal: false,
      title: '',
      concTitle: '',
      aeid: 0,
      concData: [],
      isLoading: false,
      percentDone: 0,
      paging: {},
    };
  },
  computed: {
    ...mapGetters(['getAssayEndpoints', 'getAssayVenders', 'getColumnDefs', 'getExportColDefs']),
  },
  async asyncData(context) {
    const response = await context.store.dispatch('assayEndpoints/asyncAssayEndpoints', context);
  },
  head() {
    return {
      title: `${process.env.APPLICATION_TITLE} Assay Lists`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Assay Lists`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Assay Lists`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Assay Lists - Over 150 curated chemical  lists`,
        },
      ],
    };
  },
  beforeMount() {
    this.exportColDefs = this.getExportColDefs();

    this.columnDefs = this.getColumnDefs.map((col) => {
      // if (col.comparator) {
      //   // eslint-disable-next-line no-param-reassign
      //   col.comparator = this[col.comparator]
      // }
      if (col.valueGetter) {
        col.valueGetter = this[col.valueGetter];
      }
      if (col.getQuickFilterText) {
        col.getQuickFilterText = this[col.getQuickFilterText];
      }

      return col;
    });

    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      gridData: this.getAssayEndpoints,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
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
      gridOptions: {
        unSortIcon: true,
        valueCache: true,
        headerHeight: 50,
        suppressContextMenu: true,
        components: {
          mcValues: this.mcValues,
          scValues: this.scValues,
          geneFilterText: this.geneFilterText,
        },
        context: {
          componentParent: this,
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
  },
  methods: {
    ...mapActions(['fetchLists']),
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
    geneFilterText(params) {
      // console.log("genFilterText: ", params)
      const ft = params.data.genes.reduce((acc, gene) => {
        acc += `${gene.gene_symbol} `;
        return acc;
      }, '');
      return ft;
    },

    onExportData(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        const fname = `${params.fileName}`;
        const splitFields = [
          {fieldToSplit: 'multi_conc_assay_chemical_count', keys: ['active', 'total']},
          {fieldToSplit: 'single_conc_assay_chemical_count', keys: ['singleActive', 'singleTotal']},
        ];
        const exportConfig = {
          gridApi: this.gridApi,
          columns: this.exportColDefs,
          fileName: fname,
          splitFields: splitFields,
          splitSheet: {xSplit: 1, ySplit: 1},
        };
        this.exportData(exportConfig);
      }
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      // this.gridApi.setSortModel([{colId: 'name', sort: 'asc'}])

      this.columnApi.applyColumnState({
        state: [
          {
            colId: 'name',
            sort: 'asc',
          },
        ],
      });
    },
    async singleConcClick(params) {
      this.concTitle = params.name;
      this.aeid = params.aeid;
      this.concData = null;
      this.isLoading = true;
      this.showHideConcModal();
      const endPointName = `?name=${params.name}&size=50`;
      const results = await this.$repositories.assay.assaySingleConcSearch(endPointName);
      this.concData = results.data;
      this.paging = results.paging;

      const listId = `?name=${this.$route.params.id}`;
      const percentChunk = parseInt(100 / this.paging.totalPages, 10);
      this.percentDone = percentChunk;

      try {
        for (let index = 1; index < this.paging.totalPages; index += 1) {
          // eslint-disable-next-line no-await-in-loop
          const response = await this.$repositories.assay.assaySingleConcSearch(`${endPointName}&page=${index}`);

          this.concData = this.concData.concat(response.data);
          this.percentDone += percentChunk;
        }
      } catch (ex) {
        this.$sentry.captureMessage(`Assay Endpoints ERROR-assaySingleConcSearch  endpoint name: ${endPointName} :  ${ex}`);
      }
      this.isLoading = false;
    },
    detailsClicked(params) {
      this.title = params.name;
      this.showHideAssayModal();
    },
    showHideAssayModal() {
      this.showAssayModal = !this.showAssayModal;
    },
    showHideConcModal() {
      this.showConcModal = !this.showConcModal;
    },
    scValues(params) {
      const scPercent = ((params.data.single_conc_assay_chemical_count.singleActive / params.data.single_conc_assay_chemical_count.singleTotal) * 100).toFixed(2);
      return scPercent;
    },
    mcValues(params) {
      const mcPercent = ((params.data.multi_conc_assay_chemical_count.active / params.data.multi_conc_assay_chemical_count.total) * 100).toFixed(2);
      return mcPercent;
    },

  },
};
</script>
<style lang="scss" scoped>
:deep(.toolbar) {margin-top: .7rem !important;}

:deep(.ag-header-cell-text) {
  color:#222;
  font-size:10px;
  font-weight:400;

}
:deep(.ag-header-cell) {
  padding-left:6px!important;
  padding-right:6px!important;
}
:deep(.ag-header-cell-label) {
   justify-content: center;
}


</style>
