/* eslint-disable max-classes-per-file */

class AxiosExposureRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  async monitoringSearchByDtxsid(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_MONITORING_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response.data
  }

  async predictionSearchByDtxsid(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_PREDICTION_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response.data
  }

  async demographicPredictionSearchByDtxsid(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_DEMOGRAPHIC_PREDICTION_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response._embedded.DemographicExposurePrediction[0].demographicExposurePred
  }

  async predictionGenericByDtxsid(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_GENERIC_PREDICTION_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response.generalExposurePred
  }


  async productionVolumeSearchByDtxsid(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_PRODUCTION_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response.data
  }

  async productUseCategoryKeywords(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_PUC_KEYWORD_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response.data
  }

  async productUseCategories(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_PUC_SEARCH_API}`, {
      params: {
        id,
      },
    })

    return response.data
  }

  async chemicalWeightFractions(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_CHEMICAL_WEIGHT_FRACTIONS_API}`, {
      params: {
        id,
      },
    })
    return response.data
  }


  async chemicalFunctionalUse(id) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.EXPOSURE_CFU_SEARCH_API}`, {
      params: {
        id,
      },
    })
    return response
  }
}

export default class ExposureRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosExposureRepository(this.axios, this.settings)
  }
}
