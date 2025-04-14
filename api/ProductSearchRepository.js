/* eslint-disable import/extensions */
/* eslint-disable max-classes-per-file */
class AxiosProductSearchRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  productsStartWith(searchTerm) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.PRODUCT_SEARCH_API}${searchTerm}`,).then(data => data)
      .catch((error) => {
        if (error.response.status === 400) { return []; }
        throw (error);
      });
  }

  chemicalsByProduct(searchTerm, chemicalList) {
    return this.axios.$get(`${process.env.APPLICATION_BASE_API}${this.settings.PRODUCT_SEARCH_EXACT_API}${searchTerm}`, {
      params: {
        list: chemicalList,
      },
    }).then(data => data)
      .catch((error) => {
        if (error.response.status === 400) { return []; }
        throw (error);
      });
  }
}

export default class ProductSearchRepository {
  constructor(axios, settings) {
    this.axios = axios;
    this.settings = settings;
  }

  build() {
    return new AxiosProductSearchRepository(this.axios, this.settings);
  }
}
