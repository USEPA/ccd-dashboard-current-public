<template>
  <div>
    <mdb-select
      id="filter-multi"
      multiple
      outline
      data-cy="ResultsMultiSelect"
      :options="filterOpts"
      placeholder="Hide chemicals that are:"
      @getValue="getSelectValue"
    />
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import {mdbSelect} from 'mdbvue'

export default {
  name: 'ResultsMultiselect',
  components: {
    mdbSelect,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      msName: `${this.cname.camelName}msInput`,
      filterOpts: [],
    }
  },
  computed: {
    ...mapState('results', ['filterModel', 'filterOptions']),
  },
  created() {
    this.filterOpts = [...this.filterOptions]
  },

  methods: {
    ...mapMutations({setFilterModel: 'results/setFilterModel'}),
    getSelectValue(value, text) {
      const params = {
        filterColumn: this.filterColumn,
        filterValue: value,
      }
      this.setFilterModel(value)
    },
  },
}
</script>

<style scoped>
.select-dropdown {
  margin: 0 !important;
  max-height: 400px;
}
.dropdown-content {
max-height: 10.7rem;
font-size:10px;
}
</style>
