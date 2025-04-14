<template>
  <div>
    {{ display }}
  </div>
</template>

<script>

export default {
  name: 'MultiConcRenderer',
  computed: {
    display() {
      const multiCount = this.params.data.multi_conc_assay_chemical_count
      if (multiCount !== null) {
        const mcPercent = ((multiCount.active / multiCount.total) * 100).toFixed(2)
        if (multiCount.active != null && multiCount.total != null) {
          return `${multiCount.active}/${multiCount.total} (${mcPercent}%)`
        }
      }
      return '-'
    },
  },
}
</script>
