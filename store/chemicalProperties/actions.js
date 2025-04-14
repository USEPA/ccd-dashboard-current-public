/* eslint-disable no-unused-vars */
export default {
  async asyncChemicalProperties(vuexContext, context) {
    let errorObj = {};
    try {
      const response = await context.app.$repositories.chemicalProperties.find(context.params.id);
      vuexContext.commit('setPropertiesData', response.data);
    } catch (e) {
      console.error('ERROR', e);
      if (e.response) {
        errorObj = {
          e: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },
};
