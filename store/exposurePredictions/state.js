export default () => ({
  demographicGridDefs: [
    {
      headerName: 'Demographic',
      field: 'demographic',
      filter: 'agTextColumnFilter',
      flex: 1,
      cellRenderer: 'PopOverUnderline',
      cellRendererParams: {popField: 'demographicHoverMsg'},
    },
    {
      headerName: 'Predictor',
      field: 'predictor',
      filter: 'agSetColumnFilter',
      flex: 1,
    },
    {
      headerName: 'Median',
      field: 'median',
      filter: 'agNumberColumnFilter',
      cellRenderer: 'ncctRound2', 
    },
    {
      headerName: 'Lower 95%ile',
      field: 'l95',
      filter: 'agNumberColumnFilter',
      hide: true,
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Upper 95%ile',
      field: 'u95',
      filter: 'agNumberColumnFilter',
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Units',
      field: 'units',
    },
    {
      headerName: 'Applicability Domain',
      field: 'ad',
      hide: true,
    },
    {
      headerName: 'Reference',
      field: 'reference',
      hide: true,
    },
    {
      field: 'orderBy',
      hide: true,
      sort: 'asc',
      suppressColumnsToolPanel: true,
    },
  ],
  genericGridDefs: [
    {
      headerName: 'Predictor',
      field: 'predictor',
      flex: 1,
    },
    {
      headerName: 'Value',
      field: 'value',
      cellRenderer: 'ncctNumericCommaSep',
    },
    {
      headerName: 'Units',
      field: 'units',
    },
    {
      headerName: 'reference',
      field: 'reference',
      hide: true,
    },
  ],

})
