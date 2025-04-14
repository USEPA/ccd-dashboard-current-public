import initialState from './state'

export default {

  SET_HAZARD_STATUS(state, payload) {
    state.status = payload
  },

  SET_HAZARD_REPORT(state, payload) {
    state.reportData = payload
  },

  SET_HAZARD_PROFILE(state, payload) {
    state.profile = payload
  },

  SET_SORT_BY(state, payload) {
    state.sortBy = payload
  },

  SET_ADDED_FILTERS(state, payload) {
    state.addedFilters = payload
  },
}
