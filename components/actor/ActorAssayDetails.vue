<template>
  <div v-if="getAssayDetails.length > 0 && getAssayComponents.length > 0 && getShowAssayDetailsModal">
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
  mapMutations, mapGetters, mapActions,
} from 'vuex'
import GridTips from '~/components/grids/GridWithToolTips.vue'
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue'

export default {
  name: 'ActorAssayDetails',
  components: {
    GridTips,
  },
  data() {
    return {
      cname: {
        camelName: 'actorAssayDetails',
        hyphenName: 'actor-assay-details',
        baseName: 'Actor Assay Details',
      },
      toolbarConfig: {
        select: false,
        search: false,
        radio: false,
        export: true,
      },
      gridConfigurationObj: {},
      gridSize: 'height: 105px; width: 100%; padding: .75rem;',
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
    }
  },
  computed: {
    ...mapGetters({
      getAssayDetails: 'actor/getActorAssayDetails',
      getAssayComponents: 'actor/getActorAssayComponents',
      getAssayDetailsGridDefs: 'actor/getAssayDetailsGridDefs',
      getActorAssayDetails: 'actor/getActorAssayDetails',
      getShowAssayDetailsModal: 'actor/getShowAssayDetailsModal',
    }),
  },
  created() {
    this.$nuxt.$on('actorDetailsModal', (params) => {
      this.assayDetailsGrid(params)
    })
  },
  beforeMount() {
    this.gridConfigurationObj = {
      gridColumnDefs: this.getAssayDetailsGridDefs,
      gridData: this.getActorAssayDetails,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
      },
      gridOptions: {
        headerHeight: 40,
        suppressContextMenu: true,
        components: {
          ncctRound: this.ncctRound,
        },
      },
    }
  },
  methods: {
    ...mapActions({
      fetchAssayDetails: 'actor/assayDetailsSearch',
      fetchAssayComponents: 'actor/assayComponentSearch',
    }),
    ...mapMutations({
      setShowAssayDetailsModal: 'actor/setShowAssayDetailsModal',
    }),
    assayDetailsGrid(params) {
    },
    onGridRef(params) {
      this.gridApi = params.gridApi
      this.columnApi = params.columnApi
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit()
    },
    onExportData(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params)
      } else if (params.fileType === 'xlsx') {
        const fname = `${params.fileName}`

        const exportConfig = {
          gridApi: this.gridApi, columns: this.exportColDefs, fileName: fname, splitSheet: {xSplit: 1, ySplit: 1},
        }
        this.exportData(exportConfig)
      }
    },
    handleResize() {
      if (this.gridApi !== null) {
        this.gridApi.sizeColumnsToFit()
        if (window.screen.width === 1200 ||
            window.screen.width === 992 ||
            window.screen.width === 768 ||
            window.screen.width === 576) {
          this.gridApi.resetRowHeights()
        }
      }
    },
    onModelUpdated(params) {
      this.handleResize()
    },
  },
}
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
