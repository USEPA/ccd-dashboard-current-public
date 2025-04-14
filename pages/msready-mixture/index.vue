<template>
  <mdb-container fluid class="content left-fullwidth-container">
    <div class="h2">
      <ccte-help-text
        data-cy="MSReadyMixtureHeader"
        label-type="span"
        :heading-text="`MS-Ready Mappings of ${chemical.preferredName} (Isotopes pre-filtered)`"
        help-key="MSReadyMixtureHeader"
      />
    </div>
    <Results
      :row-data="chemicals"
      :cname="cname"
      :grid-size="gridSize"
      :config-obj="gridConfigurationObj"
      grid-reference="results"
      grid-heading="Search Results"
      @gridRef="onGridRef"
      @exportData="onExportData"
    />
  </mdb-container>
</template>

<script>
import {mdbContainer} from 'mdbvue';
import {
  mapGetters, mapMutations,
} from 'vuex';
import Results from '@/components/results/Results.vue';

export default {
  name: 'ResultsPage',
  components: {
    mdbContainer,
    Results,
  },
  data() {
    return {
      gridConfigurationObj: {},
      gridSize: 'height: 600px; overflow:auto',
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      filterModel: ['isotope'],
      exportColDefs: [],
    };
  },
  computed: {
    ...mapGetters({
      getGridDefs: 'chemicalResultsConfig/getBaseGridDefs',
      getExportColDefs: 'chemicalResultsConfig/getExportColDefs',
      getToolBar: 'chemicalResultsConfig/getBaseToolBar',
    }),
    exportColumnDefs() {
      return this.getExportColDefs().filter(col => col.key !== 'massDiff');
    },
  },
  async asyncData(context) {
    const chemical = await context.app.$repositories.chemicalDetails.findByDtxcid(context.query.dtxcid);
    // eslint-disable-next-line max-len
    const response = await context.app.$repositories.chemicalSearch.msReadySearchByDtxcid(context.query.dtxcid, context.$sentry);
    const chemicals = Array.isArray(response) ?
      response.map((chem, idx) => ({
        ...chem, uuId: idx, preferredName: chem.preferredName || chem.iupacName,
      })) :
      [];

    return {chemicals, chemical};
  },
  created() {
    this.setFilterOptions(this.getToolBar().filterOptions);
    this.setSortOptions(this.getToolBar().sortOptions);
    this.setFilterModel(this.filterModel);
    this.setTileInfoOptions(this.getToolBar().tileInfoOptions);
  },
  beforeMount() {
    this.colDefs = this.getGridDefs();
    this.gridColumnDefs = this.colDefs.map((col) => {
      if (col.children) {
        col.children.map((child) => {
          if (child.valueFormatter) {
            child.valueFormatter = this[child.valueFormatter];
          }
          if (child.valueGetter) {
            child.valueGetter = this[child.valueGetter];
          }
          return child;
        });
      }
      if (col.valueFormatter) {
        col.valueFormatter = this[col.valueFormatter];
      }
      if (col.valueGetter) {
        col.valueGetter = this[col.valueGetter];
      }
      if (col.getQuickFilterText) {
        col.getQuickFilterText = this[col.getQuickFilterText];
      }
      return col;
    });
    this.exportColDefs = this.exportColumnDefs;
    this.gridConfigurationObj = {
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridColumnDefs: this.gridColumnDefs,

      gridOptions: {
        suppressContextMenu: true,
        rowHeight: 100,
        rowSelection: 'multiple',
        headerHeight: 50,
        tooltipShowDelay: 500,
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          roundTo6: this.roundTo6,
          formatPreferredName: this.formatPreferredName,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
        },
      },
    };
  },
  methods: {
    ...mapMutations({
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setFilterModel: 'results/setFilterModel',
      setTileInfoOptions: 'results/setTileInfoOptions',
    }),

    onExportData(params) {
      const fileName = `MS-Ready Mappings of ${this.$route.query.dtxcid}-${params.fileName}`;
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv({
          ...params,
          fileName,
          columnKeys: this.exportColDefs.map(col => col.key),
          skipColumnGroupHeaders: true,
          processHeaderCallback: headerParams => this.exportColDefs?.find(col => col.key === headerParams.column.colDef.field)?.header || ''
          ,
        });
      } else if (params.fileType === 'xlsx') {
        const exportConfig = {
          gridApi: this.gridApi, columns: this.exportColDefs, fileName, splitSheet: {xSplit: 1, ySplit: 1},
        };
        this.exportData(exportConfig);
      }
    },

    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },
  },
};
</script>

