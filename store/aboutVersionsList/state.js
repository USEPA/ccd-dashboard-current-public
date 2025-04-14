import aboutVersionsTableJson from '~/assets/fixtures/aboutPageVersionsTable.json'
import aboutVersions2Json from '~/assets/fixtures/aboutVersions2.json'

export default () => ({
  loading: false,
  aboutVersionsGridDefs: [
    {
      headerName: 'Source Name',
      field: 'source_name',
      filter: 'agTextColumnFilter',
      flex: 1,
    },
    {
      headerName: 'MySQL Schema Name (PROD)',
      field: 'schema_name',
      filter: 'agTextColumnFilter',
      flex: 1,
    },
    {
      headerName: 'Data Owner',
      field: 'data_owner',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Snapshot Date',
      field: 'snapshot_date',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Data Hub Version',
      field: 'data_hub_version',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'CCD Public Version',
      field: 'ccd_public_version',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'CCD Internal Version',
      field: 'ccd_internal_version',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'GeneRA Version',
      field: 'genra_version',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'RapidTox Version',
      field: 'rapidtox_version',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Region 10 Version',
      field: 'region_version',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Public API Version',
      field: 'public_api_version',
      filter: 'agTextColumnFilter',
    },
  ],
  aboutVersionsGridDefs2: [
    {
      headerName: 'Source Name',
      field: 'sourceName',
      tooltipField: 'sourceName',
      filter: 'agTextColumnFilter',
      suppressMenu: false,
      autoHeight: true,
      wrapText: true,
      floatingFilter: 'agTextColumnFilter',
    },
    {
      headerName: 'Version',
      field: 'version',
      tooltipField: 'version',
      filter: 'agTextColumnFilter',
      wrapText: true,
      autoHeight: true,
      suppressMenu: true,
    },
    {
      headerName: 'Snapshot Date',
      field: 'snapshotDate',
      autoHeight: true,
      wrapText: true,
      filter: 'agDateFilter',
      maxWidth: 80,
    },
    {
      headerName: 'Description',
      field: 'description',
      filter: 'agTextColumnFilter',
      resizable: true,
      Width: 200,
      autoHeight: true,
      wrapText: true,
      sortable: true,
    },
    {
      headerName: 'URL',
      field: 'url',
      filter: 'agTextColumnFilter',
      width: 200,
      autoHeight: true,
      wrapText: true,
      cellRenderer: 'HrefLinkRenderer',
    },
  ],
  aboutVersionsData: aboutVersionsTableJson,
  aboutVersionsData2: aboutVersions2Json,
})
