/* eslint-disable max-classes-per-file */
class AxiosHtppRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  async hasFeaturePlot(dtxsid) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTPP_PLOT_FEATURE_CHECK_API}`, {
      params: {
        dtxsid,
      },
    })
    return results
  }

  async hasCategoryPlot(dtxsid) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTPP_PLOT_CATEGORY_CHECK_API}`, {
      params: {
        dtxsid,
      },
    })
    return results
  }

  async summary(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTPP_SUMMARY_API}`, {
      params: {
        id,
      },
    })
    return results
  }

  async detailsAnnotations(endpoint) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTPP_DETAILS_ANNOTATIONS_API}`, {
      params: {
        endpoint,
      },
    })
    return results._embedded.HtppAnnotations[0]
  }

  async detailsDataset(dataset) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTPP_DETAILS_DATASET_API}`, {
      params: {
        dataset,
      },
    })
    return results._embedded.HtppDataset[0]
  }

  async detailsCitations(dataset) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.HTPP_DETAILS_CITATIONS_API}`, {
      params: {
        dataset,
      },
    }) 
    return results._embedded.Citations[0]?.citations
  }
}

export default class HtppRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosHtppRepository(this.axios, this.settings)
  }
}
