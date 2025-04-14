/* eslint-disable no-param-reassign */
export default {
  setChemicals(state, chemicals) {
    state.chemicals = chemicals;
  },
  setFilteredChemicals(state, chemicals) {
    state.filteredChemicals = chemicals;
  },
  addChemicals(state, newChemicalChunks) {
    state.chemicals = state.chemicals.concat(newChemicalChunks);
  },
  setTooManyChemicals(state, value) {
    state.tooManyChemicals = value;
  },
  setSelectedChemical(state, chemicalState) {
    // eslint-disable-next-line eqeqeq
    const chemicaltoSelect = state.chemicals.find(chem => chem.uuId == chemicalState.uuId);
    chemicaltoSelect.selected = chemicalState.selectedState;
  },
  setSelectedTilesFromGrid(state, chems) {
    const currentTileSelection = state.chemicals.filter(chem => chem.selected === true);
    if (currentTileSelection > 0) {
      // eslint-disable-next-line no-plusplus
      for (let c = 0; c < currentTileSelection.length; c++) {
        const chemtoClear = state.chemicals.find(chem => chem.uuId === currentTileSelection[c].uuId);
        chemtoClear.selected = false;
      }
      Object.keys(chems).forEach((key) => {
        if (chems[key]) {
        // eslint-disable-next-line eqeqeq
          const chemicaltoSelect = state.chemicals.find(chem => chem.uuId === key);
          if (chemicaltoSelect) { chemicaltoSelect.selected = true; }
        }
      });
    }
  },
  setChemicalListFilteredChemicals(state, chemicals) {
    state.filteredChemicals = chemicals;
    state.originalChemicals = [...state.chemicals];
    state.chemicals = [...state.filteredChemicals];
  },
  resetChemicalListChemicals(state) {
    state.filteredChemicals = [];
    state.chemicals = [...state.originalChemicals];
  },
  setFilterOptions(state, filterOptions) {
    state.filterOptions = filterOptions;
  },
  setSortOptions(state, sortOptions) {
    state.sortOptions = sortOptions;
  },
  setTileInfoOptions(state, tileInfoOptions) {
    state.tileInfoOptions = tileInfoOptions;
  },
  setSort(state, newSort) {
    state.sortModel = newSort;
  },
  setChemicalImage(state, imageInfo) {
    state.chemicalImageInfo = imageInfo;
  },
  setModalVisibility(state, vis) {
    state.chemicalImageInfo.visible = vis;
  },
  setFilterModel(state, filters) {
    state.filterModel = filters;
  },
  setSingleSelectedChemical(state, singleId) {
    const singleChemical = state.chemicals;
  },
  setGridToggle(state, newState) {
    state.gridToggle = newState;
  },
  setTileInfo(state, val) {
    state.tileInfo = val;
  },
  setActiveChemical(state, chemical) {
    state.activeChemical = chemical;
  },
  setHeaderReady(state, ready) {
    state.headerReady = ready;
  },
  setLeftNavReady(state, ready) {
    state.leftNavReady = ready;
  },
};
