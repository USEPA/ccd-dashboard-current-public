/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import {search} from 'core-js/fn/symbol';
import chemicalResults from '~/assets/fixtures/multipleResults.json';
import assayChemicals from '~/assets/fixtures/assayEndpointChemicals.json';

export default {
  fetchChemicals(vuexContext, list) {
    switch (list) {
    case 'chemicallists':
      vuexContext.commit('setChemicals', chemicalResults.chemicals);
      break;
    case 'assayChemicals':
      vuexContext.commit('setChemicals', assayChemicals.chemicals);
      break;
    default:
      vuexContext.commit('setChemicals', chemicalResults.chemicals);
    }
  },
  async asyncChemicalListsDetails(vuexContext, context) {
    const errorObj = {};

    try {
      const response = await this.$repositories.chemicalList.index('?name=AEGLVALUES');
      const arr = response._embedded.chemicalListDetails;
      vuexContext.commit('setChemicals', [c]);
    } catch (e) {
      if (e.response && (e.response.status !== 404)) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
      vuexContext.dispatch('fetchChemicals');
    }
  },
  async asyncChemicalLists(vuexContext, context) {
    let errorObj = {};
    try {
      const response = await context.app.$repositories.chemicalList.index('?size=1000');
      const arr = response._embedded.chemicalLists;
      vuexContext.commit('setChemicalLists', arr);
    } catch (e) {
      if (e.response && (e.response.status !== 404)) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
      vuexContext.dispatch('fetchLists');
    }
  },
  async asyncActiveChemical(vuexContext, context) {
    let errorObj = {};
    let searchString = '';
    let returnObj = [];
    // set up the similarData object
    const similarData = {
      similarCount: {
        similarCompounds: 0,
        tanimoto: 0.8,
      },
      connectivity: [],
    };
    // set up the search string for the chemical
    if (context.params.id) {
      // if id is passed check value and return the current chemical
      if (context.params.id.includes('DTXSID') || context.params.id.includes('DTXCID')) {
        const currentChem = context.app.store.state.results.activeChemical;
        if (!Array.isArray(currentChem)) {
          returnObj = currentChem;
        }
      }
      searchString = context.params.id;
    }
    if (context.route.query.search && context.route.query.model_id) {
      const {query} = context.app.router.history.current;
      const dtxsid = context.app.router.app.id2dtxid('S', query.search);
      searchString = dtxsid;
    }
    try {
      if (searchString.length) {
        const chemical = await context.app.$repositories.chemicalDetails.find(searchString);
        // check if the chemical object has returned - it won't be an array then copy values to specific named params
        if (!Array.isArray(chemical)) {
          chemical.gsid = chemical.genericSubstanceId;
          chemical.dtxsid = chemical.dsstoxSubstanceId;
          chemical.dtxcid = chemical.dsstoxCompoundId;
          chemical.hasStructureImage = chemical.compoundId || null;
          chemical.similarData = similarData;
          chemical.disabledTabData = similarData;
          if (chemical.smiles) {
            try {
              // get the actual similarData count to populate the object
              const encoded = encodeURIComponent(chemical.smiles);
              similarData.similarCount = await context.app.$repositories.similarCompounds.count(`${chemical.dsstoxCompoundId}/?smiles=${encoded}`);
            } catch (err) {
              console.error('error: ', err);
            }
          }
          if (chemical.inchiKey) {
            try {
              // get the actual similarData connectivity to populate the object
              const skeleton = chemical.inchiKey.substr(0, chemical.inchiKey.indexOf('-'));
              chemical.similarData.connectivity = await context.app.$repositories.sameConnectivityCount.search(`/${skeleton}`);
            } catch (err) {
              console.error('error calling same connectivity', err);
              return err;
            }
          }
          chemical.disabledTabData = chemical.similarData;
          chemical.presenceInLists = await vuexContext
            .dispatch('chemicalLists/getPresenceInLists', {context, dtxsid: chemical.dtxsid}, {root: true});
        }
        returnObj = chemical;
        vuexContext.commit('setActiveChemical', chemical);
        const tabs = await vuexContext.dispatch('tabs/loadTabs', context, {root: true});
        return chemical;
      }
    } catch (e) {
      if (e.response && (e.response.status !== 404)) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
      this.$sentry.captureMessage(`error retrieving data for  ${searchString} specific error is ${errorObj}`);
    }
    return returnObj;
  },
  actHeaderReady(vuexContext, ready) {
    vuexContext.commit('setHeaderReady', ready);
  },
  actLeftNavReady(vuexContext, ready) {
    vuexContext.commit('setLeftNavReady', ready);
  },
};
