/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

export default {
  getMetadata() {
    return axios({
      url: `${process.env.APPLICATION_BASE_API}ccdapp1/webtest/metadata`,
      transformResponse: [
        d => JSON.parse(d).map((provider) => {
          if (provider.code === 'TEST') {
            provider.methods.unshift({code: 'ev', name: 'Experimental Value'});
          }
          const categories = provider.endpoints.reduce((acc, ep) => {
            if (!(ep.category in acc)) {
              acc[ep.category] = [];
            }
            acc[ep.category].push(Object.assign(ep, {selected: true}));
            return acc;
          }, {});
          return {
            name: provider.name,
            categories: categories,
            code: provider.code,
            methods: provider.methods,
          };
        }),
      ],
    });
  },
  getStructure(cid) {
    const settings = window.$nuxt.apiSettings();
    return axios({
      url: `${process.env.APPLICATION_BASE_API}${settings.MOL_DOWNLOAD}${cid}?type=v2000`,
    });
  },
  predict(query, lookup) {
    return axios({
      method: 'post',
      url: `${process.env.APPLICATION_BASE_API}ccdapp1/webtest/predict?${Date.now().toString(36)}`,
      timeout: 10000,
      data: query,
      transformResponse: [
        d => JSON.parse(d).results.map((provider) => {
          const endpoints = [];
          const lookupProvider = lookup[provider.provider.software];
          return {
            provider,
            lookupProvider,
            endpoints,
          };
        }),
      ],
    });
  },
};
