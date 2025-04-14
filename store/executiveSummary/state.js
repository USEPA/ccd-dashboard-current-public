export default () => ({
  regionalScreeningGridDef: [
    {
      headerName: 'Class',
      floatingFilter: false,
      field: 'toxvalType',
      width: 220,
      
    },
    {
      headerName: 'Risk Level',
      floatingFilter: false,
      field: 'thq',
      suppressMenu: true,
      width: 80,
      minWidth: 50,
      maxWidth: 80,
    },
    {
      headerName: 'Value',
      floatingFilter: false,
      field: 'toxvalNumeric',
      cellRenderer: 'ncctRound2',
      suppressMenu: true,
      width: 70,
      minWidth: 50,
      maxWidth: 80,
    },
  ],
  regionalScreeningData: [],
  execSumLinksData: [],
  physChemData: [],
  logP: {},
  vp: {},
  bcf: {},
  oralPodData: [],
  showToxcast: true,
})
