export default {
  getChemicalLists: state => () => state.chemicalLists,
  getGridDefs: state => () => state.gridDefs,
  getExportColDefs: state => () => state.exportColDefs,
  getFiltered: state => (id) => {
    let computed = [...state.chemicalLists];
    // Filter and sort results by user input and click.
    if (id !== '') {
      computed = computed.filter(cl => cl.listName.toUpperCase() === id.toUpperCase());
    }
    return computed;
  },
  getPresenceInListsStaticData: state => () => state.presenceInListsStaticData,
};
