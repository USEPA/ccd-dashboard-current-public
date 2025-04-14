export default {
  getFoundStructures(state) {
    return state.searchResult
  },
  getSelectedStructures(state) {
    return state.searchResult.filter(item => item.checked === true)
  },
  getSearchStatus(state) {
    return state.status
  },
}
