<template>
  <div class="tool-container">
    <mdb-tooltip trigger="hover" :options="tipPosition">
      <span slot="tip">{{ sortToolTip }}</span>
      <a slot="reference" @click="toggleSortDir">
        <mdb-icon v-if="sortDirection === 'desc'" icon="arrow-circle-down" class="mr-2 ml-0 text-white" size="2x" />
        <mdb-icon v-else icon="arrow-circle-up" class="mr-2 mr-0 text-white" size="2x" />
      </a>
    </mdb-tooltip>
  </div>
</template>

<script>
import {
  mdbIcon,
  mdbTooltip,
} from 'mdbvue'

export default {
  name: 'ArrowSortButton',
  components: {
    mdbIcon,
    mdbTooltip,
  },
  props: {
    sortDirection: {
      type: String,
      default: 'desc',
    },
    sortToolTip: {
      type: String,
      default: 'Click to change sort direction',
    },
    sortField: {
      type: String,
      default: '',
    },
    tipPosition: {
      type: Object,
      default() {
        return {
          placement: 'bottom',
        }
      },
    }
  },
  methods: {
    toggleSortDir(evt) {
      const params = {
        sortDirection: this.sortDirection,
        sortField: this.sortField,
      }
      this.$emit('toggleSort', params)
    },
  },
}
</script>

<style scoped>
.tool-container {
  display: flex;
  height: 4em;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>