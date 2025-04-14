/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import aops from '~/assets/fixtures/aops.json'

export const actions = {
  fetchAops(vuexContext) {
    const response = aops
    const arr = response
    // console.log('fetchAops: ', response)
    vuexContext.commit('setAops', arr)
  },
  async asyncAops(vuexContext, context) {
    let errorObj = {}
    try {
      const result = await context.app.$repositories.aops.index()
      // console.log('aops: ', result)
      vuexContext.commit('setAops', result.data)
    } catch (e) {
      console.log('aops-error: ', e)
      if (e.response) {
        errorObj = {
          error: e.response,
        }
      } else {
        errorObj = e
      }
      console.log('aops-error: ', errorObj)
      // eslint-disable-next-line no-console
      // console.log('error in downloads: ', errorObj)
      vuexContext.dispatch('fetchAops')
    }
  },
}

export const mutations = {
  setAops(state, aopsArr) {
    state.aops = aopsArr
  },
}

export const getters = {
  getAops(state) {
    return state.aops
  },

  getFiltered: state => (input) => {
    const aopsArr = [...state.aops]
    if (input !== '') {
      return aopsArr.filter(aop => aop.aop_id === input)
    }
    return null
  },
}

export const state = () => ({
  aops: [],
})
