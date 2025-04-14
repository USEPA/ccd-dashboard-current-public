/* eslint-disable no-undef */
export default {
  getActorCategories: state => state.categories,
  getCategorySelection: state => state.categorySelection,
  getActorAssays: state => state.assays,
  getActorAssayData: state => state.assayData,
  getActorAssayDetails: state => state.assayDetails,
  getActorAssayDataCols: state => state.assayDataCols,
  getActorAssayComponents: state => state.assayComponents,
  getAssayComponentsCols: state => state.assayComponentsCols,
  getAssayGridDefs: state => state.assayGridDefs,
  getExperimentalGridDefs: state => state.experimentalGridDefs,
  getPredictedGridDefs: state => state.predictedGridDefs,
  getAssayDetailsGridDefs: state => state.assayDetailsGridDefs,
  getShowAssayDetailsModal: state => state.showAssayDetailsModal,
  getShowActorAssayData: state => state.showActorAssayData,
  getSelectedActorAssayName: state => state.selectedAssayName,
}
