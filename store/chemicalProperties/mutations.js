/* eslint-disable no-param-reassign */
export default {
  setPropertiesData(state, properties) { 
    properties.map((item) => {
      item.arrKey = item.name.replace(/|:|.|'|/gi, '').replace(/ /gi, '_').toUpperCase()
      return item
    })
    state.propertyData = properties
  },
  setPropertySelection(state, selection) {
    state.propertySelection = selection
  },
}
