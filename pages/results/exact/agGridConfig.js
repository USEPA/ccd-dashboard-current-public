export default [
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
    width: 130,
    sortable: false,
    filter: false,
    suppressSizeToFit: true,

    'cellRenderer'(params) {
      if (params.data.relatedCount && params.data.relatedCount !== 0) {
        return `<span class='related-cell'>${
          params.data.relatedCount
        } related chemical structure${
          params.data.relatedCount === 1 ? '' : 's'
        } with this substance</span>`;
      }

      return `<img height="100" src="${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_IMAGE_API}by-dtxsid/${params.data.dtxsid}">`;
    },
  },
  {
    headerName: 'DTXSID',
    suppressSizeToFit: true,
    width: 120,
    filter: 'agTextColumnFilter',
    field: 'dtxsid',
  },
  {
    headerName: 'Preferred Name',
    filter: 'agTextColumnFilter',
    field: 'name',
    resizable: true,
    sortable: true,
  },
  {
    headerName: 'ToxCast',
    menuTabs: ['columnsMenuTab'],
    width: 130,
    filter: 'agNumberColumnFilter',
    filterParams: {
      inRangeInclusive: true,
    },
    field: 'percentAssays',
    suppressSizeToFit: true,
    resizable: true,
    sortable: true,
    cellStyle: {whiteSpace: 'normal'},
    'cellRenderer'(params) {
      if (params.value) {
        return `${params.data.activeAssays} active of <br> ${params.data.totalAssays} total assays (${params.value}%)`;
      }
      return '-';
    },
  },
  {
    headerName: 'CASRN',
    suppressSizeToFit: true,
    width: 100,
    filter: 'agTextColumnFilter',
    field: 'casrn',
  },
  {
    headerName: 'QC Level',
    filter: 'agNumberColumnFilter',
    filterParams: {
      inRangeInclusive: true,
    },
    suppressSizeToFit: true,
    width: 80,
    field: 'qc',
    cellStyle: {textAlign: 'center'},
    'cellRenderer'(params) {
      return `Level ${params.value}` || 0;
    },
  },
  {
    headerName: 'Monoisotopic Mass',
    filter: 'agNumberColumnFilter',
    filterParams: {
      inRangeInclusive: true,
    },
    cellStyle: {textAlign: 'left'},
    field: 'mass',
    cellRenderer: 'roundTo6',
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
    headerName: 'Multicomponent',
    filter: 'agNumberColumnFilter',
    filterParams: {
      inRangeInclusive: true,
    },
    field: 'multicomponent',
    hide: true,
  },
  {
    headerName: 'selected',
    filter: false,
    field: 'selected',
    hide: true,
  },
];
