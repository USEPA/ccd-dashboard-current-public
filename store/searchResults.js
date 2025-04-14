export const actions = {

};

export const mutations = {

};


export const getters = {
  getGridDefs: state => () => state.gridDefs,
};

export const state = () => ({
  gridDefs: [
    {
      filter: false,
      suppressSizeToFit: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      sortable: false,
      resizable: false,
      width: 40,
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
      floatingFilterComponentParams: {suppressFilterButton: true},
      cellRenderer: 'structureImage',
    },
    {
      headerName: 'DTXSID',
      width: 120,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: true},
      field: 'dtxsid',
      cellRenderer: 'DtxsidDetailsRenderer',
    },
    {
      headerName: 'Preferred Name',
      colId: 'preferredName',
      width: 180,
      filter: 'agTextColumnFilter',
      field: 'preferredName',
      cellRenderer: 'formatPreferredName',
    },
    {
      headerName: 'CASRN',
      width: 90,
      filter: 'agTextColumnFilter',
      field: 'casrn',
    },
    {
      headerName: 'QC Level',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      width: 80,
      field: 'qcLevel',
      cellRenderer: 'qcLevel',
      suppressMenu: true,
    },
    {
      headerName: 'Mono. Mass',
      width: 90,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'monoisotopicMass',
    },
    {
      headerName: '# ToxCast Active',
      width: 80,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'activeAssays',
      cellRenderer: 'toxCastActive',
      suppressMenu: true,
    },
    {
      headerName: '% ToxCast Active',
      width: 80,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'percentAssays',
      cellRenderer: 'percentFormatter',
    },
    {
      headerName: '% ToxCast Active',
      width: 90,
      suppressSizeToFit: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'percentAssays',
      cellRenderer: 'percentFormatter',
    },
    {
      headerName: 'Isotope',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'isotope',
      hide: true,
    },
    {
      headerName: 'Mol. Formula',
      filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: true,
      },
      field: 'molFormula',
      width: 100,
      resizable: true,
      sortable: true,
      hide: false,
    },
    {
      headerName: 'Multicomponent',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'multicomponent',
      hide: true,
    },
    {
      headerName: 'Inchikey',
      field: 'inchikey',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    },
    {
      headerName: 'SMILES',
      field: 'smiles',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    },
    {
      headerName: 'IUPAC NAME',
      field: 'iupacName',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    },
    {
      headerName: 'Selected',
      filter: 'agTextColumnFilter',
      field: 'selected',
      hide: true,
    },
  ],

});
