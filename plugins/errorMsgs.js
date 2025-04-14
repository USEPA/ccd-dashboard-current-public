/* eslint-disable unicorn/prefer-includes */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import Vue from 'vue'

Vue.mixin({
  methods: {
    /** Parses a url and returns a key/value mapping of the query params
 * @param {String} err
 * @returns {Object.<String, String>}
 */
    getErrorMsg(err) {
      let response = err.response || 'no response object'
      const errObj = {
        message: err.toString(),
        status: response.status || 'unknown',
        statusText: response.statusText || 'unknown',
      }
      return errObj
    },
  },
})
