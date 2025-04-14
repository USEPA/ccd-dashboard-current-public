export default {
  getPropertyData: state => () => state.propertyData,
  getPropertySelection: state => () => state.propertySelection,
  getSummaryGridDefs: state => () => state.summaryGridDefs,
  getExperimentalGridDefs: state => () => state.experimentalGridDefs,
  getPredictedGridDefs: state => () => state.predictedGridDefs,
  getMiniSummaryGridDefs: state => () => state.miniSummaryGridDefs,

  getSelectListValues: state => () => {
    const items = state.propertyData
    const defaultOption = {value: 'SUMMARY', text: 'Summary'}

    const optionsArray = items.map((property, index) => {
      const r = {}
      r.value = property.arrKey
      r.text = property.name
      return r
    })
    optionsArray.unshift(defaultOption)
    return optionsArray
  },


  getSummaryData: state => () => {
    const summaryData = []
    const propertyData = Object.values(state.propertyData)
    for (let i = 0; i < propertyData.length; i++) {
      let exavg,
        exmedian,
        exrange,
        excount
      let predavg,
        predmedian,
        predrange,
        predcount
      if (propertyData[i].experimental) {
        excount = `(${propertyData[i].experimental.count})`
        const roundexAvg = $nuxt.ncctRound(propertyData[i].experimental.mean)
        exavg = `${roundexAvg} ${excount}` || '-'
        exmedian = $nuxt.ncctRound(propertyData[i].experimental.median)
        exrange = propertyData[i].experimental.range
      } else {
        exavg = '-'
        exmedian = '-'
        exrange = '-'
      }
      if (propertyData[i].predicted) {
        predcount = `(${propertyData[i].predicted.count})`
        const roundpredAvg = $nuxt.ncctRound(propertyData[i].predicted.mean)
        predavg = `${roundpredAvg} ${predcount}`
        predmedian = $nuxt.ncctRound(propertyData[i].predicted.median)
        predrange = propertyData[i].predicted.range
      }
      const summaryUnit = propertyData[i].unit || '-'

      summaryData.push({
        property: propertyData[i].name,
        propId: propertyData[i].arrKey,
        exavg: exavg,
        predavg: predavg,
        exmedian: exmedian,
        predmedian: predmedian,
        exrange: exrange,
        predrange: predrange,
        unit: summaryUnit,
      })
    }
    return summaryData
  },

  getMiniSummaryData: state => (whichProperty) => {
    const items = state.propertyData.find(obj => obj.arrKey === whichProperty)
    const rowData = []
    if (items.experimental) {
      const exData = {
        type: 'Experimental',
        mean: items.experimental.mean,
        median: items.experimental.median,
        range: items.experimental.range,
        unit: items.unit,
      }
      rowData.push(exData)
    }
    if (items.predicted) {
      const predData = {
        type: 'Predicted',
        mean: items.predicted.mean,
        median: items.predicted.median,
        range: items.predicted.range,
        unit: items.unit,
      }
      rowData.push(predData)
    }

    return rowData
  },

}
