export default {
  setExecSumLinksData(state, data) {
    state.execSumLinksData = data
  },
  setPhysChemData(state, values) {
    state.physChemData = values
  },
  setRegionalScreening(state, screening_values) {
    state.regionalScreeningData = screening_values
  },
  setToxcastVisibility(state, visibility) {
    state.showToxcast = visibility
  },
  setLogp(state, values) {
    state.logP = values
  },
  setVp(state, values) {
    state.vp = values
  },
  setBcf(state, values) {
    state.bcf = values
  },
  setOralPodData(state, values) {
    state.oralPodData = values
  }
}
