import downloadsJSON from '~/assets/fixtures/downloads.json'

export default class FakeDownloadsRepository {

  async index(params) {
    console.log("Fake Downloads repo: ", params)
    
    return Promise.resolve({
      _embedded: {
        downloads: downloadsJSON
      }
    })
  }

}
