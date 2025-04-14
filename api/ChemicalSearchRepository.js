/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
import FakeChemicalSearchRepository from '~/api/mocks/FakeChemicalSearchRepository';
import ChemicalTranslator from '~/api/translators/ChemicalTranslator';

class AxiosChemicalSearchRepository {
  constructor(axios, settings, chemicalTranslator) {
    this.axios = axios;
    this.chemicalTranslator = chemicalTranslator;
    this.settings = settings;
  }

  async startsWith(searchTerm) {
    try {
      const chemList = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.PUBLIC_CHEMICAL_SEARCH_API
      }${encodeURIComponent(searchTerm)}?top=30`, {
        timeout: 18000,
      });
      const searchList = chemList.map(chem => ({
        dtxsid: chem.dtxsid,
        dtxcid: chem.dtxcid,
        searchMatch: chem.searchName,
        rank: chem.rank,
        hasStructureImage: chem.hasStructureImage,
        searchWord: chem.searchValue,
      }
      ));
      return searchList;
    } catch (error) {
      return JSON.stringify(error.response);
    }
  }


  async chemListStartsWith(searchTerm, chemicalList, sentry) {
    const chemList = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICALLIST_STARTS_WITH}${chemicalList}/${encodeURIComponent(searchTerm)}`, {
      timeout: 20000,
    });
    try {
      return chemList;
    } catch (error) {
      sentry.captureException(`chemical search chemListStartsWith api call failed - specific error is ${error}`);
      return error;
    }
  }

  async chemListContains(searchTerm, chemicalList, sentry) {
    try {
      const chemList = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICALLIST_CONTAIN}${chemicalList}/${encodeURIComponent(searchTerm)}`, {
        timeout: 20000,
      });
      return chemList;
    } catch (error) {
      sentry.captureException(`chemical search chemListContains api call failed - specific error is ${error}`);
      return null;
    }
  }

  async equalsDetails(params, sentry) {
    try {
      const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_EQUALS_DETAILS_API}${encodeURIComponent(params)}`);
      return results;
    } catch (e) {
      sentry.captureException(`chemical search equalsDetails api call failed - specific error is ${e.response}`);
      return e.toString();
    }
  }

  async equals(params, sentry) {
    try {
      const results = await this.axios.$get(`${process.env.APPLICATION_PUBLIC_API}${this.settings.CHEMICAL_SEARCH_EQUALS_DETAILS}${encodeURIComponent(params)}?projection=ccdsearchresult`);
      return results;
    } catch (error) {
      return [];// JSON.stringify(error.response);
    }
  }

  matchesExactly(params, sentry) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_EXACT_API}${encodeURIComponent(params)}`)
      .then(data => data)
      .catch((error) => {
        sentry.captureException(`chemical search matchesExactly api call failed - specific error is ${error.response}`);
        if (error.response.status === 400) { return []; }
        throw (error);
      });
  }

  async containsDetails(params, sentry) {
    let results = [{message: 'Too many results'}];
    try {
      results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_CONTAIN_DETAILS_API}${encodeURIComponent(params)}`, {
        timeout: 20000,
      });
      return results;
    } catch (error) {
      sentry.captureException(`chemical search containsDetails api call failed - specific error is ${JSON.stringify(error)}`);
      return results;
    }
  }

  startsWithDetails(params) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_STARTS_WITH_DETAILS_API}${encodeURIComponent(params)}`);
  }

  containsDtxsid(searchTerm, chemicalList) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_CONTAIN_DTXSID_API}${encodeURIComponent(searchTerm)}`, {
      params: {
        list: chemicalList,
      },
    });
  }

  async msReadySearchByDtxcid(id, sentry) {
    try {
      const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.MSREADY_SEARCH_API}`, {
        params: {
          id,
        },
      });
      return results.data;
    } catch (error) {
      let errorType = null;
      if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
        errorType = 'response';
      }
      if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
        errorType = 'request';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorType = 'other';
      }
      sentry.captureException(`chemical search msReadySearchByDtxcid api call failed - error type: ${errorType} error: ${error.toString()}`);
    }
  }

  async massSearch(params, context) {
    try {
      const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_MASS_API}${params}`, {
        timeout: 20000,
      });
      const translatedData = this.chemicalTranslator.translate(results.content, (results.pageable.pageNumber * 1000) + 1);
      const responseChunk = {
        content: translatedData,
        paging: results.pageable,
        totalPages: results.totalPages,
      };
      return responseChunk;
    } catch (error) {
      const responseChunk = {
        content: [],
        paging: {},
        totalPages: 0,
        error: `${this.settings.BASE_ERROR_MESSAGE} ${error.message}`,
      };
      return responseChunk;
    }
  }

  async containsFormulaSearch(params) {
    try {
      const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMCIAL_SEARCH_CONTAINS_FORMULA_API}${params.formula}`);
      // return results
      const translatedData = this.chemicalTranslator.translate(results, params.currentCount);

      const responseChunk = {
        currentCount: params.currentCount + results.length,
        content: translatedData,
      };
      return responseChunk;
    } catch (error) {
      const responseChunk = {
        currentCount: 0,
        content: [],
        error: `${this.settings.BASE_ERROR_MESSAGE} ${error.message}`,
      };
      return responseChunk;
    }
  }

  async msReadySearch(params) {
    try {
      const results = await this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_MSREADY_API}${params.formula}`);
      // return results
      const translatedData = this.chemicalTranslator.translate(results, params.currentCount);

      const responseChunk = {
        currentCount: params.currentCount + results.length,
        content: translatedData,
      };
      return responseChunk;
    } catch (error) {
      const responseChunk = {
        currentCount: 0,
        content: [],
        error: `${this.settings.BASE_ERROR_MESSAGE} ${error.message}`,
      };
      return responseChunk;
    }
  }

  async exactFormulaSearch(params) {
    try {
      const url = `${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_EXACT_FORMULA_API}${params}`;
      const results = await this.axios.$get(url);
      return results;
    } catch (error) {
      return error;
    }
  }

  count(params) {
    const results = this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_COUNT_API}${params}`);
    return results;
  }

  formulaCount(params) {
    const results = this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_FORMULA_COUNT_API}${params}`);
    return results;
  }

  formulaRange(params) {
    const results = this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.CHEMICAL_SEARCH_FORMULA_RANGE}${params}`);
    return results;
  }
}

export default class ChemicalSearchRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  build() {
    return process.env.NODE_ENV === 'local' ?
      new FakeChemicalSearchRepository() :
      new AxiosChemicalSearchRepository(this.axios, this.settings, new ChemicalTranslator());
  }
}
