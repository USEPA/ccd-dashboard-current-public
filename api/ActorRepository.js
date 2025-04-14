/* eslint-disable max-classes-per-file */
/* eslint-disable import/extensions */
import AssayTranslator from '~/api/translators/AssayTranslator'

class AxiosActorRepository {
  constructor(axios, settings, assayTranslator) {
    this.axios = axios
    this.settings = settings
    this.assayTranslator = assayTranslator
  }

  async categoriesList() {
    try {
      const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_CATEGORY}`)
      return result._embedded.AssayCategories
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async categoriesSearch(id) {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_CATEGORY_SEARCH}?dtxsid=${id}`)
    // console.log(result._embedded.AssayCategories)
    return result._embedded.AssayCategories
  }

  assayList() {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY}`)
  }

  async assaySearch(params) {
    // console.log('params: ', params)
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_SEARCH}?dtxsid=${params.dtxsid}&categoryId=${params.categoryId}`)
    return result
  }

  assayComponentList() {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_COMPONENT}`)
  }

  async assayComponentSearch(params) {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_COMPONENTS_SEARCH}?${params}`)
    return result._embedded.AssayComponents
  }

  async assayDataList() {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_DATA}`)
    return result._embedded.AssayData
  }

  async assayDataSearch(params) {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_DATA_SEARCH}?dtxsid=${params.dtxsid}&categoryId=${params.categoryId}&assayId=${params.assayId}`)
    return result._embedded.AssayData
  }

  async assayDataColumnList() {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_DATA_COLUMN}`)
    return result._embedded.AssayDataColumns
  }

  async assayDataColumnSearch(params) {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_DATA_COLUMN_SEARCH}?dtxsid=${params.dtxsid}&categoryId=${params.categoryId}&assayId=${params.assayId}`)
    return result._embedded.AssayDataColumns
  }

  assayDetailsList() {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_DETAILS}`)
  }

  async assayDetailsSearch(params) {
    const result = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ACTOR_ASSAY_DETAILS_SEARCH}?${params}`)
    return result
  }



  endpointDetailSearchByName(endpointName) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_ENDPOINT_DETAIL_SEARCH}`, {
      params: {
        name: endpointName,
      },
    })
  }

  actorGeneSearch(params) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_GENE_SEARCH_API}${params}`)
  }

  async assaySingleConcSearch(params) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_LIST_DETAILS_SINGLE_CONC_API}${params}`)
    return {data: response._embedded.assayListSingleConc, paging: response.page}
  }


  async listDetails(params) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_LIST_DETAILS_API}${params}`)
    const translatedData = this.assayTranslator.translate(response._embedded.assayListDetails)
    const responseChunk = {
      data: translatedData,
      paging: response.page,
    }
    return responseChunk
  }
}

export default class ActorRepository {
  constructor(axios, settings) {
    this.axios = axios
    this.settings = settings
  }

  build() {
    return new AxiosActorRepository(this.axios, this.settings, new AssayTranslator())
  }
}
