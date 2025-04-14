/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import defaultTabs from '@/assets/fixtures/tabs.json';

export const actions = {
  async loadTabs(vuexContext, context) {
    let qs = '';
    if (context.route.params.id && context.route.query.list) {
      qs = `${context.route.params.id}?list=${context.route.query.list}`;
    } else {
      qs = `${context.route.params.id}`;
    }
    let errorObj = {};
    try {
      const result = await context.app.$repositories.tabs.find(qs);
      vuexContext.commit('setActiveTabs', result);
      return result;
    } catch (e) {
      if (e.response) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
      const message = `Error retrieving left navigation for ${context.route.params.id}. Default tabs have been loaded - API error: ${errorObj.message}`;
      this.$sentry.captureMessage(`${message}`);
      vuexContext.commit('setActiveTabs', defaultTabs);
      vuexContext.commit('setError', message);
      return errorObj;
    }
  },
};

export const mutations = {
  setTabs(state, tabsArr) {
    state.tabsList = tabsArr;
  },
  setError(state, message) {
    state.isError = message;
  },
  setActiveTabs(state, tabsArr) {
    let itemCat = 'none';
    let preFix = '';
    let newItem = null;
    const baseTabs = [];
    tabsArr.map((tb, id) => {
      if (tb.url && (tb.category !== itemCat)) {
        newItem = tb;
        itemCat = tb.category || tb.label;
        baseTabs.push(newItem);
      }
      if (tb.category === 'adme' || tb.category === 'safety') {
        itemCat = tb.category || tb.label;
        if (!tb.url) {
          preFix = `${tb.labelDisplay} > `;
        }
        if (tb.url && (tb.category === itemCat)) {
          newItem = [];
          newItem.push(tb);
          newItem[0].url = tb.url;
          newItem[0].disable = tb.disable;
          newItem[0].labelDisplay = `${preFix} ${tb.labelDisplay}`;
          baseTabs.push(newItem[0]);
        }
      } else if (!tb.url && (tb.category !== itemCat)) {
        itemCat = tb.category;
        newItem = tb;
        newItem.subTabs = [];
        tabsArr.map((tb) => {
          if (tb.url && (tb.category === itemCat)) {
            newItem.subTabs.push(tb);
          }
        });
        baseTabs.push(newItem);
      }
    });
    state.tabsList = baseTabs;
  },
};

export const getters = {
  getError(state) {
    return state.isError;
  },
  getTabs(state) {
    return state.tabsList;
  },
  getTablist: state => (selected) => {
    let tablist = [...state.tabsList];
    if (selected !== '') {
      tablist = tablist.filter(tl => tl.id.toLowerCase() === selected.toLowerCase());
      return tablist[0].tabs;
    }
    return tablist[0].tabs;
  },
};

export const state = () => ({
  tabsList: [],
  isError: false,
});
