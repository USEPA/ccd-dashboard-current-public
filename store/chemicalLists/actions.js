/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */

export default {
  async getPresenceInLists(vuexContext, {context, dtxsid}) {
    try {
      const response = await context.app.$repositories.chemicalList
        .chemicalPresenceInLists(dtxsid);

      // https://jira.epa.gov/browse/CE-3918 -> These values used to come from old API response. Now they are hardcoded per requirements.
      const staticData = vuexContext.getters.getPresenceInListsStaticData();

      /**
       * Reformat response from API -> api response is a 2d array where each array is a list item.
       * eg(incoming format):
       * [[name, label, category, public, shortDescription, longDescription, id, createdAt, updatedAt]]
       * output format(organized by category):
       * [{label, name, shortDescription, order, lists: [{name, label, shortDescription}]}]
       */
      const translatedPresence = response.reduce((acc, cv) => {
        const category = cv[2];
        const currentCategories = acc.map(item => item.name);
        if (!currentCategories.includes(category)) {
          acc.push({
            label: staticData[category]?.label || '',
            lists: [],
            shortDescription: staticData[category]?.shortDescription || '',
            name: category,
            order: staticData[category]?.order || 0,
          });
        }
        const findUpdatingIdx = acc.findIndex(item => item.name === category);
        if (findUpdatingIdx >= 0) {
          acc[findUpdatingIdx].lists.push({
            label: cv[1],
            name: cv[0],
            shortDescription: cv[4],
          });
        }

        return acc;
      }, []).sort((a, b) => a.order - b.order);
      return translatedPresence;
    } catch (e) {
      return [];
    }
  },
  async asyncChemicalLists(vuexContext, context) {
    let errorObj = {};
    if (!Array.isArray(vuexContext.rootState.chemicalLists.chemicalLists) || vuexContext.rootState.chemicalLists.chemicalLists.length < 1) {
      try {
        const response = await context.app.$repositories.chemicalList.index2(context.$sentry);
        const arr = response;
        vuexContext.commit('setChemicalLists', arr);
        return arr;
      } catch (e) {
        if (e.response && (e.response.status !== 404)) {
          errorObj = {
            status: e.response,
          };
        } else {
          errorObj = e.response;
        }
        context.$sentry.captureException(`chemical list api call failed - specific error is ${errorObj} data fixture loaded`);
      }
    }
  },
};
