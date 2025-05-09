export default () => ({
  assayEndpointItems: [],
  assayVenders: [],
  columnDefs: [
    {
      headerName: 'Vendor',
      field: 'vendorKey',
      hide: true,
      width: 100,
      filter: true,
    },
    {
      headerName: 'Assay Component Endpoint Name',
      headerTooltip: 'Assay Component Endpoint Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      width: 200,
      cellRenderer: 'EndpointNameRenderer',
      sortable: true,
      floatingFilter: true,
    },
    {
      headerName: 'Details',
      headerTooltip: 'Open assay details modal window.',
      field: 'aeid',
      width: 80,
      cellRenderer: 'AssayModalToggle',
      filter: false,
    },
    {
      headerName: 'Multi Conc. Actives',
      filter: 'agTextColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      headerTooltip: 'Multi Conc. Actives',
      width: 155,
      field: 'multi_conc_assay_chemical_count',
      cellRenderer: 'MultiConcRenderer',
      sortable: true,
      unSortIcon: true,
      valueGetter: 'mcValues',
      floatingFilter: true,
    },
    {
      headerName: 'Single Conc. Active',
      filter: 'agTextColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      width: 155,
      field: 'single_conc_assay_chemical_count',
      headerTooltip: 'Single Conc. Active',
      cellRenderer: 'SingleConcRenderer',
      sortable: true,
      unSortIcon: true,
      valueGetter: 'scValues',
      floatingFilter: true,
    },
    {
      headerName: 'Description',
      field: 'desc',
      width: 570,
      autoHeight: true,
      cellRenderer: 'MdbCardTextRenderer',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'Gene Symbols',
      headerTooltip: 'Gene Symbols',
      sortable: true,
      field: 'genes',
      width: 120,
      cellRenderer: 'GeneSymbolPopOverList',
      getQuickFilterText: 'geneFilterText',
      filter: 'agTextColumnFilter',
      valueGetter: 'geneFilterText',
      floatingFilter: true,
    },
  ],

  exportColDefs: [
    {
      header: 'List Acronym',
      key: 'name',
      formatter: 'cellHyperlink',
      formatterParams: {route: 'assay-endpoints/', useValue: true},
      width: 50,
    }, {
      header: 'List Description',
      key: 'desc',
    }, {
      header: 'Genes',
      key: 'genes',
      formatter: 'cellSingleFieldExtractor',
      formatterParams: {referenceKey: 'gene_symbol', delimitChar: '|'},
    }, {
      header: 'Multi Conc Active',
      key: 'multi_conc_assay_chemical_count_active',
    },
    {
      header: 'Multi Conc Total',
      key: 'multi_conc_assay_chemical_count_total',
    },
    {
      header: 'Single Conc Active',
      key: 'single_conc_assay_chemical_count_singleActive',
    },
    {
      header: 'Single Conc Total',
      key: 'single_conc_assay_chemical_count_singleTotal',
    },

  ],
})
