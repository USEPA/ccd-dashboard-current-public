/* eslint-disable max-classes-per-file */
class AxiosBioactivityRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  async summary(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_SUMMARY_API}`, {
      params: {
        id,
      },
    })
    return results._embedded.Bioactivity
  }

  async data(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_DATA_API}`, {
      params: {
        id,
      },
    })
    return results._embedded.Bioactivity
  }

  async selectList(id, assay) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_DATA_API}`, {
      params: {
        id,
        assay,
      },
    })
    return results._embedded.Bioactivity
  }

  async count(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_COUNT_API}`, {
      params: {
        id,
      },
    })
    return results
  }

  async models(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_MODEL_API}`, {
      params: {
        id,
      },
    })
    return results._embedded.Bioactivity
  }

  async assays(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_ASSAYS_API}`, {
      params: {
        id,
      },
    })
    return results._embedded.Bioactivity
  }


  async assayDetails(id) {
    const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_ASSAY_DETAILS_API}`, {
      params: {
        id,
      },
    })
    return results._embedded.Bioactivity
  }

  async exportConcDetails(exportParamObj) {
    const results = await this.axios.$post(`${process.env.APPLICATION_BASE_API}${this.settings.BIOACTIVITY_EXPORT_API}`, exportParamObj)
    return results
  }
}

export default class BioactivityRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosBioactivityRepository(this.axios, this.settings)
  }
}
