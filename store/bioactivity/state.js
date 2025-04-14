export default () => ({
  toxcastModelsGridDef: [
    {
      headerName: 'Model',
      field: 'model',
      cellRenderer: 'PopOverUnderline',
      cellRendererParams: {popField: 'help'},
      width: 190,
      minWidth: 120,
      maxWidth: 640,
    },
    {
      headerName: 'Receptor',
      field: 'receptor',
      width: 80,
      minWidth: 50,
      maxWidth: 300,
    },
    {
      headerName: 'Agonist',
      field: 'agonist',
      width: 70,
      minWidth: 50,
      maxWidth: 300,
      cellRenderer: 'ncctRound2'
    },
    {
      headerName: 'Antagonist',
      field: 'antagonist',
      width: 80,
      minWidth: 50,
      maxWidth: 300,
      cellRenderer: 'ncctRound2'
    },
    {
      headerName: 'Binding',
      field: 'binding',
      width: 70,
      minWidth: 50,
      maxWidth: 400,
    },
  ],
  toxcastModelsData: [],
})
