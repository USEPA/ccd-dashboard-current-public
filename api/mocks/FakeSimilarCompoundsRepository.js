/* eslint-disable no-else-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import similarCompoundsJSON from '~/assets/fixtures/similarCompounds.json'

export default class FakeSimilarCompoundsRepository {

  async count(params) {
    return Promise.resolve( {
      similarCompounds: 430,
      tanimoto: 0.8,
    },)
  }

  async search(params, tanimoto) {
    console.log('Fake Similar Compounds repo (search): ', params, tanimoto)

    return Promise.resolve(similarCompoundsJSON)
  } 
}
