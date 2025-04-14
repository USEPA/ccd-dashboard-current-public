<template>
  <div v-if="getAssayData.length > 0">
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
        <div class="modal-header">
          <span class="modal-title">Assay Data - {{ getSelectedActorAssayName }}</span>
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
  name: 'ActorAssayData',
  components: {
    GridTips,
    PopOverUnderline,
  },
  data() {
    return {
      cname: {
        camelName: 'actorAssayData',
        hyphenName: 'actor-assay-data',
        baseName: 'Actor Assay Data',
      },
      gridConfigurationObj: {},
      gridSize: 'height: 150px; width: 100%; padding: .1rem;',
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
      getAssayData: 'actor/getActorAssayData',
      getAssayDataCols: 'actor/getActorAssayDataCols',
      getShowActorAssayData: 'actor/getShowActorAssayData',
      getSelectedActorAssayName: 'actor/getSelectedActorAssayName',
    }),
  },
  beforeMount() {
    // console.log(this.getAssayData)
    // console.log(this.getAssayDataCols)
    this.gridConfigurationObj = {
      gridColumnDefs: this.getAssayDataCols,
      gridData: this.getAssayData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        wrapText: true,
      },
      gridOptions: {
        suppressContextMenu: true,
        headerHeight: 50,
        components: {
          ncctRound: this.ncctRound,
        },
      },
    }
  },
  methods: {
    ...mapActions({
      fetchAssayDetails: 'actor/assayDetailsSearch',
    }),
    onGridRef(params) {
      this.gridApi = params.gridApi
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit()
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
    onModelUpdated(params) {
      this.handleResize()
    },
    onSelectionChanged(params) {
      this.$emit('selectionChanged', params)
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
