<template>
  <div class="d-flex justify-content-center mt-5 loading-spinner">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DsstoxdbMultipleResultsRedirect',
  created() {
    this.$router.push({path: this.createRedirectUrl()})
  },
  methods: {
    createRedirectUrl()  {
      const routeObj = this.$route
      const fullQS = this.$route.fullPath.split('?')[1] || false
      if (fullQS) {
        return `/search-results?${fullQS}`
      }
      return '/search-results'
    },
  },
}
</script>
