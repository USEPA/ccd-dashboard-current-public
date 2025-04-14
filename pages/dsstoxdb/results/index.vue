<template>
  <div />
</template>

<script>

export default {
  name: 'MultipleResultsRedirect',
  data() {
    return {
      id: '',
    }
  },
  created() {
    // console.log(this.$route)
    // console.log(Object.values(this.$route.query))
    // console.log(Object.keys(this.$route.query))
    // console.log(this.createRedirectUrl())

    this.$router.push({path: this.createRedirectUrl()})
  },
  methods: {
    createRedirectUrl() {
      const routeObj = this.$route
      const qsVals = Object.values(this.$route.query) || []
      const qsKeys = Object.keys(this.$route.query) || []
      const fullQS = this.$route.fullPath.split('?')[1] || false
      if (qsVals.length === 1 && qsKeys[0] === 'search' && qsVals[0].includes('DTXSID')) {
        // console.log('in if: ', qsKeys[0], qsVals[0])
        return `/chemical/details/${qsVals[0]}`
        // eslint-disable-next-line no-else-return
      } else if (qsVals.length === 1 && qsKeys[0] === 'search') {
        return `/search-results?input_type=synonym_substring&inputs=${qsVals[0]}`
      }
      return '/'
    },

  },
}
</script>
