/* eslint-disable no-restricted-syntax */
import api from '../../pages/predictions/api'

export default {
  async getMetadata({commit}) {
    let data
    try {
      data = await api.getMetadata()
    } catch {
      commit('fatalError', 'The prediction server could not be reached.')
    }
    commit('setproviders', data)
  },
  setKetcher({commit}, context) { 
    commit('setKetcher', context) 
  },
  async getStructure({commit}, cid) {
    let data
    try {
      data = await api.getStructure(cid)
    } catch (err) {
      commit('structureError', 'Could not get structure from server.')
    }
    commit('setStructure', data)
  },
  async predict({commit, state}, context) {
    const smiles = await state.ketcher.getSmilesAsync()
    const methods = [
      {
        code: 'ev',
        name: 'Experimental Value',
      },
      {
        code: 'consensus',
        name: 'Consensus',
      },
      {
        code: 'hc',
        name: 'Hierarchical Clustering',
      },
      {
        code: 'sm',
        name: 'Single Model',
      },  
      {
        code: 'gm',
        name: 'Group Contribution',
      },
      {
        code: 'nm',
        name: 'Nearest Neighbor',
      },
    ]
    
    if (smiles.length === 0) {
      commit('calculateError', 'There is no structure drawn.')
      return
    }
      
    commit('loadPredictions')
    const endpoints = []
    const lookup = {}
    const providers = []
    providers.push(state.providers)
    providers.forEach((provider) => {
      lookup[provider.code] = {
        name: provider.name,
        methods: methods,
        endpoints: {},
      }
      if (provider.categories) {
        // eslint-disable-next-line guard-for-in
        for (const category in provider.categories) {
          provider.categories[category].forEach((endpoint) => {
            lookup[provider.code].endpoints[endpoint.code] = endpoint.name
            endpoints.push({
              endpointCode: endpoint.code,
              providerCode: provider.code,
            })
          })
        }
      }
    })
    const ketcherQ = await state.ketcher.getMolfileAsync()
    const queryObj = {
      query: ketcherQ,
      queryType: 'MOL',
      endpoints: endpoints,
    }
    await api.predict(queryObj, lookup).then((response) => {
      if (response) {
        const {endpoints, lookupProvider, provider} = response.data[0]

        provider.results.forEach((result) => {
          let endpoint = endpoints.filter(e => e.code === result.endpoint)
          if (endpoint.length) {
            // eslint-disable-next-line prefer-destructuring
            endpoint = endpoint[0]
          } else {
            endpoint = {
              code: result.endpoint,
              name: lookupProvider.endpoints[result.endpoint],
              methods: {},
            }
            endpoints.push(endpoint)
          }
          // API returns experimental value on every predicted value...why?
          endpoint.methods.ev = {
            active: result.expActive,
            mass: result.expValMass,
            massUnit: result.massUnits,
            molarLog: result.expValMolarLog,
            molarLogUnit: result.molarLogUnits,
            url: null,
          }
          endpoint.methods[result.method] = {
            id: result.id,
            active: result.predActive,
            mass: result.predValMass,
            massUnit: result.massUnits,
            molarLog: result.predValMolarLog,
            molarLogUnit: result.molarLogUnits,
            url: result.reportUrl ? result.reportUrl.replace(/#/g, '%23') : null,
          }
        })

        const returnObj = {
          code: provider.provider.software,
          name: lookupProvider.name,
          endpoints: endpoints,
          methods: lookupProvider.methods,
        }

        commit('setPredictions', returnObj)
      }
    }).catch((resp) => {
      if (resp.code === 'ECONNABORTED') {
        commit('calculateError', 'Calculation timed out.')
      } else {
        commit('calculateError', 'Something went wrong.')
      }
    })
  },
}
