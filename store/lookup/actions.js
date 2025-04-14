/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
export default {
  searchByIds(context, payload) {
    context.commit('LOOKUP_SET_STATUS', {...state.status, pending: true})

    return Axios.post(RESOLVER_URL, {ids: payload.identifiers}, {timeout: 10 * 1000})
      .then((response) => {
        response.data.forEach(item => item.checked = true)
        context.commit('LOOKUP_SET_RESULT', response.data)

        context.commit('LOOKUP_SET_STATUS', {
          ...state.status,
          pending: false,
          resolved: true,
          rejected: false,
          err: null,
        })
      })
      .catch((error) => {
        const errorMessage = error && error.message ? error.message : 'Something went wrong.'
        context.commit('LOOKUP_SET_STATUS', {
          ...state.status,
          pending: false,
          rejected: true,
          err: errorMessage,
        })
      })
  },

  searchBySss(context, payload) {
    context.commit('LOOKUP_SET_STATUS', {...state.status, pending: true})

    try {
      Axios.post(SSS_LOOKUP_URL, payload, {timeout: 10 * 1000})
        .then((response) => {
          const bingoData = response.data.slice(0)
          bingoData.forEach(item => item.checked = true)

          Axios.post(RESOLVER_URL, {ids: bingoData.map(i => i.sid)}, {timeout: 10 * 1000})
            .then((response) => {
              response.data.forEach((newStr) => {
                const str = bingoData.find(s => s.sid === newStr.sid)
                str.id = newStr.id
                str.casrn = newStr.casrn
                str.name = newStr.name
                str.smiles = newStr.smiles
              })

              context.commit('LOOKUP_SET_RESULT', bingoData)
            })
            .catch(() => {
            })

          context.commit('LOOKUP_SET_STATUS', {
            ...state.status,
            pending: false,
            resolved: true,
            rejected: false,
            err: null,
          })
        })
    } catch (error) {
      const errorMessage = error && error.message ? error.message : 'Something went wrong.'
      context.commit('LOOKUP_SET_STATUS', {
        ...state.status, pending: false, rejected: true, err: errorMessage,
      })
    }
  },
}
