export default {
  async asyncToxcastModels(vuexContext, context) {
    let errorObj = {}
    try {
      const result = await context.app.$repositories.bioactivity.models(context.params.id)
      vuexContext.commit('setToxcastModels', result)
    } catch (e) {
      console.error({e})
      if (e.response) {
        errorObj = {
          status: e.response,
        }
      } else {
        console.log('e', e)
        errorObj = e
      }
    }
  },
}

