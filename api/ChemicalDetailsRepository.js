/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */

class AxiosChemicalDetailsRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }


  find(id) {
    // console.log(this.settings.CHEMICAL_DETAILS_API_BY_DTXCID)
    if (id.toUpperCase().startsWith('DTXCID')) {
      return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_DETAILS_API_BY_DTXCID}?id=${id}`)
    }

    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_DETAILS_API}?id=${id}`)
  }

  findByDtxcid(id) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_DETAILS_API_BY_DTXCID}?id=${id}`)
  }
}

export default class ChemicalDetailsRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosChemicalDetailsRepository(this.axios, this.settings)
  }
}
