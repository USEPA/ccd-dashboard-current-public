<template>
  <div data-cy="ketcher">
    <iframe ref="ketcher" src="/dashboard/ketcher-2-3/index.html" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: 'Ketcher',
  mounted() {
    const ketcherIntervalId = setInterval(() => {
      const ketcher = this.$refs.ketcher.contentWindow.ketcher
      if (ketcher) {
        clearInterval(ketcherIntervalId)
        this.$store.dispatch('predictions/setKetcher', ketcher)
      }
    }, 1000)
  },
}
</script>
<style scoped lang="scss">
iframe {
  width: 100%;
  min-width: 800px !important;
  height: 580px;
  border: 0;
}
</style>
