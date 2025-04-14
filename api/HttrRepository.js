/* eslint-disable max-classes-per-file */
class AxiosHttrRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  async isPlot(dtxsid) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTTR_PLOT_CHECK_API}`, {
      params: {
        dtxsid,
      },
    })
    return results
  }

  async summary(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTTR_SUMMARY_API}`, {
      params: {
        id,
      },
    })
    return results
  }


  async detailsAnnotations(signature) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTTR_DETAILS_ANNOTATIONS_API}`, {
      params: {
        signature,
      },
    })
    return results._embedded.HttrAnnotations[0]
  }

  async detailsDataset(dataset) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTTR_DETAILS_DATASET_API}`, {
      params: {
        dataset,
      },
    })
    return results._embedded.HttrDataset[0]
  }

  async detailsCitations(dataset) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTTR_DETAILS_CITATIONS_API}`, {
      params: {
        dataset,
      },
    })
    return results._embedded.Citations[0]?.citations
  }
}

export default class HttrRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosHttrRepository(this.axios, this.settings)
  }
}
