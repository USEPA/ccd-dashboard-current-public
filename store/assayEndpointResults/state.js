export default () => ({
  filterOptions: [],
  chemicalsSelectedBy: {
    logAc50: [],
    scaledTopCutoff: [],
  },
  filterModel: [],
  gridDefs: [
    {
      filter: false,
      suppressSizeToFit: true,
      suppressMenu: true,
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
      field: '',
      colId: 'structureImage',
      suppressSizeToFit: true,
      maxWidth: 130,
      minWidth: 100,
      sortable: false,
      filter: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      cellRenderer: 'structureImage',
    },
    {
      colId: 'dtxsid2',
      headerName: 'DTXSID',
      width: 110,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: true},
      field: 'dtxsid',
      cellRenderer: 'DtxsidDetailsRenderer',
    },
    {
      colId: 'dtxsid',
      filter: true,
      field: 'dtxsid',
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: 'Preferred Name',
      colId: 'preferredName',
      width: 110,
      minWidth: 110,
      maxWidth: 220,
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
      maxWidth: 130,
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
      maxWidth: 130,
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
          maxWidth: 110,
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
          maxWidth: 110,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
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
          maxWidth: 110,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          field: 'percentAssays',
          floatingFilterComponentParams: {suppressFilterButton: false},
          suppressMenu: true,
          valueGetter: 'toxCastPercent',
          cellRenderer: 'percentFormatter',
        },
      ],
    },
    {
      headerName: 'Hit Call',
      filter: 'agTextColumnFilter',
      field: 'hitCall',
      floatingFilterComponentParams: {suppressFilterButton: false},
      width: 80,
      minWidth: 80,
      maxWidth: 100,
      resizable: true,
      sortable: true,
      suppressMenu: true,
      hide: false,
    },
    {
      headerName: 'Top',
      field: 'top',
      filter: 'agNumberColumnFilter',
      filterParams: {
        defaultOption: 'greaterThanOrEqual',
        inRangeInclusive: true,
        allowedCharPattern: '\\d\\.\\-',
      },
      minWidth: 55,
      width: 55,
      resizable: true,
      sortable: true,
      floatingFilterComponentParams: {suppressFilterButton: false},
      suppressMenu: true,
      hide: false,
      cellRendererParams: {format: 'fixed2'},
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Scaled Top',
      headerComponentParams: {
        template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '  <span class="ag-header-cell-text" role="columnheader">Scaled <br> Top</span>' +
            '  <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '  <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '  <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '  <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '  </div>' +
            '</div>',
      },
      field: 'scaledTop',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
        defaultOption: 'greaterThanOrEqual',
        allowedCharPattern: '\\d\\.\\-',
      },
      minWidth: 65,
      width: 65,
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: false},
      resizable: true,
      sortable: true,
      hide: false,
      cellRendererParams: {format: 'fixed2'},
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'AC50',
      headerComponentParams: {
        template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '  <span class="ag-header-cell-text" role="columnheader">AC50 <br>(µM)</span>' +
            '  <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '  <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '  <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '  <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '  </div>' +
            '</div>',
      },
      field: 'ac50',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
        defaultOption: 'greaterThanOrEqual',
        allowedCharPattern: '\\d\\.\\-',
      },
      minWidth: 70,
      width: 70,
      resizable: true,
      floatingFilterComponentParams: {suppressFilterButton: false},
      sortable: true,
      suppressMenu: true,
      hide: false,
      cellRendererParams: {format: 'fixed2'},
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Log AC50',
      headerComponentParams: {
        template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '  <span class="ag-header-cell-text" role="columnheader">Log <br> AC50 (µM)</span>' +
            '  <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '  <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '  <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '  <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '  </div>' +
            '</div>',
      },
      field: 'logAc50',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
        defaultOption: 'greaterThanOrEqual',
        allowedCharPattern: '\\d\\.\\-',
      },
      suppressMenu: true,
      minWidth: 80,
      width: 80,
      floatingFilterComponentParams: {suppressFilterButton: false},
      resizable: true,
      sortable: true,
      hide: false,
      cellRendererParams: {format: 'fixed2'},
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Mono. Mass',
      suppressSizeToFit: false,
      width: 100,
      minWidth: 100,
      maxWidth: 170,
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
        defaultOption: 'greaterThanOrEqual',
        allowedCharPattern: '\\d\\.\\-',
      },
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: false},
      valueGetter: 'Number.isNaN(data.monoisotopicMass) || data.monoisotopicMass === "-" ? "-" : Number( Number( data.monoisotopicMass ).toFixed(6) )',
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
      maxWidth: 165,
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
      minWidth: 80,
      maxWidth: 80,
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
      valueGetter: 'splitInchi',
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
      suppressColumnsToolPanel: true,
      suppressMenu: true,
      hide: true,
    },
    {
      headerName: 'Hit Call',
      colId: 'hitc',
      field: 'hitc',
      sortable: true,
      suppressMenu: true,
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
      header: 'MOLECULAR FORMULA',
      key: 'molFormula',
    }, {
      header: 'MONOISOTOPIC MASS',
      key: 'monoisotopicMass',
      formatter: 'cellRoundTo6',
    }, {
      header: 'ToxCast Active',
      width: 20,
      key: 'activeAssays',
    }, {
      header: 'ToxCast Total',
      width: 20,
      key: 'totalAssays',
    }, {
      header: '% ToxCast Active',
      key: 'percentAssays',
    }, {
      header: 'HIT CALL',
      key: 'hitCall',
    }, {
      header: 'TOP',
      key: 'top',
    }, {
      header: 'SCALED TOP',
      key: 'scaledTop',
    }, {
      header: 'AC50',
      key: 'ac50',
    }, {
      header: 'LOGAC50',
      key: 'logAc50',
    },
  ],
});
