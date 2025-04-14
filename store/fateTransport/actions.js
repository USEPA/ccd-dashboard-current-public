export default {
  async asyncFateTransport(vuexContext, context) {
    let errorObj = {};
    const {gsid} = context.app.store.state.results.activeChemical;
    vuexContext.commit('setGsid', gsid);
    try {
      const response = await context.app.$repositories.fateTransport.find(context.params.id);
      vuexContext.commit('setFateTransport', response.fateDetails);
      // forces the async call that calls this action to wait for the newly set fateTransport state obj.
      return this.fateTransport;
    } catch (e) {
      console.error('ERROR in asyncFateTransport', e);
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
