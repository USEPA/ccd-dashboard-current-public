/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import synonymFix from '~/assets/fixtures/synonyms.json'

export const actions = {
  loadSynonyms({commit}, synonymsObj) {
    if (typeof (synonymsObj) === 'object') {
      commit('setSynonyms', synonymsObj)
    } else {
      commit('setSynonyms', synonymFix)
    }
  },
}

export const mutations = {
  setSynonyms(state, synonymsObject) {
    state.synonyms = synonymsObject
  },
}

export const getters = {
  getSynonyms: state => () => state.synonyms,
  getSynonymGridDefs: state => () => state.synonymGridDefs,
  getExportColDefs: state => () => state.exportColDefs,
}

export const state = () => ({
  synonyms: [],
  synonymGridDefs: [
    {
      headerName: 'Synonym',
      field: 'synonym',
      width: 400,
      flex: 1,
      filter: 'agTextColumnFilter',
      cellRenderer: 'SynonymRenderer',
    },
    {
      headerName: 'Quality',
      field: 'quality',
      filter: 'agTextColumnFilter',
      cellRenderer: 'SynonymQualityRenderer',
      width: 200,
    },
  ],
  exportColDefs: [
    {
      header: 'Synonym',
      key: 'synonym',
      width: 40,
    }, {
      header: 'Quality',
      key: 'quality',
      width: 10,
    },
  ],
})
