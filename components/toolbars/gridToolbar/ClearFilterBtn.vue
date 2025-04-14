<template>
  <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
    <span slot="tip">Reset chemical list</span>
    <mdb-btn
      slot="reference"
      type="button"
      class="blue lighten-1 text-white m-0 mr-1"
      size="sm"
      :disabled="getFilteredChemicals().length < 1"
      @click="resetChemicals()"
    >
      reset chemical list
    </mdb-btn>
  </mdb-tooltip>
</template>
<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex';
import {
  mdbBtn, mdbTooltip,
} from 'mdbvue';

export default {
  name: 'ClearFilters',
  components: {
    mdbBtn,
    mdbTooltip,
  },

  props: {

  },
  data() {
    return {
      infoItems: [],

    };
  },
  computed: {
    ...mapGetters('results', ['getFilterOptions', 'getFilterModel', 'getFilteredChemicals']),
    ...mapState('results', ['filterModel', 'filterOptions']),
  },
  methods: {
    ...mapMutations({setFilterModel: 'results/setFilterModel'}),
    resetChemicals() {
      this.$nuxt.$emit('resetChemicaLlist');
    },
  },
};
</script>

<style lang="scss" scoped>
.picker-info {
  font-size:10px
}
</style>
