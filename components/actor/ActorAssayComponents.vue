<template>
  <div v-if="getAssayComponents.length > 0 && getActorAssayDetails.length > 0 && getShowAssayDetailsModal">
    <grid-tips
      :cname="cname"
      :grid-reference="cname.camelName"
      :grid-size="gridSize"
      :show-export="false"
      :config-obj="gridConfigurationObj"
      @onExport="onExportData"
      @gridRef="onGridRef"
    >
      <template #heading>
        <div class="col-12 modal-header" style="width: '100%'">
          <span class="modal-title" style="width: '100%'">Assay Components</span>
        </div>
      </template>
    </grid-tips>
  </div>
</template>

<script>
import {
  mapGetters, mapActions,
} from 'vuex';
import GridTips from '~/components/grids/GridWithToolTips.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';

export default {
  name: 'ActorAssayComponents',
  components: {
    GridTips,
  },
  data() {
    return {
      cname: {
        camelName: 'actorAssayComponents',
        hyphenName: 'actor-assay-components',
        baseName: 'Actor Assay Components',
      },
      gridConfigurationObj: {},
      gridSize: 'height: 255px; width: 100%; padding: .75rem;',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      exportColDefs: [],
      defaultColumnDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
      },
      columnDefs: null,
      gridData: null,
      statusbar: false,
    };
  },
  computed: {
    ...mapGetters({
      getAssayComponents: 'actor/getActorAssayComponents',
      getAssayDetailsGridDefs: 'actor/getAssayDetailsGridDefs',
      getActorAssayDetails: 'actor/getActorAssayDetails',
      getAssayComponentsCols: 'actor/getAssayComponentsCols',
      getShowAssayDetailsModal: 'actor/getShowAssayDetailsModal',


    }),
  },
  created() {
    this.gridConfigurationObj = {
      gridColumnDefs: this.getAssayComponentsCols,
      gridData: this.getAssayComponents,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        wrapText: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
      gridOptions: {
        headerHeight: 40,
        unSortIcon: true,
        suppressContextMenu: true,
        statusBar: {
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
          ],
        },
        components: {
          ncctRound: this.ncctRound,
        },
      },
    };
  },
  methods: {
    ...mapActions({
      fetchAssayComponents: 'actor/assayComponentSearch',
    }),
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
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
    onModelUpdated(params) {
      this.handleResize();
    },
    onSelectionChanged(params) {
      this.$emit('selectionChanged', params);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

.modal-dialog {
    position: relative;
    width: auto;
    pointer-events: none;
}
.modal-title {
    margin-bottom: 0;
    line-height: 1.5;
    font-size: 1.3em !important;font-weight: 500 !important;
}

.modal-xl {
    max-width: 80% !important;
}
</style>
