export default {
  getAssayEndpoints(state) {
    return state.assayEndpointItems
  },
  getAssayVenders(state) {
    return state.assayVenders
  },
  getAssayById: state => (id) => {
    let assays = [...state.assayEndpointItems]
    // Filter and sort results by user input and click.
    if (id !== '') {
      assays = assays.filter(as => as.name === id)
    }
    return assays
  },
  getColumnDefs(state) {
    return state.columnDefs
  },
  getExportColDefs: state => () => state.exportColDefs,
}
