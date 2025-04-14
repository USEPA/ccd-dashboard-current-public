import {defineStore} from 'pinia';
import {useContext} from '@nuxtjs/composition-api';
import {
  Hazard, HumanEco, SelectValuesListItem, UseHazardState,
} from './types';

// eslint-disable-next-line import/prefer-default-export
export const useHazardStore = defineStore('hazard', {
  state: (): UseHazardState => ({
    dtxsid: '',
    propertySelection: 0,
    Hazard: {
      casrn: '',
      dtxsid: undefined,
      preferredName: '',
      eco: [],
      human: [],
    },
  }),
  getters: {
    getDtxsid: state => state.dtxsid,
    getHazard: state => state.Hazard,
    getPropertySelection: state => state.propertySelection,
    getSelectListValues: state => [...state.Hazard.human, ...state.Hazard.eco].reduce((acc, cv) => {
      if (cv.name && !acc.some(option => option.text === cv.name)) {
        const opt = {
          value: cv.name.replace(/ /gi, '_').toUpperCase(),
          text: cv.name,
        };
        acc.push(opt);
      }
      return acc;
    }, [] as SelectValuesListItem[]),
  },
  actions: {
    setDtxsid(dtxsid: string) {
      this.dtxsid = dtxsid;
    },
    setHazard(hazardObject: Hazard) {
      if (Object.keys(hazardObject).length) {
        this.Hazard = {
          ...hazardObject,
          eco: hazardObject.eco.map(ecoItem => ({
            ...ecoItem,
            arrKey: ecoItem.name.replace(/|:|.|'|/gi, '').replace(/ /gi, '_').toUpperCase(),
            rawData: ecoItem.rawData.map(dataItem => ({
              ...dataItem,
              dtxsid: hazardObject.dtxsid,
            })),
          })),
          human: hazardObject.human.map(humanItem => ({
            ...humanItem,
            arrKey: humanItem.name.replace(/|:|.|'|/gi, '').replace(/ /gi, '_').toUpperCase(),
            rawData: humanItem.rawData.map(dataItem => ({
              ...dataItem,
              dtxsid: hazardObject.dtxsid,
            })),
          })),
        };
      }
    },
  },
});
