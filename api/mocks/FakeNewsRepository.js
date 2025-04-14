import newsJSON from '~/assets/fixtures/news.json'

export default class FakeNewsRepository {

  async index(params) {
    console.log("Fake News repo: ", params)
    
    return Promise.resolve({
      _embedded: {
        news: newsJSON
      }
    })
  }

}
