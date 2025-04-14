/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

export const actions = {
  loadSearchedOn({commit}, searchStr) { 
    commit('setSearchStr', searchStr)
  },
}

export const mutations = {
  setSearchStr(state, searchStr) {
    state.chemicalSearchedOnStr = searchStr
  },
}

export const getters = {
  getChemicalSearchedOn(state) {
    return state.chemicalSearchedOnStr
  },
}

export const state = () => ({
  chemicalSearchedOnStr: '',
})
