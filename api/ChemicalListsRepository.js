/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
import FakeChemicalListsRepository from '~/api/mocks/FakeChemicalListsRepository';
import ChemicalTranslator from '~/api/translators/ChemicalTranslator';

class AxiosChemicalListsRepository {
  constructor(axios, settings, chemicalTranslator) {
    this.axios = axios;
    this.settings = settings;
    this.chemicalTranslator = chemicalTranslator;
    this.dateString = Date.now().toString(36);
  }

  index(params) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_LISTS_API}${params}?${this.dateString}`);
  }

  async index2(sentry) {
    try {
      const value = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICALLISTS_ALL}`);
      return value;
    } catch (err) {
      sentry.captureException(`chemical list api call failed - specific error is ${err.response} `);
      return err;
    }
  }

  async detailsDtxsids(params, sentry) {
    try {
      const response = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICALLIST_DETAILS_DTXSIDS}/${params}?projection=chemicallistwithdtxsids`);
      return response.dtxsids.split(',');
    } catch (err) {
      sentry.captureException(`chemical list details dtxsids api call failed - specific error is ${err.response} `);
      return err;
    }
  }

  async listDetailsDtxsids(payload, counter, sentry) {
    try {
      const response = await this.axios.$post(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICALLIST_DETAILS}`, payload);
      const chems = response.map((chem, idx) => ({
        ...chem, uuId: chem.id, displayName: chem.preferredName || chem.iupacName,
      }));
      return chems;
    } catch (err) {
      sentry.captureException(`chemical list details from dtxsids api call failed - specific error is ${err.response} `);
      return err;
    }
  }

  async chemicalPresenceInLists(dtxsid) {
    const response = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICAL_PRESENCE_LISTS}/${dtxsid}?projection=ccdchemicaldetaillists`);
    return response;
  }


  async details(params) {
    const response = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_LIST_DETAILS_API}${params}`);
    const translatedData = this.chemicalTranslator
      .translate(response._embedded.chemicalListDetails, (response.page.number * 1000) + 1);
    const responseChunk = {
      data: translatedData,
      paging: response.page,
    };
    return responseChunk;
  }
}

export default class ChemicalListsRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  build() {
    return process.env.NODE_ENV === 'local' ?
      new FakeChemicalListsRepository() :
      new AxiosChemicalListsRepository(this.axios, this.settings, new ChemicalTranslator());
  }
}
