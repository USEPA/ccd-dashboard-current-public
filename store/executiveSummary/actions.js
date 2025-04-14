export default {
  async asyncPhysChem(vuexContext, context) {
    let errorObj = {};
    try {
      const result = await context.app.$repositories.physChem.find(context.params.id);
      vuexContext.commit('setPhysChemData', result.data);
    } catch (e) {
      console.error({e});
      if (e.response) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },
  async asyncExecSumLinks(vuexContext, context) {
    let errorObj = {};
    try {
      const result = await context.app.$repositories.execSumLinks.find(context.params.id);
      vuexContext.commit('setExecSumLinksData', result.data);
    } catch (e) {
      console.error({e});
      if (e.response) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },
  async asyncOralPod(vuexContext, context) {
    let errorObj = {};
    try {
      const response = await context.app.$repositories.oralPod.find(context.params.id);
      vuexContext.commit('setOralPodData', response._embedded.ExecutiveSummaryPod);
    } catch (e) {
      if (e.response) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },
  async asyncRegionalScreening(vuexContext, context) {
    let errorObj = {};
    try {
      const result = await context.app.$repositories.regionalScreening.find(context.params.id);
      vuexContext.commit('setRegionalScreening', result.data);
    } catch (e) {
      console.error({e});
      if (e.response) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },
  actToxcastVisibility(vuexContext, val) {
    vuexContext.commit('setToxcastVisibility', val);
  },
};

