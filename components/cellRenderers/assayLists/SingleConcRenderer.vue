<template>
  <div>
    {{ display }}
    <button v-if="singleTotal !== null" type="button" class="btn btn-outline btn-grid-inline" @click="clickSingleConc">
      <i class="fas fa-file-alt" />
    </button>
  </div>
</template>

<script>

export default {
  name: 'SingleConcRenderer',
  computed: {
    singleTotal() {
      return this.params.data.single_conc_assay_chemical_count.singleTotal
    },
    display() {
      const singleCount = this.params.data.single_conc_assay_chemical_count

      if (singleCount.singleActive !== null) {
        const scPercent = ((singleCount.singleActive / singleCount.singleTotal) * 100).toFixed(2)

        return `${singleCount.singleActive} / ${singleCount.singleTotal} (${scPercent}%)`
      }
      return '-'
    },
  },
  methods: {
    clickSingleConc() {
      this.params.context.componentParent.singleConcClick(this.params.data)
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-grid-inline{
    padding:4px 8px;
  }
</style>
