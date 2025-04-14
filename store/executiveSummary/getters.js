export default {
  getExecSumLinksData: state => () => state.execSumLinksData,
  getRegionalScreeningGridDef: state => () => state.regionalScreeningGridDef,
  getRegionalScreeningData: state => () => state.regionalScreeningData,
  getPhysChemData: state => () => state.physChemData,
  getLogP: state => () => state.logp,
  getVp: state => () => state.vp,
  getBcf: state => () => state.bcf,
  getOralPodData: state => () => state.oralPodData,
  getToxcastVisibility: state => () => state.showToxcast,
}
