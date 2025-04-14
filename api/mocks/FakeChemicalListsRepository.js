import chemicalListsJSON from '~/assets/fixtures/chemicalLists.json'

export default class FakeChemicalListsRepository {

  async index(params) {
    console.log("Fake Chemical Lists repo: ", params)

    return Promise.resolve({
      _embedded: chemicalListsJSON
    })
  }

}
