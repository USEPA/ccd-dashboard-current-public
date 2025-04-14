<template>
  <div class="m-1">
    <div class="related-cell message-body" v-html="display" />
  </div>
</template>

<script>
export default {
  name: 'MdbCardTextRenderer',
  computed: {
    display() {
      const data = this.params.value
      return data
    },
  },
}
</script>

<style lang="scss" scoped>
  .message-body {
    height: auto;
    word-wrap: normal !important;
    font-size: .75rem;
    word-break: normal !important;
    font-weight: normal;
    white-space: normal !important;
    padding: 1em;
    line-height: 130% !important;
  }
</style>
