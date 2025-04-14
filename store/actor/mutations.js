/* eslint-disable no-param-reassign */
export default {
  setActorCategories(state, categories) {
    const actorCategories = categories.map((item) => {
      item.value = item.categoryId
      item.text = item.categoryName
      return item
    })
    state.categories = actorCategories
  },
  setCategorySelection(state, selected) {
    state.categorySelection = selected
  },
  setActorAssays(state, assays) {
    state.assays = assays
  },
  setActorAssayData(state, assayData) {
    if (assayData.length < 1) {
      state.assayData = []
      return
    }
    const formattedNewAssayData = assayData.reduce((acc, cv) => {
      const indentifier = `componentId_${cv.componentId}`
      acc[0][indentifier] = cv.valueNumerical || cv.valueString
      return acc
    }, [{}])

    state.assayData = formattedNewAssayData
  },
  setActorAssayDetails(state, assayDetails) {
    state.assayDetails = assayDetails
  },
  setShowAssayDetailsModal(state, showAssayDetailsModal) {
    state.showAssayDetailsModal = showAssayDetailsModal
  },
  setShowActorAssayData(state, showActorAssayData) {
    state.showActorAssayData = showActorAssayData
  },
  setActorAssayDataCols(state, dataColumns) {
    if (dataColumns.length < 1) {
      state.assayDataCols = []
      return
    }
    const columnDefs = dataColumns.map(col => ({
      headerName: col.componentName,
      field: `componentId_${col.componentId}`,
      headerTooltip: col.componentName,
      suppressMenu: true,
      autoHeight: true,
      minWidth: 100,
      ...(col.valueType === 'FLOAT' && {cellRenderer: 'ncctRound'}),
      ...(col.valueType === 'TEXT'),
    }))
    state.assayDataCols = columnDefs
  },
  setActorAssayComponents(state, assayComponents) {
    state.assayComponents = assayComponents
  },
  setSelectedActorAssayName(state, assayName) {
    state.selectedAssayName = assayName
  },
}
