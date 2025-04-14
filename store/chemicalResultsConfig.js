export const actions = {

};

export const mutations = {

};

export const getters = {
  getBaseGridDefs: state => () => state.baseGridDefs,
  getBaseToolBar: state => () => state.baseToolBarConfig,
  getBaseTileInfoOptions: state => () => state.baseToolBarConfig.tileInfoOptions,
  getBaseFilterOptions: state => () => state.baseToolBarConfig.filterOptions,
  getBaseSortOptions: state => () => state.baseToolBarConfig.sortOptions,
  getExportColDefs: state => () => state.exportColDefs,
};

export const state = () => ({
  baseToolBarConfig: {
    tileInfoOptions: [
      {label: 'DTXSID', id: 'dtxsid'},
      {label: 'CASRN', id: 'casrn'},
      {label: 'ToxCast', id: 'toxcast'},
      {label: 'Mono. Mass.', id: 'monoisotopicMass'},
      {label: 'Mol. Formula', id: 'molFormula'},
    ],
    filterOptions: [
      {value: 'unselected', text: 'Unselected'},
      {value: 'isotope', text: 'Isotopes'},
      {value: 'multicomponent', text: 'Multicomponent Chemicals'},
      {value: 'noStructure', text: 'No Structures'},
      {value: 'structure', text: 'Are Structures'},
    ],
    sortOptions: [
      {text: 'Default', value: 'default'},
      {text: 'DTXSID', value: 'dtxsid'},
      {text: 'Name', value: 'preferredName'},
      {text: 'CASRN', value: 'casrn'},
      {text: 'QC Level', value: 'qcLevel'},
      {text: 'Mono.Mass', value: 'monoisotopicMass'},
      {text: 'ToxCast', value: 'activeAssays'},
    ],
  },
  baseGridDefs: [
    {
      filter: false,
      suppressSizeToFit: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      suppressColumnsToolPanel: true,
      sortable: false,
      resizable: false,
      width: 60,
    },
    {
      headerName: 'Structure',
      field: 'dtxsid',
      colId: 'structureImage',
      suppressSizeToFit: true,
      minWidth: 100,
      sortable: false,
      filter: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      cellRenderer: 'structureImage',
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
    },
    {
      colId: 'dtxsid2',
      filter: true,
      field: 'dtxsid',
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: 'Preferred Name',
      colId: 'preferredName',
      minWidth: 140,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: false},
      field: 'preferredName',
      suppressMenu: true,
      wrapText: true,
      cellStyle: {wordBreak: 'normal'},
      autoHeight: true,
    },
    {
      headerName: 'CASRN',
      width: 80,
      minWidth: 80,
      suppressMenu: true,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: false},
      field: 'casrn',
    },
    {
      headerComponentParams: {
        template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '  <span class="ag-header-cell-text" role="columnheader">QC Level</span>' +
            '  <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '  <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '  <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '  <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '  </div>' +
            '</div>',
      },
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      suppressSizeToFit: true,
      width: 80,
      minWidth: 80,
      field: 'qcLevel',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: false},
    },
    {
      headerName: 'ToxCast',
      headerClass: 'toxCastHeader',
      children: [
        {
          headerName: '# Active',
          headerClass: 'toxCastHeader',
          headerTooltip: 'Number of distinct ToxCast endpoints where representative sample is considered active',
          width: 90,
          minWidth: 90,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          field: 'activeAssays',
          suppressMenu: true,
          floatingFilterComponentParams: {
            suppressFilterButton: false,
            class: 'toxCastHeader',
          },
        },
        {
          headerName: 'Total',
          headerClass: 'toxCastHeader',
          headerTooltip: 'Number of distinct ToxCast endpoints where chemical was screened',
          width: 75,
          minWidth: 75,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
          },
          field: 'totalAssays',
          suppressMenu: true,
          floatingFilterComponentParams: {suppressFilterButton: false},
        },
        {
          headerName: '% Active',
          headerClass: 'toxCastHeader',
          headerTooltip: 'Percentage of the active representative samples across distinct ToxCast endpoints where chemical was screened',
          width: 75,
          minWidth: 75,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          field: 'percentAssays',
          floatingFilterComponentParams: {suppressFilterButton: false},
          suppressMenu: true,
          valueGetter: 'toxCastPercent',
          // cellRenderer: 'percentFormatter',
        },
      ],
    },
    {
      headerName: 'Mono. Mass',
      suppressSizeToFit: false,
      width: 100,
      minWidth: 100,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
        defaultOption: 'greaterThanOrEqual',
      },
      field: 'monoisotopicMass',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: false},
      cellRenderer: 'roundTo6',
    },
    {
      headerName: 'Isotope',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      suppressColumnsToolPanel: true,
      field: 'isotope',
      hide: true,
    },
    {
      headerName: 'Multicomponent',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'multicomponent',
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: 'Mol. Formula',
      filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: true,
      },
      field: 'molFormula',
      suppressSizeToFit: false,
      minWidth: 95,
      width: 100,
      floatingFilterComponentParams: {suppressFilterButton: false},
      cellRenderer: 'GridPopover',
      cellRendererParams: {popField: 'molFormula'},
      suppressMenu: true,
      resizable: false,
      sortable: true,
      hide: false,
    },
    {
      headerName: 'Compound ID',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      field: 'compoundId',
      width: 90,
      suppressColumnsToolPanel: true,
      resizable: true,
      sortable: true,
      hide: true,
    },
    {
      headerName: 'InchiString',
      field: 'inchiString',
      valueGetter: 'splitInchi',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    },
    {
      headerName: 'Inchikey',
      field: 'inchiKey',
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
      headerName: 'AVERAGE MASS',
      field: 'averageMass',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    },
    {
      filter: 'agTextColumnFilter',
      field: 'selected',
      suppressColumnsToolPanel: true,
      hide: true,
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
    },
    {
      header: 'Mass Difference',
      key: 'massDiff',
    }, {
      header: '# ToxCast Active',
      width: 20,
      key: 'activeAssays',
      formatter: 'cellDelimitedJoin',
      formatterParams: {referenceFields: ['totalAssays']},
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
