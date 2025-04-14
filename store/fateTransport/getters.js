export default {
  getFateTransport: state => () => state.fateTransport,
  getPropertySelection: state => () => state.propertySelection,
  getSummaryGridDefs: state => () => state.summaryGridDefs,
  getExperimentalGridDefs: state => () => state.experimentalGridDefs,
  getPredictedGridDefs: state => () => state.predictedGridDefs,
  getMiniSummaryGridDefs: state => () => state.miniSummaryGridDefs,

  getSelectListValues: state => () => {
    const items = state.fateTransport
    const defaultOption = {value: 'SUMMARY', text: 'Summary'}

    const optionsArray = items.map((fateTrans, index) => {
      const r = {}
      r.value = fateTrans.arrKey
      r.text = fateTrans.name
      return r
    })
    optionsArray.unshift(defaultOption)
    return optionsArray
  },

  getSummaryData: (state, getters) => () => {
    const summaryData = []
    const fateTransData = state.fateTransport
    fateTransData.forEach((item, i) => {
      let exavg,
        exmedian,
        exrange,
        excount
      let predavg,
        predmedian,
        predrange,
        predcount

      if (fateTransData[i].experimental) {
        excount = `(${fateTransData[i].experimental.count})`
        const roundexAvg = $nuxt.ncctRound(fateTransData[i].experimental.mean)
        exavg = `${roundexAvg} ${excount}`
        exmedian = $nuxt.ncctRound(fateTransData[i].experimental.median)
        exrange = fateTransData[i].experimental.range
      }
      if (fateTransData[i].predicted) {
        predcount = `(${fateTransData[i].predicted.count})`
        const roundpredAvg = $nuxt.ncctRound(fateTransData[i].predicted.mean)
        predavg = `${roundpredAvg} ${predcount}`
        predmedian = $nuxt.ncctRound(fateTransData[i].predicted.median)
        predrange = fateTransData[i].predicted.range
      }
      summaryData.push({
        property: fateTransData[i].name,
        propId: fateTransData[i].arrKey,
        exavg: exavg,
        predavg: predavg,
        exmedian: exmedian,
        predmedian: predmedian,
        exrange: exrange,
        predrange: predrange,
        unit: fateTransData[i].unit,
      })
    })

    return summaryData
  },

  getActiveItem: state => (input) => {
    // Filter and sort results by user input and click.
    const item = state.fateTransport[input]
    return item
  },

  getMiniSummaryData: state => (whichFateTrans) => {
    const items = state.fateTransport.find(obj => obj.arrKey === whichFateTrans)
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
