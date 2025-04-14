import {da, fi} from 'date-fns/locale'

export default {
  async getCategories(vuexContext, context) {
    const response = await context.app.$repositories.actor.categoriesSearch(context.params.id)
    // console.log('response: ', response)
    if (response.length > 0) {
      vuexContext.commit('setActorCategories', response)
      vuexContext.commit('setCategorySelection', response[0].categoryId)
    }
    return response
  },
  async assaySearch(vuexContext, params) {
    let errorObj = {}
    try {
      const response = await this.$repositories.actor.assaySearch(params)

      vuexContext.commit('setActorAssays', response._embedded.Assays)
      return response._embedded.Assays
    } catch (e) {
      console.error('ERROR in assaySearch', e)
      if (e.response) {
        errorObj = {
          e: e.response,
        }
      } else {
        errorObj = e
      }
      return errorObj
    }
  },
  async assayComponentSearch(vuexContext, params) {
    let errorObj = {}
    const response = await this.$repositories.actor.assayComponentSearch(params)
    try {
      vuexContext.commit('setActorAssayComponents', response)
      return response
    } catch (e) {
      if (e.response) {
        errorObj = {
          e: e.response,
        }
        throw errorObj
      } else {
        errorObj = e
        throw errorObj
      }
    }
  },
  async assayDataColumnsSearch(vuexContext, params) {
    let errorObj = {}
    try {
      const response = await this.$repositories.actor.assayDataColumnSearch(params)
      if (response.length > 0) {
        const dataColumns = response
        vuexContext.commit('setActorAssayDataCols', dataColumns)
        return dataColumns
      }
      if (response.length < 1) {
        vuexContext.commit('setActorAssayDataCols', response)
      }
      return false
    } catch (e) {
      errorObj = {
        message: 'error calling assayDataColumnsSearch',
        error: e,
      }
      window.$nuxt.$notify.error({
        message: `${errorObj.message}`, position: 'top right', timeOut: 2000,
      })
    }
  },
  async assayDataSearch(vuexContext, params) {
    let errorObj = {}
    try {
      const response = await this.$repositories.actor.assayDataSearch(params)
      if (response.length > 0) {
        const assayData = response
        vuexContext.commit('setActorAssayData', assayData)
        return assayData
      }
      if (response.length < 1) {
        vuexContext.commit('setActorAssayData', response)
      }
      return false
    } catch (e) {
      console.error('ERROR in assayDataColumnsSearch', e)
      if (e.response) {
        errorObj = {
          e: e.response,
        }
      } else {
        errorObj = e
      }
      return errorObj
    }
  },
  async assayDetailsSearch(vuexContext, qs) {
    let errorObj = {}
    try {
      const response = await this.$repositories.actor.assayDetailsSearch(qs)
      const testArr = []
      testArr.push(response)
      vuexContext.commit('setActorAssayDetails', testArr)
      return testArr
    } catch (e) {
      console.error('ERROR in assayDataColumnsSearch', e)
      if (e.response) {
        errorObj = {
          e: e.response,
        }
      } else {
        errorObj = e
      }
      return errorObj
    }
  },
}
