<template>
  <div>
    <div v-if="reagents.length > 0">
      <div class="buttons">
        <copy-text id="reagents" :tip-text="'Copy reagents'" :copy-data="reagents" :copy-type="'assayDetails'" />
      </div>
      <assay-detail-table :records="reagents" :key-name="'reagentValue'" />
    </div>
    <div v-else class="h3">
      No reagents for this assay.
    </div>
  </div>
</template>

<script>
import AssayDetailTable from '~/components/assays/AssayDetailTable.vue'

export default {
  name: 'AssayReagents',
  components: {
    AssayDetailTable,
  },
  props: {
    reagents: {
      default: () => [],
      type: Array,
    },
  },
}
</script>
