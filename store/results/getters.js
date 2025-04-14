import {selectAll} from 'd3';

export default {
  getChemicals: state => () => state.chemicals,
  getFilteredChemicals: state => () => state.filteredChemicals,
  getOriginalChemicals: state => () => state.originalChemicals,
  getFilterOptions: state => () => state.filterOptions,
  getFilterModel: state => () => state.filterModel,
  getSortOptions: state => () => state.sortOptions,
  getTileInfoOptions: state => () => state.tileInfoOptions,
  getSortModelState: state => () => state.sortModel,
  getModalInfo: state => () => state.chemicalImageInfo,
  getSetAll: state => () => {
    let setAll = true;
    const chems = [...state.chemicals];
    const selected = chems.filter(chem => chem.selected === true);
    if (selected.length === chems.length) {
      setAll = false;
    }
    return setAll;
  },
  getSingle: state => (id) => {
    let chems = [...state.chemicals];
    if (id !== '') {
      chems = chems.filter(chem => chem.dtxsid === id);
    }
    return chems[0];
  },
  getFilteredChems: state => (ids) => {
    let computed = [...state.chemicals].map(chem => ({
      dtxsid: chem.dtxsid,
      dtxcid: chem.dtxcid,
      searchMatch: 'chemical list DTXSID search match',
      hasStructureImage: chem.hasStructureImage,
      searchWord: chem.preferredName || chem.iupacName,
    }
    ));
    // Filter and sort results by user input and click.
    if (ids !== '') {
      const result = computed.filter(chem => ids.includes(chem.dtxsid));
      return result;
    }
    return null;
  },
  getGridToggle: state => state.gridToggle,
  getTileInfo: state => () => state.tileInfo,
  getActive: state => () => state.activeChemical,
  getSelectedChemicalsCount: state => () => state.chemicals.length,
  getUiReady: state => () => {
    let retVal = false;
    if (state.leftNavReady && state.headerReady) {
      retVal = true;
    }
    return retVal;
  },
};
