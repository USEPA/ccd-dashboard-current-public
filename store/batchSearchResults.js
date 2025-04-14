export const actions = {

};

export const mutations = {
  setSendToBatchChemicals(state, chemArray) {
    state.sendToBatchChemicals = chemArray;
  },
};

export const getters = {
  getBaseGridDefs: state => () => state.baseGridDefs,
  getSendToBatchChemicals: state => () => state.sendToBatchChemicals,
  getPresenseInListDefs: state => () => state.presenseInListDefs,
  getExportColDefs: state => () => state.exportColDefs,
};

export const state = () => ({
  sendToBatchChemicals: [],
  presenseInListDefs: [
    {
      headerName: 'Title',
      field: 'listName',
      sortable: true,
      resizable: true,
      width: 200,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      cellRenderer: 'titleRenderer',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
    }, {
      headerName: 'Description',
      field: 'label',
      sortable: true,
      resizable: true,
      cellRenderer: 'PopOverRenderer',
      cellRendererParams: {popField: 'shortDescription', isbatch: 'yes'},
      flex: 1,
      autoHeight: true,
      wrapText: true,
      cellStyle: {whiteSpace: 'normal', lineHeight: '17px'},
      floatingFilter: true,
      filter: 'agTextColumnFilter',
    },
  ],

  baseGridDefs: [
    {
      filter: false,
      width: 40,
      suppressSizeToFit: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressColumnsToolPanel: true,
      sortable: false,
      resizable: false,

    },
    {
      headerName: 'Structure',
      field: '',
      colId: 'structureImage',
      suppressSizeToFit: true,
      width: 130,
      sortable: false,
      filter: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      cellRenderer: 'structureImage',
      cellRendererParams: {popField: 'assayEndpointDesc'},
    },
    {
      colId: 'dtxcid',
      headerName: 'DTXCID',
      width: 110,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: true},
      field: 'dtxcid',
      hide: true,
      floatingFilter: true,
    },
    {
      colId: 'dtxsid',
      headerName: 'DTXSID',
      width: 110,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: true},
      field: 'dtxsid',
      cellRenderer: 'DtxsidDetailsRenderer',
      floatingFilter: true,
    },
    {
      headerName: 'Preferred Name',
      colId: 'preferredName',
      width: 300,
      flex: 1,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: false},
      field: 'preferredName',
      wrapText: true,
      cellStyle: {wordBreak: 'normal'},
      autoHeight: true,
      floatingFilter: true,
    },
    {
      headerName: 'CASRN',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: false},
      field: 'casrn',
      floatingFilter: true,
    },
    {
      headerName: 'Mono. Mass',
      suppressSizeToFit: false,
      width: 100,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'monoisotopicMass',
      floatingFilterComponentParams: {suppressFilterButton: false},
      cellRenderer: 'roundTo6',
      floatingFilter: true,
    },
    {
      headerName: 'Mol. Formula',
      filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: true,
      },
      field: 'molFormula',
      floatingFilterComponentParams: {suppressFilterButton: false},
      cellRenderer: 'GridPopover',
      cellRendererParams: {popField: 'molFormula'},
      resizable: false,
      sortable: true,
      hide: false,
      floatingFilter: true,
    },
  ],

});
