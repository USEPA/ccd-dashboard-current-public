/* eslint-disable no-unused-vars */


function createVendorList(endpoints) {
  const checked = [];
  const vendors = [];
  endpoints.map((v) => {
    if (!checked.includes(v.vendorKey)) {
      checked.push(v.vendorKey);
      vendors.push({vendorShort: v.vendorKey, vendorFull: v.vendorName});
    }
  });

  return vendors.sort((a, b) => ((a.vendorFull > b.vendorFull) ? 1 : -1));
}

export default {

  async asyncAssayEndpoints(vuexContext, context) {
    let errorObj = {};
    try {
      const response = await context.app.$repositories.assay.endpointLists('?size=5000', context.$sentry);
      const vendorArray = response._embedded.assayLists;
      const vendors = createVendorList(vendorArray);

      vuexContext.commit('setAssayEndpoints', vendorArray);
      vuexContext.commit('setAssayVenders', vendors);
    } catch (e) {
      if (e.response) {
        errorObj = {
          e: e.response,
        };
      } else {
        errorObj = e;
      }
      // eslint-disable-next-line no-console
      context.$sentry.captureException(`assay lists api call failed in vuex - specific error is ${JSON.stringify(errorObj)}`);
      console.error('assay list fail - ', JSON.stringify(errorObj));
    }
  },
};
