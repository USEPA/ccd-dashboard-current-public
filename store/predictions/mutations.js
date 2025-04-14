export default {
  setProviders(state, providers) {
    state.providers = providers
  },
  fatalError(state, error) {
    state.error.status = true
    state.error.message = error
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setKetcher(state, ketcher) {
    state.ketcher = ketcher
  },
  setStructure(state, structure) {
    state.structError.status = false
    state.ketcher.setMolecule(structure.data)
  },
  structureError(state, errorMsg) {
    state.structError = errorMsg
  },
  calculateError(state, error) {
    state.predicting = false
    state.calcError.status = true
    state.calcError.message = error
  },
  loadPredictions(state) {
    state.calcError.status = false
    state.predicting = true
  },
  setPredictions(state, predictions) {
    state.pred = false
    state.predicting = false
    setTimeout(() => {
      state.pred = predictions
    }, 1500)
  },
  setProperties(state, filters) {
    state.properties.push(filters)
  },
  addFilter(state, val) {
    state.filtered.push(val)
  },
  removeFilter(state, val) {
    const newFilters = state.filtered.filter(id => id !== val)
    state.filtered = newFilters
  },
}
