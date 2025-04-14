import httr from '~/assets/fixtures/httr.json'

export const actions = {
  fetchHttr(vuexContext, context) {
    const response = httr
    // console.log(response)
    const arr = response
    vuexContext.commit('setHttr', arr)
    return response
  },
  async asyncHttr(vuexContext, context) {
    let errorObj = {}
    try {
      const result = await context.app.$repositories.httr.summary(context.params.id)
      vuexContext.commit('setHttr', result._embedded.Httr)
      return result._embedded.Httr
    } catch (e) {
      console.log('httr-error: ', e)
      errorObj = e
      vuexContext.dispatch('fetchHttr')
    }
  },
  async isPlot(vuexContext, context) {
    const id = vuexContext.rootState.results.activeChemical.dtxsid
    let errorObj = {}
    try {
      const result = await context.app.$repositories.httr.isPlot(id)
      vuexContext.commit('setIsPlot', result)
      return result
    } catch (e) {
      console.log('httr-error: ', e)
      errorObj = e
      vuexContext.dispatch('fetchHttr')
    }
  },
}

export const mutations = {
  setHttr(state, httrItems) {
    state.httrItems = httrItems
  },
  setIsPlot(state, isPlot) {
    state.isPlot = isPlot
  },
  setCitations(state, citations) {
    state.citations = citations
  },
  setAnnotations(state, annotations) {
    state.annotations = annotations
  },
  setDataset(state, dataset) {
    console.log('in setter:', dataset)
    state.dataset = dataset
  },
}

export const getters = () => ({
  getHttr(state) {
    // Return sorted by date desc news items by default.
    const computed = [...state.httrItems]
    return [...state.httrItems]
  },
  getIsPlot(state) {
    // Return sorted by date desc news items by default.
    return state.isPlot
  },
  getCitations(state) {
    return state.citations
  },
  getAnnotations(state) {
    return state.annotations
  },
  getDataset(state) {
    return state.dataset
  },
})

export const state = () => ({
  httrItems: [],
  citations: [],
  annotations: null,
  dataset: null,
  isPlot: 0,
})
