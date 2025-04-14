import helpTextsJSON from '~/assets/fixtures/helpTexts.json'

export default class FakeHelpTextsRepository {

  async index(params) {
    console.log("Fake Help Text repo: ", params)
    
    return Promise.resolve(helpTextsJSON)
  }

}
