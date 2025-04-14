<template>
  <div>
    <a
      v-if="params.data.hasOpera === true"
      title="Opera Calculation Details Report"
      @click="navigateOpera"
    >
      {{ calculationDetailsDisplay }}
    </a>
    <a
      v-if="!params.data.hasOpera && calculationDetailsLink"
      target="_blank"
      :href="calculationDetailsLink.url"
      :title="calculationDetailsLink.url"
    >
      {{ calculationDetailsLink.display }}
    </a>
    <span v-else-if="!params.data.hasOpera && !calculationDetailsLink">
      {{ calculationDetailsDisplay }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'CalculationDetailsRenderer',
  components: {
  },
  computed: {
    calculationDetailsLink() {
      const link = {}
      if (this.params.page === 'properties') {
        if (this.params.data.details.showLink) {
          link.display = 'Available'
          link.url = `${this.params.data.details.link}`
          return link
        }
      } else if (this.params.data && this.params.data.testReportExtension) {
        link.display = 'Available'
        link.url = `${this.params.data.testReportExtension}`
        return link
      }
      return false
    },
    calculationDetailsDisplay() {
      const display = 'Not Available'
      if (this.params.page === 'properties') {
        if (this.params.data.hasOpera === true) {
          return this.operaUrl(this.params).display
        }
        if (this.params.data.details.showLink) {
          return `${this.params.data.details.value}`
        }
      }
      if (this.params.page === 'fate') {
        if (this.params.data.hasOpera === true) {
          return this.operaUrl(this.params).display
        }
      }
      return display
    },
  },
  methods: {
    operaUrl(params) {
      const link = {}
      const globalApplicability = (params.data.globalApplicability === 1) ? '[Inside AD]' : '[Outside AD]'
      if (params.page === 'properties') {
        const baseLink = (!params.data.link) ? this.params.data.details.link : params.data.link
        const qstring = baseLink.split('?')[1]
        link.url = `/${process.env.APPLICATION_ROUTER_BASE}calculation-details?${qstring}`
        link.display = `OPERA Calculation Report ${globalApplicability}`
      } else {
        // eslint-disable-next-line no-lonely-if
        if (params.page === 'fate') {
          if (params.data.hasOpera === true) {
            const qstring = `model_id=${params.data.modelId}&search=${params.data.gsid}`
            link.url = `${process.env.APPLICATION_ROUTER_BASE}calculation-details?${qstring}`
            link.display = `OPERA Calculation Report ${globalApplicability}`
          }
        }
      }
      return link
    },
    navigateOpera() {
      if (this.params.page === 'properties') {
        const baseLink = (!this.params.data.link) ? this.params.data.details.link : this.params.data.link
        const qstring = baseLink.split('?')[1]
        const items = qstring.split('&')
        const modelId = items[0].split('=')[1]
        const search = items[1].split('=')[1]
        const routeData = this.$router.resolve({name: 'calculation-details', query: {model_id: modelId, search: search}})
        window.open(routeData.href, '_blank')
      } else {
        const {modelId, gsid} = this.params.data
        const routeData = this.$router.resolve({name: 'calculation-details', query: {model_id: modelId, search: gsid}})
        window.open(routeData.href, '_blank')
      }  
    },
  },

}
</script>
