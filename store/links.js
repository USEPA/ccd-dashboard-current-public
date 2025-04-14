/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */


export const actions = {
  loadLinks({commit}, obj) {
    const response = obj
    commit('setLinks', response)
  },
}

export const mutations = {
  setLinks(state, linksObject) {
    state.Links = linksObject
  },
}
export const getters = {
  getLinks(state) {
    return state.Links
  },
  getActiveItem: state => input => state.Links[input]
  ,
}

export const state = () => ({
  Links: [],
})
