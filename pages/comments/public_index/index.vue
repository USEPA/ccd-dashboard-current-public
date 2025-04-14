<template>
  <div />
</template>

<script>

export default {
  name: 'CommentsPIRedirect',
  data() {
    return {
      id: '',
    }
  },
  created() {
    this.$router.push({path: this.createRedirectUrl()})
  },
  methods: {
    createRedirectUrl() {
      const routeObj = this.$route
      const fullQS = this.$route.fullPath.split('?')[1] || false
      if (fullQS) {
        return `/comments?${fullQS}`
      }
      return '/comments'
    },
  },
}
</script>
