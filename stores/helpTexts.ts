/* eslint-disable import/prefer-default-export */
import {defineStore} from 'pinia';
import {useContext} from '@nuxtjs/composition-api';

import {HelpText, UseHelpTextsState} from './types';

export const useHelpTexts = defineStore('helpTexts', {
  state: (): UseHelpTextsState => ({
    helpTexts: [],
    loadingHelpTexts: false,
  }),
  getters: {
    getHelpTexts(state) {
      return state.helpTexts;
    },
    getByPageUrl: state => (input: string) => state.helpTexts
      .find(message => message.helpTextId.toLowerCase() === input.toLowerCase()),
  },
  actions: {
    async fillHelpTexts() {
      // Temporary type of any until entire project/app is typed out in declarations
      const vueContext: any = useContext();
      try {
        this.loadingHelpTexts = true;
        const result = await vueContext.$repositories.helpTexts.index('');
        this.helpTexts = result._embedded.helptext;
      } catch (e) {
        vueContext.$sentry.captureMessage(`Helptexts fillHelpTexts data error on load :  ${e}`);
      } finally {
        this.loadingHelpTexts = false;
      }
    },
    async getById(input: string, sentry: any): Promise<HelpText> {
      // Only make API call to get help texts if array is empty and no other concurrent requests are occuring.
      if (!this.helpTexts.length && !this.loadingHelpTexts) {
        await this.fillHelpTexts();
      }
      try {
        const returnHelpText =
      [...this.helpTexts].find(message => message.helpTextId.toLowerCase() === input.toLowerCase());
        // Return default object if no help text id is found. And capture error in sentry.
        sentry.captureMessage(`No helptext found in getById for "${input.toLowerCase()}"`);
        if (!returnHelpText) {
          return {
            helpPosition: 'right',
            helpText: '',
            iconType: '',
            helpTextId: 'N/A',
          };
        }
        return returnHelpText;
      } catch (e) {
        sentry.captureMessage(`getById Error : ${e}`);
      }
      return {
        helpPosition: 'right',
        helpText: '',
        iconType: '',
        helpTextId: 'N/A',
      };
    },
    getBatchHelp(input: string, sentry: any): HelpText {
      try {
        const returnHelpText =
          [...this.helpTexts].find(message => message.helpTextId.toLowerCase() === input.toLowerCase());

        // Return default object if no help text id is found.
        if (!returnHelpText) {
          sentry.captureMessage(`No helptext found in getBatchHelp for "${input.toLowerCase()}"`);
          return {
            helpPosition: 'right',
            helpText: '',
            iconType: '',
            helpTextId: 'N/A',
          };
        }

        return returnHelpText;
      } catch (e) {
        sentry.captureMessage(`getBatchHelp Error : ${e}`);
      }
      return {
        helpPosition: 'right',
        helpText: '',
        iconType: '',
        helpTextId: 'N/A',
      };
    },
  },
});
