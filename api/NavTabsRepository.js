/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */

class AxiosNavTabsRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  find(params) {
    if (params.toUpperCase().startsWith('DTXCID')) {
      return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.TABS_API_CID}${params}`)
    }

    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.TABS_API}${params}`)
  }
}

export default class NavTabsRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosNavTabsRepository(this.axios, this.settings)
  }
}
