import news from '~/assets/fixtures/news.json'

export const actions = {
  fetchNews(vuexContext, context) {
    const response = news
    const arr = response
    vuexContext.commit('setNews', arr)
  },
  async asyncNews(vuexContext, context) {
    let errorObj = {}
    try {
      const result = await context.app.$repositories.news.index('?size=100')
      // console.log('news: ', result._embedded.news)
      vuexContext.commit('setNews', result._embedded.news)
      // console.log('news-success: ', result)
    } catch (e) {
      console.log('news-error: ', e)
      errorObj = e
      vuexContext.dispatch('fetchNews')
    }
  },
}

export const mutations = {
  setNews(state, newsItems) {
    state.newsItems = newsItems
  },
}

export const getters = {
  getNews(state) {
    // Return sorted by date desc news items by default.
    let computed = [...state.newsItems]
    return computed
  },
  getFiltered: state => (order, input) => {
    let computed = [...state.newsItems]
    // Filter and sort results by user input and click.
    if (input !== '') {
      computed = computed.filter(anews => String(anews.title).toLowerCase().includes(input.toLowerCase()) ||
        String(anews.body).toLowerCase().includes(input.toLowerCase()))
    }

    if (order === 'desc') {
      computed = computed.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1))
    }
    if (order === 'asc') {
      computed = computed.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1))
    }

    return computed
  },
  getHeadline: state => () => {
    let headline = [...state.newsItems]
    // Filter and sort results by user input and click.
    headline = state.newsItems.filter(anews => anews.admin === 'headline-admin' )
    return headline[0]
  },
}

export const state = () => ({
  newsItems: [],
})
