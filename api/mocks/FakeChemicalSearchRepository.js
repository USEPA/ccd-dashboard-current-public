/* eslint-disable no-else-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */

export default class FakeChemicalSearchRepository {

  async startsWith(params) {
    console.log('Fake Chemical Search repo (starts with): ', params)

    return Promise.resolve(
      [
        {
          id: 1600517,
          dtxsid: 'DTXSID7020182',
          searchMatch: 'CAS-RN',
          searchWord: '80-05-7',
          modifiedValue: '80 05 7',
          rank: 5,
        },
        {
          id: 5736063,
          dtxsid: 'DTXSID201015347',
          searchMatch: 'Integrated Source CAS-RN',
          searchWord: '80-05-7',
          modifiedValue: '80 05 7',
          rank: 17,
        },
        {
          id: 5736069,
          dtxsid: 'DTXSID201015349',
          searchMatch: 'Integrated Code',
          searchWord: '80-05-7',
          modifiedValue: '80 05 7',
          rank: 23,
        },
      ]
    )
  }

  async matchesExactly(params) {
    console.log('Fake Chemical Search repo (matches exactly): ', params)

    if (params === 'S1') {
      return Promise.resolve(
        [
          {
            id: 1600517,
            dtxsid: 'DTXSID7020182',
            searchMatch: 'Exact match result Z :)',
            searchWord: '80-05-7',
            modifiedValue: '80 99 9',
            rank: 5,
          },
        ]
      )
    } else {
      return Promise.resolve(
        [
          {
            id: 1600517,
            dtxsid: 'DTXSID7020182',
            searchMatch: 'Exact match result A :)',
            searchWord: '80-99-9',
            modifiedValue: '80 99 9',
            rank: 5,
          },
          {
            id: 1600517,
            dtxsid: 'DTXSID7020182',
            searchMatch: 'Exact match result B :)',
            searchWord: '80-88-9',
            modifiedValue: '80 88 9',
            rank: 5,
          },
        ]
      )
    } 
  }
}
