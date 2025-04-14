/* eslint-disable no-undef */
/* eslint-disable no-shadow */
export default {
  async generateHazardReport(context, state, payload) {
    let status = {
      ...state.status, pending: true, resolved: false, rejected: false,
    }

    context.commit('SET_HAZARD_STATUS', status)

    const request = {}
    request.chemicals = payload.structures.map(s => ({
      chemicalId: s.sid || s.cid || s.casrn || s.smiles || s.inchiKey,
      props: {
        similarity: s.similarity,
      },
    }))

    if (state.profile) { request.hazardProfileId = state.profile.id }

    if (payload.cts) { request.cts = payload.cts }

    try {
      const {data} = await Axios.post(HAZARD_PREDICT_API, request)
      context.commit('SET_HAZARD_REPORT', data)

      status = {
        ...state.status, pending: false, resolved: true, rejected: false, err: null,
      }

      // scrollTo('#scores-table', 500, {easing: 'ease-in-out'})
    } catch (error) {
      const errorMessage = error && error.message ? error.message : 'Cannot get report data.'

      status = {
        ...state.status, pending: false, resolved: false, rejected: true, err: errorMessage,
      }
    }

    context.commit('SET_HAZARD_STATUS', status)
  },
}
