/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable unicorn/prefer-includes */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import Vue from 'vue';
import {format, compareAsc} from 'date-fns';
import {
  createPinia,
} from 'pinia';
import {useSettingsStore} from '~/stores/settings.ts';

const pinia = createPinia();
const settingsStore = useSettingsStore(pinia);
const settings = settingsStore.getSettings;

Vue.mixin({
  methods: {
    /** Parses a url and returns a key/value mapping of the query params
 * @param {String} url
 * @returns {Object.<String, String>}
    */
    getUrlParams(url) {
      const searchString = (new URL(url)).search;
      if (!searchString) {
        return {};
      }
      const params = searchString.slice(1).split('&');
      return params.reduce((map, param) => {
        const [key, value] = param.split('=');
        map[decodeURIComponent(key)] = decodeURIComponent(value);
        return map;
      }, {});
    },
    /** Create query params from an object's key/value pairs
     * @param {Object.<String, String>} params
     * @returns {string}
     */
    makeUrlParams(params) {
      return Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');
    },
    /** Returns an array of pairs of matched objects from two arrays of objects which have related keys
     * @param {Array.<Object>} a1
     * @param {Array.<Object>} a2
     * @param {String} a1Key
     * @param {String} [a2Key]
     * @returns {Array.<Array.<Object>>}
     */
    intersection(a1, a2, a1Key, a2Key = a1Key) {
      const intersected = [];
      const sorter = key => (a, b) => a[key] - b[key];
      const a1s = a1.slice().sort(sorter(a1Key));
      const a2s = a2.slice().sort(sorter(a2Key));
      const [smaller, larger, sKey, lKey] = a1.length <= a2.length ?
        [a1s, a2s, a1Key, a2Key] :
        [a2s, a1s, a2Key, a1Key];
      // Return the objects in the order they were passed
      const SLOrder = a1.length === smaller.length;
      let z = 0;
      for (let i = 0; i < smaller.length; i++) {
        while (z < larger.length && larger[z][lKey] <= smaller[i][sKey]) {
          if (smaller[i][sKey] === larger[z][lKey]) {
            if (SLOrder) {
              intersected.push([
                smaller[i],
                larger[z],
              ]);
            } else {
              intersected.push([
                larger[z],
                smaller[i],
              ]);
            }
          }
          z++;
        }
      }
      return intersected;
    },
    colormaps() {
      const colormaps = {
        inferno: [
          '#000004', '#03010c', '#070313', '#0a041b', '#0e0522', '#11072a', '#150831', '#180939', '#1c0b40',
          '#1f0c48', '#250c4c', '#2b0d50', '#310d54', '#370d58', '#3d0e5d', '#430e61', '#490e65', '#4f0f69',
          '#550f6d', '#5b116d', '#60136c', '#66156c', '#6c176c', '#711a6b', '#771c6b', '#7d1e6b', '#82206a',
          '#88226a', '#8e2468', '#932665', '#992963', '#9e2b61', '#a42d5e', '#a92f5c', '#af325a', '#b43457',
          '#ba3655', '#bf3a51', '#c33e4d', '#c8424a', '#cc4646', '#d14942', '#d54d3e', '#da513b', '#de5537',
          '#e35933', '#e65f2e', '#e96629', '#eb6c24', '#ee731f', '#f17919', '#f47f14', '#f6860f', '#f98c0a',
          '#f9930e', '#f99a13', '#f9a017', '#f9a71c', '#f9ae20', '#f9b525', '#f9bb29', '#f9c22e', '#f9c932',
          '#f9cf3f', '#fad54b', '#fadb58', '#fae165', '#fbe771', '#fbed7e', '#fbf38b', '#fcf997', '#fcffa4',
        ],
      };
      return colormaps;
    },
    getBrowserInfo() {
      const ua = navigator.userAgent;
      let tem;
      let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE ', version: (tem[1] || '')};
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) { return {name: 'Opera', version: tem[1]}; }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
      return {
        name: M[0],
        version: M[1],
      };
    },
    apiSettings() {
      return settings;
    },
    getDeepLinkId(node) {
      if (node && node.nodeName !== 'BODY') {
        if (node.closest('.tab-pane')) {
          return ('#' + node.closest('.tab-pane').getAttribute('id'));
        } if (node.closest('div.panel-group[id="accordion"] div.panel-default')) {
          return ('#' + node.closest('div.panel-group[id="accordion"] div.panel-default').getAttribute('id'));
        }
        getDeepLinkId(node.parentNode);
      }
      return '';
    },
    /**
     * Gets an XPath for an element which describes its hierarchical location.
     * Credit to https://github.com/firebug/firebug/blob/master/extension/content/firebug/lib/xpath.js
     */
    getElementXPath(element) {
      if (element && element.id) {
        return '//*[@id="' + element.id + '"]';
      }
      return getElementTreeXPath(element);
    },
    getElementTreeXPath(element) {
      const paths = [];
      let el = element;
      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (; el && el.nodeType === Node.ELEMENT_NODE; el = el.parentNode) {
        let index = 0;
        let hasFollowingSiblings = false;
        let sibling;
        for (sibling = el.previousSibling; sibling; sibling = sibling.previousSibling) {
          // Ignore document type declaration.
          if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
            continue;
          }

          if (sibling.nodeName === el.nodeName) {
            ++index;
          }
        }

        for (sibling = el.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
          if (sibling.nodeName === el.nodeName) {
            hasFollowingSiblings = true;
          }
        }

        const tagName = (el.prefix ? el.prefix + ':' : '') + el.localName;
        const pathIndex = (index || hasFollowingSiblings ? '[' + (index + 1) + ']' : '');
        paths.splice(0, 0, tagName + pathIndex);
      }

      return paths.length ? '/' + paths.join('/') : null;
    },
    ncctChecksum(id) {
      return id.toString().split('').reduce((acc, x, i) => acc + x * (i + 1), 0) % 10;
    },
    id2dtxid(type, id) {
      return `DTX${type}ID${this.ncctChecksum(id)}0${id}`;
    },
    gsid2dtxsid(gsid) {
      return id2dtxid('S', gsid);
    },
    cid2dtxcid(cid) {
      return this.id2dtxid('C', cid);
    },
    shift(number, precision) {
      const numArray = ('' + number).split('e');
      return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + precision) : precision));
    },
    roundPrecision(number, precision) {
      return this.shift(Math.round(this.shift(number, +precision)), -precision);
    },
    dateFormat(date, dFormat) {
      if (!date) {
        date = new Date();
      }
      if (!dFormat) {
        dFormat = 'yyyy-MM-dd';
      }
      return format(date, dFormat);
    },
    countProperties(obj) {
      var count = 0;
      for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
          if (property !== 'headers' && property !== 'values') {
            count++;
          }
        }
      }
      return count;
    },
    typeMap() {
      const typeMap = {
        Excel: {ext: 'xls', mime: 'application/vnd.ms-excel'},
        TSV: {ext: 'tsv', mime: 'text/tab-separated-values'},
        CSV: {ext: 'csv', mime: 'text/csv'},
        SDF: {ext: 'sdf', mime: 'chemical/x-mdl-sdfile'},
      };
      return typeMap;
    },
    downloadTable(type, fname, tData) {
      const typeMap = this.typeMap();
      const dataObjSize = countProperties(tData);
      const filename = `${fname}.${typeMap[type].ext}`;
      const fileData = dataObjSize > 0 ? tData[type] : tData;
      const tableData = {
        data: fileData,
        filename,
        filetype: type.toLowerCase(),
      };
      return api.download(tableData).then(({data}) => {
        download(data, filename, typeMap[type].mime);
      });
    },
    ncctRound(number) {
      if (typeof number === 'number') {
        if ((number >= 0.1 && number < 1000) || (number <= -0.1 && number > -1000) || number === 0) {
          return number.toPrecision(3);
        }
        return number.toExponential(2);
      }
      return number;
    },
    copyToClipboard(textOutput) {
      const copying = true;
      const textarea = document.createElement('textarea');
      textarea.value = textOutput;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setTimeout(() => {
          this.copying = false;
        }, 1500);
      } catch (err) {
        console.error(`Cannot copy: ${err}`);
      }
      document.body.removeChild(textarea);
    },
    removeNumbers(phrase) {
      if (phrase.indexOf('POD') > -1 || phrase.indexOf('Occupational') > -1) {
        const firstFive = phrase.substring(0, 4);
        const endString = phrase.substring(4, phrase.length);
        const newString = firstFive.replace(/[0-9]/g, '');
        const finalString = `${newString}${endString}`;
        return finalString;
      }
      return phrase;
    },
    superscriptDigitMap() {
      const superscriptDigitMap = ['&#8304;', '&#185;', '&#178;', '&#179;', '&#8308;', '&#8309;', '&#8310;', '&#8311;', '&#8312;', '&#8313;'];
      return superscriptDigitMap;
    },
    subSuperScriptReplace(word) {
      const ssdMap = ['&#8304;', '&#185;', '&#178;', '&#179;', '&#8308;', '&#8309;', '&#8310;', '&#8311;', '&#8312;', '&#8313;'];
      if (word === null) {
        return null;
      }
      return word
        .replace(/~(\d+)~/g, (match, p1) => p1.split('')
          .map(digit => ssdMap[digit])
          .join(''));
    },
    formattedSearchInput(input) {
      const subScriptNums = {
        0: '\u2080',
        1: '\u2081',
        2: '\u2082',
        3: '\u2083',
        4: '\u2084',
        5: '\u2085',
        6: '\u2086',
        7: '\u2087',
        8: '\u2088',
        9: '\u2089',
      };
      return input.replace(/[0-9]/g, num => subScriptNums[num]);
    },
    setLocalStorage(ident, jsonObj) {
      const str2Store = JSON.stringify(jsonObj);
      localStorage.setItem(ident, str2Store);
    },

    getLocalStorage(ident) {
      let storeObj = JSON.parse(localStorage.getItem(ident));
      if (!storeObj) {
        storeObj = {};
      }
      return storeObj;
    },

    getGridState(ident) {
      return this.getLocalStorage(ident);
    },

    setGridState(ident, statename, stateObj) {
      const storeObj = this.getLocalStorage(ident);
      storeObj[statename] = stateObj;
      this.setLocalStorage(ident, storeObj);
    },

    getDate_YYYY_Mon_DD() {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      const dateObj = new Date();
      const month = monthNames[dateObj.getMonth()].substring(0, 3);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${year}_${month}_${day}`;
    },
    parseExportColumns(cols, excluded) {
      const exportKeys = [];
      cols.forEach((col) => {
        if (!excluded.includes(col.colId)) {
          const coldef = col.getColDef();
          exportKeys.push(col);
        }
      });
      return exportKeys;
    },
  },
});
