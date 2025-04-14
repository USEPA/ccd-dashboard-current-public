/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import downloads from '~/assets/fixtures/downloads.json'

export const actions = {
  fetchDownloads(vuexContext) {
    const response = downloads
    const arr = response.data
    vuexContext.commit('setDownloads', arr)
  },
  async asyncDownloads(vuexContext, context) {
    let errorObj = {}
    try {
      const result = await context.app.$repositories.downloads.index('?size=100')
      // console.log('downloards: ', result._embedded.downloads)
      vuexContext.commit('setDownloads', result._embedded.downloads)
    } catch (e) {
      console.log('downloads-error: ', e)
      if (e.response) {
        errorObj = {
          error: e.response,
        }
      } else {
        errorObj = e
      }
      console.log('downloads-error: ', errorObj)
      // eslint-disable-next-line no-console
      // console.log('error in downloads: ', errorObj)
      vuexContext.dispatch('fetchDownloads')
    }
  },
}

export const mutations = {
  setDownloads(state, downloadsArr) {
    state.downloadsList = downloadsArr
  },
  add(state, {
    downloadItem,
  }) {
    state.downloads.push(downloadItem)
  },
}

export const getters = {
  getDownloads(state) {
    return state.downloadsList
  },
  getFiltered: state => (order, input) => {
    let computed = [...state.downloadsList]
    // Filter and sort results by user input and click.
    if (input !== '') {
      computed = computed.filter(dl => dl.longDescription.toLowerCase().includes(input.toLowerCase()) ||
        dl.name.toLowerCase().includes(input.toLowerCase()))
    }

    if (order === 'desc') {
      computed = computed.sort((a, b) => (a.lastModifiedDate > b.lastModifiedDate ? -1 : 1))
    }
    if (order === 'asc') {
      computed = computed.sort((a, b) => (a.lastModifiedDate > b.lastModifiedDate ? 1 : -1))
    }

    return computed
  },
}

export const state = () => ({
  downloadsList: [],
})
