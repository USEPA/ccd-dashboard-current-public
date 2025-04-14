<template>
  <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
    <span slot="tip">Filter Tiles</span>
    <mdb-dropdown slot="reference">
      <mdb-dropdown-toggle
        slot="toggle"
        class="blue lighten-1 text-white"
        size="sm"
      >
        <mdb-icon icon="filter" />  <span class="hide-responsive">Filter</span>
        <span v-if="filterCount >0" style="margin-left:3px;font-size:10px" class="badge badge-pill badge-dark"> {{ filterCount }}</span>
      </mdb-dropdown-toggle>
      <mdb-dropdown-menu>
        <form class="px-2 py-2" style="min-width:300px">
          <p class="picker-info">
            Filter out chemicals that are:
          </p>
          <div v-for="(item, index) in infoItems" :key="index" class="custom-control custom-checkbox" @click.stop>
            <input
              :id="item.value"
              v-model="infoList"
              class="custom-control-input"
              type="checkbox"
              :value="item.value"
            >
            <label class="custom-control-label" :for="item.value">{{ item.text }}</label>
          </div>
        </form>
      </mdb-dropdown-menu>
    </mdb-dropdown>
  </mdb-tooltip>
</template>
<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex'
import {
  mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbIcon, mdbTooltip,
} from 'mdbvue'

export default {
  name: 'ResultsFilterPicker',
  components: {
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbIcon,
    mdbTooltip,
  },

  props: {

  },
  data() {
    return {
      infoItems: [],

    }
  },
  computed: {
    ...mapGetters('results', ['getFilterOptions', 'getFilterModel']),
    ...mapState('results', ['filterModel', 'filterOptions']),
    infoList: {
      set(val) {
        this.setFilterModel(val)
      },
      get() {
        return this.getFilterModel()
      },
    },
    filterCount() {
      return this.filterModel.length
    },

  },
  mounted() {
    this.infoItems = this.getFilterOptions()
  },
  methods: {
    ...mapMutations({setFilterModel: 'results/setFilterModel'}),
  },
}
</script>

<style lang="scss" scoped>
.picker-info {
  font-size:10px
}
</style>
