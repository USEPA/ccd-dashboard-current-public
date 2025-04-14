<template>
  <mdb-container fluid class="content left-fullwidth-container">
    <div class="">
      <h3 data-cy="heading">
        Search Results
      </h3>
    </div>
    <div class="card">
      <div class="card-body">
        <p class="ml-3">
          <span class="card-title">Number of Chemicals: </span>
          <span class="card-text ml-3" />
        </p>
      </div>
    </div>


    <Results
      :cname="cname"
      :grid-size="gridSize"
      :config-obj="gridConfigurationObj"
      grid-reference="results"
      grid-heading="Search Results"
    />
  </mdb-container>
</template>

<script>
import {mdbContainer} from 'mdbvue'
import {
  mapGetters, mapMutations, mapState,
} from 'vuex'
import Results from '@/components/results/Results.vue'
import gridConfig from './agGridConfig'
import toolbarConfig from './toolbar_config.json'

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
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      defaultColumnDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        floatingFilter: true,
      },
      columnDefs: null,
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
    }
  },
  computed: {
    searchTypeComputed() {
      const search = 'Searched by '
      return search
    },
  },
  beforeCreate() {
    this.$store.dispatch('results/fetchChemicals', 'chemicallists')
  },
  created() {
    this.setFilterOptions(toolbarConfig.filterOptions)
    this.setSortOptions(toolbarConfig.sortOptions)
  },
  beforeMount() {
    this.columnDefs = gridConfig
    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      gridOptions: {
        suppressContextMenu: true,
        rowHeight: 100,
        rowSelection: 'multiple',
        headerHeight: 50,
      },
    }
  },
  methods: {
    ...mapMutations({
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
    }),
  },
}
</script>

