export default () => ({
  summaryGridDefs: [
    {
      headerName: 'Demographic',
      field: 'label',
      filter: '',
      suppressMenu: true,
      cellRenderer: 'PopOverUnderline',
      cellRendererParams: {popField: 'hoverMsg'},
    },
    {
      headerName: 'Median',
      field: 'median',
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Upper Bound (Median)',
      headerTooltip: 'Upper 95% limit of the credible interval on the median exposure estimate',
      field: 'upper95th',
      cellRenderer: 'ncctRound2',
    },
    {
      headerName: 'Lower Bound (Median)',
      field: 'lower95th',
      headerTooltip: 'Lower 95% limit of the credible interval on the median exposure estimate',
      cellRenderer: 'ncctRound2',
    },
  ],
});
