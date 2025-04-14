/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable require-await */
export const actions = {
  async setEnvironmentVars(vuexContext, context) {
    let errorObj = {}
    try {
      const environmentObj = {
        applicationTitle: context.env.APPLICATION_TITLE,
        applicationEnvironment: context.env.APPLICATION_ENVIRONMENT_LABEL,
      }
      vuexContext.commit('setEnv', environmentObj)
    } catch (e) {
      errorObj = e
      // eslint-disable-next-line no-console
      console.log('error in environment: ', errorObj)
    }
  },
}

export const mutations = {
  setEnv(state, env) {
    state.environmentVars = env
  },
}

export const getters = {
  getEnvironment(state) {
    return state.environmentVars
  },
}
export const state = () => ({
  environmentVars: {
    applicationTitle: '',
    applicationEnvironment: '',
  },
})
