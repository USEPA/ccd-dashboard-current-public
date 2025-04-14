<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-header bg-dark text-white font-weight-bolder p-1 pl-2">
          Nearest Neighbors from the Training Set
        </div>
        <div class="card-body font-weight-normal">
          <opera-tiles :neighbors="operaData" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters,
} from 'vuex'
import OperaTiles from '~/components/calculationDetails/OperaTiles.vue'

export default {
  name: 'OperaNeighbors',
  components: {
    OperaTiles,
  },
  props: {
    operaData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
    }
  },
  computed: {
    ...mapGetters({
      getActive: 'results/getActive',
      getUiReady: 'results/getUiReady',
    }),
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
  
</style>
