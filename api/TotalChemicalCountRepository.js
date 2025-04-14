/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */

class AxiosTotalChemicalCount {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  count() {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.TOTAL_CHEMICAL_COUNT}`)
  }

  getVersion() {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.COMPTOX_VERSION_API}`)
  }
}

export default class TotalChemicalCountRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosTotalChemicalCount(this.axios, this.settings)
  }
}
