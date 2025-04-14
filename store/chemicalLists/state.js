export default () => ({
  chemicalLists: [],
  presenceInListsStaticData: {
    federal: {
      label: 'Federal',
      shortDescription: 'Lists defined by the US federal government',
      order: 0,
    },
    state: {
      label: 'US State',
      shortDescription: 'Lists defined by a US state government',
      order: 1,
    },
    international: {
      label: 'International',
      shortDescription: 'Lists defined by an international government',
      order: 2,
    },
    other: {
      label: 'Other',
      shortDescription: 'All lists not falling into one of the defined categories',
      order: 3,
    },
  },
  gridDefs: [
    {
      headerName: 'List Acronym',
      field: 'listName',
      sortable: true,
      width: 170,
      suppressSizeToFit: true,
      cellRenderer: 'ListAcronymRenderer',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'List Name',
      field: 'label',
      sortable: true,
      width: 250,
      wrapText: true,
      cellStyle: {wordBreak: 'normal'},
      autoHeight: true,
      suppressSizeToFit: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
    },
    {
      headerName: '# Chemicals',
      field: 'chemicalCount',
      sortable: true,
      minWidth: 90,
      maxWidth: 100,
      suppressMenu: true,
      cellStyle: {color: 'green'},

    },
    {
      headerName: 'Updated',
      field: 'updatedAt',
      sortable: true,
      minWidth: 90,
      width: 90,
      cellRenderer: 'DateFormatter',
      suppressMenu: true,
    },
    {
      headerName: 'List Description',
      headerClass: 'cl-header',
      field: 'longDescription',
      sortable: false,
      resizable: true,
      minWidth: 600,
      autoHeight: true,
      cellRenderer: 'MdbCardTextRenderer',
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
    },
  ],
  exportColDefs: [
    {
      header: 'List Acronym',
      key: 'listName',
      formatter: 'cellHyperlink',
      formatterParams: {route: 'chemical-lists/', useValue: true},
      width: 25,
    }, {
      header: 'List Name',
      key: 'label',
      width: 50,
    }, {
      header: 'Last Updated',
      key: 'updatedAt',
      formatter: 'cellFormatDate',
      formatterParams: {useValue: true},
      width: 20,
    }, {
      header: '# of Chemicals',
      key: 'chemicalCount',
      width: 10,
    }, {
      header: 'List Description',
      key: 'longDescription',
    },
  ],

});
