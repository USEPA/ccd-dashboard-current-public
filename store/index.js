/* eslint-disable no-unused-vars */

export const state = () => ({
  counter: 0,
});
export const strict = false;
export const actions = {
  async nuxtServerInit({dispatch, commit}, vuexContext, context) {
    // console.log('vuex context in nuxt serverInit: ', this)
    await dispatch('aops/fetchAops', vuexContext, context);
    if (vuexContext.route.path.split('/')[1] === 'chemical-lists' || vuexContext.route.query.list) {
      await dispatch('chemicalLists/asyncChemicalLists', vuexContext, context);
    }
    if (vuexContext.route.path.split('/')[1] === 'chemical' && vuexContext.params.id) {
    //   await dispatch('results/asyncActiveChemical', vuexContext, context)
    }
  },
};
