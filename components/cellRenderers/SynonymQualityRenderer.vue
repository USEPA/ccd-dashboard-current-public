<template>
  <div class="text-capitalize" style="padding-right:5px">
    <span v-if="quality === 'Valid' " class="font-weight-bold"> {{ display }}</span>
    <span v-else-if="quality === 'Good'" class="font-italic">{{ display }}</span>
    <span v-else class="font-weight-normal">{{ display }}</span>
  </div>
</template>

<script>

export default {
  name: 'SynonymQualityRenderer',
  computed: {
    display() {
      const data = this.params.value
      return data
    },
    quality() {
      const qual = this.params.data.quality
      return qual
    },
  },
}
</script>
