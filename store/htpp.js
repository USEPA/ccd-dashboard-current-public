import httr from '~/assets/fixtures/httr.json';

export const actions = {
  fetchHtpp(vuexContext, context) {
    const response = httr;
    // console.log(response)
    const arr = response;
    vuexContext.commit('setHttr', arr);
    return response;
  },
  async asyncHtpp(vuexContext, context) {
    let errorObj = {};
    try {
      const result = await context.app.$repositories.htpp.summary(context.params.id);
      vuexContext.commit('setHtpp', result._embedded.Htpp);
      return result._embedded.Htpp;
    } catch (e) {
      console.error('htpp-summary-error: ', e);
      errorObj = e;
      vuexContext.dispatch('fetchHtpp');
    }
  },
  async hasCategoryPlot(vuexContext, context) {
    const id = vuexContext.rootState.results.activeChemical.dtxsid;
    let errorObj = {};
    try {
      const result = await context.app.$repositories.htpp.hasCategoryPlot(id);
      vuexContext.commit('setHasCategoryPlot', result);
      return result;
    } catch (e) {
      console.error('htpp-hasCategoryPlot:', e);
      errorObj = e;
    }
  },
  async hasFeaturePlot(vuexContext, context) {
    const id = vuexContext.rootState.results.activeChemical.dtxsid;
    let errorObj = {};
    try {
      const result = await context.app.$repositories.htpp.hasFeaturePlot(id);
      vuexContext.commit('setHasFeaturePlot', result);
      return result;
    } catch (e) {
      console.error('htpp-hasFeaturePlot: ', e);
      errorObj = e;
    }
  },
};

export const mutations = {
  setHtpp(state, htppItems) {
    state.htppItems = htppItems;
  },
  setHasCategoryPlot(state, hasCategoryPlot) {
    state.hasCategoryPlot = hasCategoryPlot;
  },
  setHasFeaturePlot(state, hasFeaturePlot) {
    state.hasFeaturePlot = hasFeaturePlot;
  },
};

export const getters = () => ({
  getHtpp(state) {
    return [...state.htppItems];
  },
  getHasCategoryPlot(state) {
    return state.hasCategoryPlot;
  },
  setHasFeaturePlot(state) {
    return state.hasCategoryPlot;
  },
});

export const state = () => ({
  htppItems: [],
  hasCategoryPlot: 0,
  hasFeaturePlot: 0,
});
