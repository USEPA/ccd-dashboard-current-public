/* eslint-disable no-param-reassign */
export default {
  setFateTransport(state, fateTrans) {
    const ftArray = []
    Object.keys(fateTrans).forEach((key) => {
      const arrItem = fateTrans[key]
      arrItem.arrKey = arrItem.name.replace(/\./g, ' ').replace(/|:|'|/gi, '').replace(/ /gi, '_').toUpperCase()
      if (arrItem.experimental) {
        if (arrItem.experimental.rawData) {
          arrItem.experimental.rawData.map((rd) => {
            const exD = rd.experimentalDetails[0]
            const xdString = `Species: ${exD.species}; Response Site:  ${exD.responseSite}`
            rd.experimentalDetails = xdString
          })
        }
      }
      if (arrItem.predicted) {
        // push the gsid into the array for use in opera link
        if (arrItem.predicted.rawData) {
          arrItem.predicted.rawData.map((rd) => {
            rd.gsid = state.gsid
          })
        }
      }
      ftArray.push(arrItem)
    })
    state.fateTransport = ftArray
  },
  setGsid(state, gsid) {
    state.gsid = gsid
  },
}
