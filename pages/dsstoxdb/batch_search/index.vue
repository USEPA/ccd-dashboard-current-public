<template>
  <div />
</template>

<script>

export default {
  name: 'DsstoxdbBatchsearchRedirect',
  data() {
    return {
      id: '',
    }
  },
  created() {
    // console.log(this.$route)
  // console.log(this.createRedirectUrl())

    this.$router.push({path: this.createRedirectUrl()})
  },
  methods: {
    createRedirectUrl()  {
      const routeObj = this.$route
      const fullQS = this.$route.fullPath.split('?')[1] || false
      if (fullQS) {
        return `/batch-search?${fullQS}`
      }
      return '/batch-search'
    },
  },
}
</script>
