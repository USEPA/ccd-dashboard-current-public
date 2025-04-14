export const actions = {

};

export const mutations = {

};

export const getters = {
  getSummaryGridDefs: state => () => state.summaryGridDefs,
  getDetailsGridDefs: state => () => state.detailsGridDefs,
  getExportColDefs: state => () => state.exportColDefs,
};

export const state = () => ({
  summaryGridDefs: [
    {
      headerName: 'DTXSID',
      floatingFilter: false,
      field: 'dtxsid',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
      hide: true,
    },
    {
      headerName: 'Reports Positive',
      floatingFilter: false,
      field: 'reportsPos',
      filter: 'agNumberColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Reports Negative',
      floatingFilter: false,
      field: 'reportsNeg',
      filter: 'agNumberColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Reports Other',
      floatingFilter: false,
      field: 'reportsOther',
      filter: 'agNumberColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Genotox Call',
      floatingFilter: false,
      field: 'genetoxCall',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'AMES',
      floatingFilter: false,
      field: 'ames',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Micronucleus',
      floatingFilter: false,
      field: 'micronucleus',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
  ],
  detailsGridDefs: [
    {
      headerName: 'DTXSID',
      floatingFilter: true,
      field: 'dtxsid',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
      hide: true,
    },
    {
      headerName: 'Source',
      floatingFilter: true,
      field: 'source',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Assay Category',
      floatingFilter: true,
      field: 'assayCategory',
      filter: 'agTextColumnFilter',
      minWidth: 80,
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Assay Type',
      floatingFilter: true,
      field: 'assayType',
      minWidth: 70,
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Metabolic Activation',
      floatingFilter: true,
      minWidth: 90,
      field: 'metabolicActivation',
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Species',
      floatingFilter: true,
      field: 'species',
      minWidth: 70,
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Strain',
      floatingFilter: true,
      field: 'strain',
      minWidth: 70,
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Assay Result',
      floatingFilter: true,
      field: 'assayResult',
      minWidth: 80,
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
    {
      headerName: 'Year',
      floatingFilter: true,
      field: 'year',
      minWidth: 60,
      filter: 'agTextColumnFilter',
      headerClass: 'hide-filter-icon',
    },
  ],
  exportColDefs: [
    {
      header: 'DTXSID',
      key: 'dtxsid',
      width: '16',
      formatter: 'cellHyperlink',
      formatterParams: {route: 'chemical/details/', useValue: true},
    }, {
      header: 'PREFERRED NAME',
      key: 'preferredName',
      width: '32',
    }, {
      header: 'CASRN',
      key: 'casrn',
      width: '12',
    }, {
      header: 'INCHIKEY',
      key: 'inchiKey',
    }, {
      header: 'IUPAC NAME',
      key: 'iupacName',
    }, {
      header: 'SMILES',
      key: 'smiles',
    }, {
      header: 'INCHI STRING',
      key: 'inchiString',
      formatter: 'splitInchiString',
    }, {
      header: 'MOLECULAR FORMULA',
      key: 'molFormula',
    }, {
      header: 'AVERAGE MASS',
      key: 'averageMass',
    }, {
      header: 'MONOISOTOPIC MASS',
      key: 'monoisotopicMass',
      formatter: 'cellRoundTo6',
    }, {
      header: 'QC Level',
      key: 'qcLevel',
    }, {
      header: '# ToxCast Active',
      width: 20,
      key: 'activeAssays',
      formatter: 'cellDelimitedJoin',
      formatterParams: {referenceFields: ['totalAssays']},
    },
    {
      header: 'Mass Difference',
      key: 'massDiff',
    },
    {
      header: 'Total Assays',
      key: 'totalAssays',
    },
    {
      header: '% ToxCast Active',
      key: 'percentAssays',
    },
  ],

});
