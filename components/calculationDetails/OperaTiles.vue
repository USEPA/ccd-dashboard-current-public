<template>
  <div>
    <div class="operaTiles">
      <OperaTile
        v-for="(chemical, idx) in neighbors"
        :key="idx"
        :chemical="chemical"
      />
    </div>
  </div>
</template>

<script>
import OperaTile from '~/components/calculationDetails/OperaTile.vue'

export default {
  name: 'OperaTiles',
  components: {
    OperaTile,
  },
  props: {
    neighbors: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      imageUrl: '',
      modalTitle: 'Chemical Name',
    }
  },
  created() {

  },
  methods: {
    randKey(gsid) {
      return gsid + Math.random().toString(36).substring(7)
    },

    onSelectTile(params) {
      this.$emit('selectTile', params)
    },
  },
}
</script>

<style scoped lang="scss">
@media screen {
  .operaTiles {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: flex-start;
    margin: auto;
    margin-top:30px;
    max-width: calc(6 * 275px);
  }

  .results {
    margin: 1em auto;
  }

  .hiddenTile{
    display: none
  }
  .noResults {
    margin: 10px;
    display: block;
    font-size: 20px;
    width: 100%;
    text-align: center;
  }

  #imageModalTitle a.close{
    color:red!important;
  }
}
@media print {
  operaTiles {
    display: flex;
    flex-flow: row wrap;
    justify-content: left;
    margin: auto;
    margin-top:30px;
    max-width: calc(6 * 275px);
  }
} 
</style>
