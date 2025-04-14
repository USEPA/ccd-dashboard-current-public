export default {
  getFilterOptions: state => () => state.filterOptions,
  getGridDefs: state => () => state.gridDefs,
  getExportColDefs: state => () => state.exportColDefs,
  getFilterModel: state => () => state.filterModel,
  getChemicalsSelectedBy: state => () => state.chemicalsSelectedBy,
}
