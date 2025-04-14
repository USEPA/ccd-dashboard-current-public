export default {
  getProperties: state => () => state.properties,
  getLoading: state => () => state.loading,
  getFiltered: state => () => state.filtered,
  getPredictionGridDefs: state => () => state.predictionGridDefs,
  getPredictionExportColDefs: state => () => state.exportColDefs,
  getPredictions: state => () => {
    const returnArray = []
    const {filtered} = state
    if (state.pred.endpoints) {
      state.pred.endpoints.map((endpoint) => {
        const r = {}
        const method = endpoint.methods
        r.property = endpoint.name
        //environmental value
        if (method.ev.active !== null) {
          r.ev = method.ev.active
        } else if (method.ev.molarLog === null && method.ev.mass === null ) {
          r.ev = ''
        } else if (method.ev.molarLog === null && method.ev.mass !== null) {
          r.ev = `${method.ev.mass} ${method.ev.massUnit}`
        } else if (method.ev.molarLog !== null && method.ev.mass === null) {
          r.ev = `${method.ev.molarLog} ${method.ev.molarLogUnit}`
        } else {
          r.ev = `${method.ev.molarLog} ${method.ev.molarLogUnit} ${method.ev.mass} ${method.ev.massUnit}`
        }
        //consensus
        const consensusLink = `https://comptox.epa.gov/dashboard/web-test/report?id=${method.consensus.id}&endpoint=${endpoint.code}&method=consensus&type=html`
        if (method.consensus.active !== null) {
          r.consensus = {
            name: method.consensus.active,
            link: consensusLink,
          }
        } else if (method.consensus.molarLog === null && method.consensus.mass === null) {
          r.consensus = {
            name: null,
            link: null,
          }
        } else if (method.consensus.molarLog === null && method.consensus.mass !== null) {
          r.consensus = {
            name: `${method.consensus.mass} ${method.consensus.massUnit}`,
            link: consensusLink,
          }
        } else if (method.consensus.molarLog !== null && method.consensus.mass === null) {
          r.consensus = {
            name: `${method.consensus.molarLog} ${method.consensus.molarLogUnit}`,
            link: consensusLink,
          }
        } else {
          r.consensus = {
            name: `${method.consensus.molarLog} ${method.consensus.molarLogUnit} ${method.consensus.mass} ${method.consensus.massUnit}`,
            link: consensusLink,
          }
        }

        //Hierachical clustering
        if (method.hc.active !== null) {
          r.hc = method.hc.active
        } else if (method.hc.molarLog === null && method.hc.mass === null) {
          r.hc = ''
        } else if (method.hc.molarLog === null && method.hc.mass !== null) {
          r.hc = `${method.hc.mass} ${method.hc.massUnit}`
        } else if (method.hc.molarLog !== null && method.hc.mass === null) {
          r.hc = `${method.hc.molarLog} ${method.hc.molarLogUnit}`
        } else {
          r.hc = `${method.hc.molarLog} ${method.hc.molarLogUnit} ${method.hc.mass} ${method.hc.massUnit}`
        }

        //single model
        if (method.sm.active !== null) {
          r.sm = method.sm.active
        } else if (method.sm.molarLog === null && method.sm.mass === null) {
          r.sm = ''
        } else if (method.sm.molarLog === null && method.sm.mass !== null) {
          r.sm = `${method.sm.mass} ${method.sm.massUnit}`
        } else if (method.sm.molarLog !== null && method.sm.mass === null) {
          r.sm = `${method.sm.molarLog} ${method.sm.molarLogUnit}`
        } else {
          r.sm = `${method.sm.molarLog} ${method.sm.molarLogUnit} ${method.sm.mass} ${method.sm.massUnit}`
        }

        //group contribution
        if (method.gc.active !== null) {
          r.gc = method.gc.active
        } else if (method.gc.molarLog === null && method.gc.mass === null) {
          r.gc = ''
        } else if (method.gc.molarLog === null && method.gc.mass !== null) {
          r.gc = `${method.gc.mass} ${method.gc.massUnit}`
        } else if (method.gc.molarLog !== null && method.gc.mass === null) {
          r.gc = `${method.gc.molarLog} ${method.gc.molarLogUnit}`
        } else {
          r.gc = `${method.gc.molarLog} ${method.gc.molarLogUnit} ${method.gc.mass} ${method.gc.massUnit}`
        }

        //nearest neighbor
        if (method.nn.active !== null) {
          r.nn = method.nn.active
        } else if (method.nn.molarLog === null && method.nn.mass === null) {
          r.nn = ''
        } else if (method.nn.molarLog === null && method.nn.mass !== null) {
          r.nn = `${method.nn.mass} ${method.nn.massUnit}`
        } else if (method.nn.molarLog !== null && method.nn.mass === null) {
          r.nn = `${method.nn.molarLog} ${method.nn.molarLogUnit}`
        } else {
          r.nn = `${method.nn.molarLog} ${method.nn.molarLogUnit} ${method.nn.mass} ${method.nn.massUnit}`
        }
        if (!filtered.includes(endpoint.code)) {
          returnArray.push(r)
        }
      })
      state.loading = false
    }
    return returnArray
  },
}
