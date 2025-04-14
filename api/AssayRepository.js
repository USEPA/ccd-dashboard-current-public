/* eslint-disable max-classes-per-file */
/* eslint-disable import/extensions */
import FakeAssayRepository from '~/api/mocks/FakeAssayRepository';
import AssayTranslator from '~/api/translators/AssayTranslator';

class AxiosAssayRepository {
  constructor(axios, settings, assayTranslator) {
    this.axios = axios;
    this.settings = settings;
    this.assayTranslator = assayTranslator;
  }

  async endpointLists(params, sentry) {
    try {
      const value = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_LIST_API}${params}`);
      return value;
    } catch (err) {
      sentry.captureException(`assay lists api call failed in api repo - specific error is ${JSON.stringify(err)} `);
      return err;
    }
  }

  endpointDetailSearchByName(endpointName) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_ENDPOINT_DETAIL_SEARCH}`, {
      params: {
        name: endpointName,
      },
    });
  }

  assayGeneSearch(params) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_GENE_SEARCH_API}${params}`);
  }

  async assaySingleConcSearch(params) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_LIST_DETAILS_SINGLE_CONC_API}${params}`);
    return {data: response._embedded.assayListSingleConc, paging: response.page};
  }


  async listDetails(params) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.ASSAY_LIST_DETAILS_API}${params}`);
    const translatedData = this.assayTranslator.translate(response._embedded.assayListDetails, (response.page.number * 1000) + 1);
    const responseChunk = {
      data: translatedData,
      paging: response.page,
    };
    return responseChunk;
  }
}

export default class AssayRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  build() {
    return process.env.NODE_ENV === 'local' ?
      new FakeAssayRepository(new AssayTranslator()) :
      new AxiosAssayRepository(this.axios, this.settings, new AssayTranslator());
  }
}
