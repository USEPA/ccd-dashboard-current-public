<template>
  <mdb-container />
</template>

<script>

export default {
  name: 'AssayListRedirect',
  data() {
    return {
      id: '',
    }
  },
  created() {
    this.$router.push({path: this.createRedirectUrl()})
  },
  methods: {
    createRedirectUrl()  {
      const routeObj = this.$route
      const fullQS = this.$route.fullPath.split('?')[1] || false
      if (fullQS) {
        return `/assay-endpoints?${fullQS}`
      }
      return '/assay-endpoints'
    },
  },
} 
</script>
