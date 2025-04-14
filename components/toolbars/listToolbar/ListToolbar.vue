<template>
  <mdb-container class="toolbar" :data-cy="`${cname}ListToolbar`">
    <mdb-row>
      <mdb-col col="12">
        <!-- Small device, phones, width less than 768px: 3 rows and each sub-component (12 col) per row -->
        <!-- Media device, tablets, width less than 992px: 1 row (5 + 5 + 2 col) and hide text on sort button-->
        <!-- Extra large and large device, desktops, width more than 992px: 1 row (4 + 4 + 4 col) -->
        <mdb-row class="d-flex align-items-center">
          <mdb-col col="12" md="5" lg="4" xl="4" class="py-1">
            <list-search-box
              :cname="cname"
              @onFilter="emitInput"
            />
          </mdb-col>
          <mdb-col col="12" md="5" lg="4" xl="4" class="d-flex justify-content-end py-1">
            <list-display-count
              :cname="cname"
              :filtered-count="filteredCount"
              :total-count="totalCount"
            />
          </mdb-col>
          <mdb-col col="12" md="2" lg="4" xl="4" class="d-flex justify-content-end py-1">
            <list-sort-button
              :cname="cname"
              :sort-btn-text="sortBtnText"
              :default-order="defaultOrder"
              class="sort-btn"
              @onSort="emitOrder"
            />
          </mdb-col>
        </mdb-row>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
} from 'mdbvue'
import ListSearchBox from '~/components/toolbars/listToolbar/ListSearchBox.vue'
import ListDisplayCount from '~/components/toolbars/listToolbar/ListDisplayCount.vue'
import ListSortButton from '~/components/toolbars/listToolbar/ListSortButton.vue'

export default {
  name: 'ListToolBar',
  components: {
    ListSearchBox,
    ListDisplayCount,
    ListSortButton,
    mdbContainer,
    mdbRow,
    mdbCol,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    filteredCount: {
      type: Number,
      default: 0,
    },
    totalCount: {
      type: Number,
      default: 0,
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
      order: '',
    }
  },
  methods: {
    emitOrder(order) {
      this.order = order
      this.$emit('onSort', this.order)
    },
    emitInput(input) {
      this.$emit('onFilter', input)
    },
  },
}
</script>

<style>
@media (min-width: 767.98px) and (max-width: 991.98px) {
  .sort-btn {
  font-size: 0 !important;
  padding: 0.7rem 1rem !important;
 }
}

.sort-btn {
  margin: 0!important;
}
</style>
