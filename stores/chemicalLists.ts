/* eslint-disable import/prefer-default-export */
import {defineStore} from 'pinia';
import vuexStore from '@/store';
import chemLists from '@/assets/fixtures/chemicalLists.json';

export const useChemListStore = defineStore('chemicalLists', {
  state: () => ({
    chemicalLists: [],
    gridDefs: [
      {
        headerName: 'List Acronym',
        field: 'listName',
        sortable: true,
        width: 170,
        suppressSizeToFit: true,
        cellRenderer: 'ListAcronymRenderer',
        floatingFilter: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'List Name',
        field: 'label',
        sortable: true,
        width: 250,
        wrapText: true,
        suppressSizeToFit: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        suppressMenu: true,
      },
      {
        headerName: '# Chemicals',
        field: 'chemicalCount',
        sortable: true,
        minWidth: 90,
        maxWidth: 100,
        suppressMenu: true,
        cellStyle: {color: 'green'},
      },
      {
        headerName: 'Updated',
        field: 'updatedAt',
        sortable: true,
        minWidth: 90,
        width: 90,
        suppressMenu: true,
      },
      {
        headerName: 'List Description',
        headerClass: 'cl-header',
        field: 'longDescription',
        sortable: false,
        resizable: true,
        minWidth: 600,
        autoHeight: true,
        cellRenderer: 'MdbCardTextRenderer',
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        suppressMenu: true,
      },
    ],
    exportColDefs: [
      {
        header: 'List Acronym',
        key: 'listName',
        formatter: 'cellHyperlink',
        formatterParams: {route: 'chemical-lists/', useValue: true},
        width: 25,
      }, {
        header: 'List Name',
        key: 'label',
        width: 50,
      }, {
        header: 'Last Updated',
        key: 'lastModifiedDate',
        width: 12,
      }, {
        header: '# of Chemicals',
        key: 'chemicalCount',
        width: 10,
      }, {
        header: 'List Description',
        key: 'longDescription',
      },
    ],
  }),
  actions: {
    fetchLists(vuexContext) {
      const data = chemLists;
      const arr = data.chemicalLists;
    },
    async asyncChemicalLists(context) {
      let errorObj = {};
      try {
        const response = await context.app.$repositories.chemicalList.index2('');
        const arr = response;
        this.chemicalLists = arr;
        return arr;
      } catch (e) {
        if (e.response && (e.response.status !== 404)) {
          errorObj = {
            status: e.response,
          };
        } else {
          errorObj = e;
        }
        context.$sentry.captureException(`chemical list api call failed - specific error is ${errorObj} data fixture loaded`);
        return errorObj;
      }
    },
  },
});
