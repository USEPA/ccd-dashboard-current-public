<template>
  <div class="d-flex justify-content-center mt-5 loading-spinner">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex'

export default {
  name: 'ChemicalPage',
  // eslint-disable-next-line consistent-return
  async validate(data) {
    if (data.params.id) {
      const chemList = await data.store.dispatch('chemicalLists/asyncChemicalLists', data, data)
      if (Array.isArray(chemList)) {
        return true
      }
      return false
    }
    if (data.params.id.toUpperCase().includes('DTXSID') || data.params.id.toUpperCase().includes('DTXCID')) {
      return true
    }
  },
  computed: {
    ...mapGetters({
      getChemicalLists: 'chemicalLists/getChemicalLists',
      getFiltered: 'chemicalLists/getFiltered',
    }),
    chemListComputed() {
      const chem = this.getFiltered(this.$route.params.id)
      // console.log('chemcomputed:', chem)
      return chem[0]
    },
  },
  created() {
    if (this.$route.params.id.toUpperCase().includes('DTXSID') || this.$route.params.id.toUpperCase().includes('DTXCID')) {
      this.$router.push({path: `/chemical/details/${this.$route.params.id.toUpperCase()}`})
      return true
    }
    if (this.chemListComputed) {
      this.$router.push({path: `/chemical-lists/${this.$route.params.id}`})
      return true
    }
    return this.$nuxt.error({statusCode: 404, message: 'Page Not Found'})
  },
}
</script>
