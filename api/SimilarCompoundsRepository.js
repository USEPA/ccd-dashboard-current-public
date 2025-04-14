/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
import FakeSimilarCompoundsRepository from '~/api/mocks/FakeSimilarCompoundsRepository';

class AxiosSimilarCompoundsRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  async count(params) {
    let count = 0;
    try {
      count = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.SIMILAR_COMPOUNDS_API}count-by-dtxcid/${params}`);
      return count;
    } catch (err) {
      return count;
    }
  }

  async search(params) {
    const paramString = `${params}`;
    let results = [];
    try {
      results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.SIMILAR_COMPOUNDS_API}by-dtxcid/${paramString}`);
      return results;
    } catch (err) {
      return err;
    }
  }
}

export default class SimilarCompoundsRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  build() {
    return process.env.NODE_ENV === 'local' ?
      new FakeSimilarCompoundsRepository() :
      new AxiosSimilarCompoundsRepository(this.axios, this.settings);
  }
}
