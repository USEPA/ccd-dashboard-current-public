/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import assayListEndpointJSON from '~/assets/fixtures/assayListEndpoint.json'
import assayEndpointChemicalsJSON from '~/assets/fixtures/assayEndpointChemicals.json'

export default class FakeAssayRepository {
  constructor(assayTranslator) {
    this.assayTranslator = assayTranslator
  }

  async endpointLists(params) {
    console.log('Fake Assay Lists repo: ', params)

    return Promise.resolve(assayListEndpointJSON)
  }

  listDetails(params) {
    console.log('Fake Assay Details repo: ', params)

    return Promise.resolve(this.assayTranslator.translate(assayEndpointChemicalsJSON.chemicals))
  }
}
