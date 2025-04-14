import initialState from './state'

export default {

  LOOKUP_SET_RESULT(state, payload) {
    state.searchResult = payload
  },

  LOOKUP_SET_STATUS(state, payload) {
    state.status = payload
  },

  LOOKUP_SELECT_NONE(state) {
    state.searchResult = state.searchResult.map((s) => {
      s.checked = false
      return s
    })
  },

  LOOKUP_SELECT_ALL(state) {
    state.searchResult = state.searchResult.map((s) => {
      s.checked = true
      return s
    })
  },

  LOOKUP_INVERT_STRUCTURE(state, structure) {
    state.searchResult = state.searchResult.map((s) => {
      if (s.id === structure.id) {
        s.checked = !s.checked
      }
      return s
    })
  },
}
