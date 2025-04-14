<template>
  <mdb-btn
    class="blue-base"
    size="sm"
    :data-cy="`${cname}SortBtn`"
    @click="emitToggledSort"
  >
    <mdb-icon icon="sort" class="mx-2" />
    {{ sortBtnText }}
  </mdb-btn>
</template>

<script>
import {
  mdbIcon,
  mdbBtn,
} from 'mdbvue'

export default {
  name: 'ListSortButton',
  components: {
    mdbIcon,
    mdbBtn,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    defaultOrder: {
      type: String,
      default: 'desc',
    },
    sortBtnText: {
      type: String,
      default: 'SORT',
    },
  },
  data() {
    return {
      order: this.defaultOrder,
    }
  },
  methods: {
    emitToggledSort() {
      this.order === 'desc' ? this.order = 'asc' : this.order = 'desc'
      this.$emit('onSort', this.order)
    },
  },
}
</script>

