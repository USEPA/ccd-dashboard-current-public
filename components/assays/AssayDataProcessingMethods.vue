<template>
  <div>
    <div class="buttons">
      <copy-text id="processings" :tip-text="'Copy processings'" :copy-data="processings" :copy-type="'assayDetails'" />
    </div>
    <assay-detail-table :records="processings" :key-name="'methodName'" />
  </div>
</template>

<script>
import AssayDetailTable from '~/components/assays/AssayDetailTable.vue'

export default {
  name: 'AssayDataProcessingMethods',
  components: {
    AssayDetailTable,
  },
  props: {
    processings: {
      default: () => [],
      type: Array,
    },
  },
}
</script>
