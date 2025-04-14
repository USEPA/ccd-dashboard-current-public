<template>
  <mdb-tooltip trigger="hover" :options="{ placement: 'top' }">
    <span slot="tip">{{ tipText }}</span>
    <button
      id="select-all-btn"
      slot="reference"
      type="button"
      class="btn blue lighten-1 m-0"
      @click="selectAll"
    >
      <mdb-icon icon="check-double" />
    </button>
  </mdb-tooltip>
</template>

<script>
import {
  mapGetters,
} from 'vuex'
import {
  mdbBtn, mdbTooltip, mdbIcon,
} from 'mdbvue'

export default {
  name: 'SelectAllButton',
  components: {
    mdbTooltip,
    mdbIcon,
  },
  props: {
    tipText: {
      type: String,
      default: 'Select all Chemicals',
    },
  },
  computed: {
    ...mapGetters('results', ['getSetAll']),
  },
  methods: {
    selectAll() {
      // console.log('getSetAll: ', this.getSetAll())
      this.$emit('selectAll', this.getSetAll())
    },
  },
}
</script>

<style scoped lang="scss">
#select-all-btn {
  padding: 6px 10px;
  color: white;
}
</style>