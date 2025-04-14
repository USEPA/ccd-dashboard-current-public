<template>
  <div class="mr-4">
    <client-only>
      <h2 class="header">
        Search Results
      </h2>
      <p>Searched using InChi Key Skeleton</p>
      <Results
        :row-data="connectivityChemicals"
        :cname="cname"
        :custom-sort="customSort"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        grid-reference="results"
        grid-heading=""
        @customSortApplied="customSortApplied"
      />
    </client-only>
  </div>
</template>

<script>

import {
  mapGetters, mapMutations, mapState,
} from 'vuex';
import Results from '~/components/results/Results.vue';

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
  name: 'SameConnectivityView',
  components: {
    Results,
  },
  data() {
    return {
      id: this.$route.params.id,
      gridConfigurationObj: {},
      gridSize: 'height: 600px; overflow:auto',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      customSort: {
        colId: 'similarity',
        sort: 'desc',
      },
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      active: 'same-connectivity',
      tanimoto: 0.8,
    };
  },
  async asyncData(context) {
    let chemical;
    let connectivityChemicals;
    try {
      chemical = await context.app.store.state.results.activeChemical;
      if (chemical) {
        connectivityChemicals = await context.app.$repositories.sameConnectivity.index(`${chemical.inchiKey.split('-')[0]}`);
      }
    } catch (e) {
      context.$sentry.captureMessage(`Same connectivity data retrieval error. Inchi:${chemical.inchiKey.split('-')[0]} :  ${e}`);
    }
    return {chemical, connectivityChemicals};
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Same Connectivity`,
      meta: [],
    };
  },
  computed: {
    ...mapGetters({
      getGridDefs: 'chemicalResultsConfig/getBaseGridDefs',
      getToolBar: 'chemicalResultsConfig/getBaseToolBar',
    }),
  },
  created() {
    this.setSortOptions(this.getToolBar().sortOptions);
    this.setFilterOptions(this.getToolBar().filterOptions);
    this.setTileInfoOptions(this.getToolBar().tileInfoOptions);
  },
  beforeMount() {
    this.columnDefs = this.getGridDefs();
    this.columnDefs.push({
      headerName: 'InchiString',
      valueGetter: this.splitInchi,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    },);
    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridOptions: {
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
        },
        suppressContextMenu: true,
        rowHeight: 100,
        rowSelection: 'multiple',
        tooltipShowDelay: 500,
        headerHeight: 50,
      },
    };
  },
  methods: {
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setFilterModel: 'results/setFilterModel',
    }),
    customSortApplied() {
    },
  },
};
</script>
<style lang="scss">
    .header {
        font-weight: bold;
        font-size: 1.3em;
    }
</style>

