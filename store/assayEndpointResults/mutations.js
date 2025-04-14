/* eslint-disable no-param-reassign */
export default {
  setFilterModel(state, filters) {
    const newFilterModel = []
    if (Array.isArray(filters)) {
      for (let h = 0; h < filters.length; h += 1) {
        newFilterModel.push(filters[h])
      }
    }
    state.filterModel = newFilterModel
  },
  setChemicalsSelectedBy(state, chemicalsSelectedBy) {
    const newSelectedChemicalsBy = {...chemicalsSelectedBy}
    state.chemicalsSelectedBy = newSelectedChemicalsBy
  },

}
