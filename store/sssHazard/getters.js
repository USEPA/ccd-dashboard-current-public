export default {
  getHazardStatus(state) {
    return state.status
  },
  getHazardReport(state) {
    return state.reportData
  },
  getHazardProfile(state) {
    return state.profile
  },
  getSortBy(state) {
    return state.sortBy
  },
  getAddedFilters(state) {
    return state.addedFilters
  },
}
