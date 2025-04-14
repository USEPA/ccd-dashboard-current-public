/* eslint-disable no-unused-vars */
import adme from '~/assets/fixtures/adme.json'

export default {
  fetchChemicalAdme(vuexContext) {
    const response = adme
    vuexContext.commit('setAdmeData', response)
  },
}
