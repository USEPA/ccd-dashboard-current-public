<template>
  <div>
    <client-only>
      <actor-details-modal />
      <div class="h2 ml-1">
        <ccte-help-text
          data-cy="ActorHeader"
          label-type="span"
          heading-text="ACToR - Aggregated Computational Toxicology Resource"
          help-key="ActorHeaderHelp"
        />
      </div>
    </client-only>
    <div v-if="getActorCategories.length > 0" class="mr-4" style="margin-top:10px">
      <section class="actorTopGrid">
        <actor-grid-toolbar
          v-if="getActorCategories.length > 0"
          :cname="cname"
          :toolbar-config="toolbarConfig"
          :select-options="getActorCategories"
          :select-default="activeSection"
        />
        <div v-if="showGrid">
          <grid-tips
            :cname="cname"
            grid-reference="actorAs"
            :grid-size="gridSize"
            :show-export="false"
            :config-obj="gridConfigurationObj"
            @cellClicked="onCellClicked"
            @onExport="onExportData"
            @gridRef="onGridRef"
          >
            <template #heading>
              <div class="modal-header">
                <span class="modal-title">Assays</span>
              </div>
            </template>
          </grid-tips>
        </div>
      </section>
      <section v-if="getShowActorAssayData" class="actorAssayData">
        <actor-assay-data />
      </section>
    </div>
    <div v-else>
      No categories found for {{ chemical.dtxsid || chemical.dtxcid }}
    </div>
  </div>
</template>

<script>
import {
  mapState, mapGetters, mapActions, mapMutations,
} from 'vuex';
import ActorGridToolbar from '~/components/toolbars/gridToolbar/ActorGridToolbar.vue';
import GridTips from '~/components/grids/GridWithToolTips.vue';
import PopOverUnderline from '~/components/cellRenderers/PopOverUnderline.vue';
import PopOverRenderer from '~/components/cellRenderers/PopOverRenderer.vue';
import AssayDataToggle from '~/components/cellRenderers/AssayDataToggle.vue';
import ActorDetailsModal from '~/components/modals/ActorDetailsModal.vue';
import ActorAssayData from '~/components/actor/ActorAssayData.vue';

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (currentChem.dtxsid === data.params.id || currentChem.dtxcid === data.params.id) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical', data, data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'ActorView',
  components: {
    ActorGridToolbar,
    ActorDetailsModal,
    ActorAssayData,
    PopOverRenderer,
    PopOverUnderline,
    AssayDataToggle,
    GridTips,
  },
  data() {
    return {
      activeSection: null,
      showGrid: false,
      cname: {
        camelName: 'chemicalActor',
        hyphenName: 'chemical-actor',
        baseName: 'Chemical ACToR',
      },
      toolbarConfig: {
        select: true,
        search: true,
        radio: false,
        export: false,
      },
      gridConfigurationObj: {},
      gridSize: 'height: 280px; ',
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
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    ...mapGetters({
      getActorCategories: 'actor/getActorCategories',
      getCategorySelection: 'actor/getCategorySelection',
      getActorAssays: 'actor/getActorAssays',
      getAssayData: 'actor/getActorAssayData',
      getAssayDetails: 'actor/getActorAssayDetails',
      getAssayDataCols: 'actor/getActorAssayDataCols',
      getAssayComponents: 'actor/getActorAssayComponents',
      getAssayGridDefs: 'actor/getAssayGridDefs',
      getShowActorAssayData: 'actor/getShowActorAssayData',
    }),
  },
  async asyncData(context) {
    const categories = await context.store.dispatch('actor/getCategories', context);
    return categories;
  },
  head() {
    return {
      title: `${this.chemical.preferredName} ACToR`,
      meta: [],
    };
  },
  async created() {
    // eslint-disable-next-line prefer-destructuring
    this.$nuxt.$on('updateActorCategory', () => {
      this.updateActorCategory();
    });
    this.$nuxt.$on('assayDataToggle', (params) => {
      this.setShowActorAssayData(false);
      this.assayDataGrid(params);
    });
    // console.log(this.categories)
    if (this.getActorCategories.length > 0) {
      // console.log(this.getActorCategories[0].value)
      this.activeSection = this.getActorCategories[0].value;
      await this.updateActorCategory();
    }
  },
  beforeMount() {
    this.gridConfigurationObj = {
      gridColumnDefs: this.getAssayGridDefs,
      gridData: this.getActorAssays,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
      },
      gridOptions: {
        headerHeight: 40,
        suppressContextMenu: true,
        unSortIcon: true,
        components: {
          ncctRound: this.ncctRound,
        },
        statusBar: {
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
          ],
        },
      },
    };
  },
  methods: {
    ...mapActions({
      fetchAssayData: 'actor/assayDataSearch',
      fetchAssayDataCols: 'actor/assayDataColumnsSearch',
      fetchAssayDetails: 'actor/assayDetailsSearch',
    }),
    ...mapMutations({
      setShowActorAssayData: 'actor/setShowActorAssayData',
      setSelectedActorAssayName: 'actor/setSelectedActorAssayName',
    }),
    async assayDataGrid(params) {
      this.$nuxt.$loading.start();
      const assayDataCols = await this.$store.dispatch('actor/assayDataColumnsSearch', params);
      const assayData = await this.$store.dispatch('actor/assayDataSearch', params);
      this.setSelectedActorAssayName(params.assayName);
      if (assayDataCols) {
        this.setShowActorAssayData(true);
        this.$nuxt.$loading.finish();
      }
      if (!assayDataCols) {
        this.$notify.error({
          message: 'No assay data availeble for the selected assay.', position: 'top right', timeOut: 3000,
        });
        this.setShowActorAssayData(false);
        this.$nuxt.$loading.finish();
      }
    },
    async updateActorCategory() {
      this.$nuxt.$loading.start();
      this.setShowActorAssayData(false);
      // console.log(this.getCategorySelection, '--', this.chemical.dtxsid)
      const params = {
        categoryId: this.getCategorySelection,
        dtxsid: this.chemical.dtxsid,
      };
      this.assayRows = await this.$store.dispatch('actor/assaySearch', params);
      this.gridConfigurationObj.gridData = this.assayRows;
      // console.log(this.assayRows)
      const dataParams = {
        categoryId: this.getCategorySelection,
        dtxsid: this.chemical.dtxsid,
        assayId: this.assayRows[0].assayId,
        assayName: this.assayRows[0].assayName,
      };
      this.showGrid = true;
      this.assayDataGrid(dataParams);
    },
    onExport(params) {
      if (params.fileType === 'csv') {
        params.fileName = `${this.activeChemical.dtxsid} Fate ${this.currentSectionName} ${params.reference}.csv`;
        this.gridRefs[params.reference].gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        params.fileName = `${this.activeChemical.dtxsid} Fate ${this.currentSectionName} ${params.reference}.xlsx`;
        this.gridRefs[params.reference].gridApi.exportDataAsExcel(params);
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
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    onGridRef(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      const gridRef = {
        gridApi: params.api,
        columnApi: params.columnApi,
        reference: this.gridReference,
      };
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
    onCellClicked(params) {
      // console.log(params)
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
section {
  &.actorTopGrid {
  max-width: 900px !important;
  }
}
.modal-title {
    margin-bottom: 0;
    line-height: 1.5;
    font-size: 1.3em !important;font-weight: 500 !important;
}
.md-toast-top-right {
    top: 120px !important;
    right: 120px !important;
}
.home-search-input-group {
  margin-top: 1.5em;
}

.home-search-icon {
  height: 3em;
  width: 3em;
}

.home-search-input {
  height: 3em;
}
</style>

