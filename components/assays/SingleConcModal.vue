<template>
  <mdb-modal
    size="xl"
    data-cy="assay-modal"
    :show="visibility"
    @shown="handleShown"
    @close="toggleVisibility"
  >
    <mdb-modal-header class="primary-color lighten-1" :close="true">
      <h3 class="white-text">
        <mdb-icon icon="table" class="mr-4 white-text" />{{ title }} Single Concentration aeid: {{ aeid }}
      </h3>
    </mdb-modal-header>
    <mdb-modal-body class="assayModal pr-0">
      <div style="height: 500px; width:100%;">
        <mdb-dropdown id="export-detail-btn">
          <mdb-dropdown-toggle slot="toggle" style="padding: 7px 12px;" class="blue lighten-1 text-white" size="sm">
            <mdb-icon icon="download" />  Export
          </mdb-dropdown-toggle>
          <mdb-dropdown-menu>
            <mdb-dropdown-item
              @click="onExportData('csv')"
            >
              CSV (.csv)
            </mdb-dropdown-item>
            <mdb-dropdown-item
              @click="onExportData('xlsx')"
            >
              Excel (.xlsx)
            </mdb-dropdown-item>
          </mdb-dropdown-menu>
        </mdb-dropdown>
        <div v-if="loading" class="progress" style="width:500px">
          <div
            class="progress-bar bg-success"
            role="progressbar"
            :style="{width:percentDone +'%'}"
          >
            {{ progressMsg }}
          </div>
        </div>
        <ag-grid-vue
          v-if="showGrid"
          id="concAssays"
          class="ag-theme-balham"
          style="height: 90%; width:100%"
          :row-data="rowData"
          :grid-options="gridOptions"
          @grid-ready="onGridReady"
        />
      </div>
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mdbModal,
  mdbIcon,
  mdbModalHeader,
  mdbModalBody,
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
} from 'mdbvue';

import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'AssaysModal',
  components: {
    AgGridVue,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbIcon,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
  },
  props: {
    title: {
      default: '',
      type: String,
    },
    aeid: {
      default: 0,
      type: Number,
    },
    visibility: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Array,
      default: () => [],
    },
    loading: {type: Boolean, default: false},
    percentDone: {type: Number, default: 0},
    progressMsg: {type: String, default: ' '},
  },
  data: () => ({
    gridApi: null,
    columnApi: null,
    gridOptions: {},
    showGrid: false,

  }),

  beforeMount() {
    this.exportColDefs = [
      {
        header: 'Preferred Name',
        key: 'preferredName',
        width: 30,
      },
      {
        header: 'DTXSID',
        key: 'dtxsid',
        width: '16',
        formatter: 'cellHyperlink',
        formatterParams: {route: 'chemical/details/', useValue: true},
      },
      {header: 'CASRN',
        key: 'casrn'},
      {header: 'BMAD',
        key: 'bmad'},
      {header: 'Cut Off',
        key: 'coff'},
      {header: 'Hit Call',
        key: 'hitc'},
      {header: 'Max Med',
        key: 'maxMedVal'},
    ];

    this.gridOptions = {
      domLayout: 'normal',
      unSortIcon: true,
      valueCache: true,
      rowSelection: 'multiple',
      suppressContextMenu: true,
      components: {
        shortDtxsid: this.shortDtxsid,
        ncctRound2: this.ncctRound2,
        whenEmpty: this.whenEmpty,
      },

      defaultColDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        floatingFilter: true,
      },
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'center',
          },
          {statusPanel: 'agFilteredRowCountComponent'},
          {statusPanel: 'agSelectedRowCountComponent'},
          {statusPanel: 'agAggregationComponent'},
        ],
      },
      columnDefs: [
        {
          headerName: 'Preferred Name',
          field: 'preferredName',
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'DTXSID',
          field: 'dtxsid',
          width: 80,
          cellRenderer: 'shortDtxsid',
        },
        {
          headerName: 'CASRN',
          field: 'casrn',
          filter: 'agTextColumnFilter',
          width: 80,
        },
        {
          headerName: 'BMAD',
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
            allowedCharPattern: '\\d\\.\\-',
          },
          width: 80,
          valueGetter: 'Number.isNaN(data.bmad) || data.bmad === "-" ? "-" : Number( Number(data.bmad).toFixed(3) )',
        },
        {
          headerName: 'Cut Off',
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
            allowedCharPattern: '\\d\\.\\-',
          },
          width: 80,
          valueGetter: 'Number.isNaN(data.coff) || data.coff === "-" ? "-" : Number( Number(data.coff).toFixed(3) )',
        },
        {
          headerName: 'Hit Call',
          field: 'hitc',
          filter: 'agSetColumnFilter',
          width: 80,
          valueFormatter: this.hitcFormatter,
          keyCreator: this.hitcFormatter,
          cellStyle: this.activeColor,
        },

        {
          headerName: 'Max Med',
          filter: 'agNumberColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: false},
          filterParams: {
            inRangeInclusive: true,
            defaultOption: 'greaterThanOrEqual',
            allowedCharPattern: '\\d\\.\\-',
          },
          sortable: true,
          width: 80,
          valueGetter: 'Number.isNaN(data.maxMedVal) || data.maxMedVal === "-" ? "-" : Number( Number(data.maxMedVal).toFixed(3) )',
        },
      ],
    };
  },
  methods: {
    handleShown() {
      this.showGrid = true;
    },
    shortDtxsid(params) {
      if (!params.value) { return '-'; }
      const linkto = `/dashboard/chemical/details/${params.value}`;
      return `<a href="${linkto}">${params.value}</a><br>`;
    },
    hitcFormatter(params) {
      params.value = parseInt(params.value, 10);
      return (params.value === 0) ? 'Inactive' : 'Active';
    },
    activeColor(params) {
      params.data.hitc = parseInt(params.data.hitc, 10);
      return (params.data.hitc === 0) ? {color: '#1565c0'} : {color: '#c62828'};
    },
    toggleVisibility() {
      this.showGrid = false;
      this.$emit('toggleConcVisibility');
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.handleResize();
    },

    onExportData(params) {
      const timeStamp = this.dateFormat();
      this.exportData({
        fileName: `Single Conc. Data for ${this.title}-${timeStamp}`,
        gridApi: this.gridApi,
        fileFormat: params,
        columns: this.exportColDefs,
      });
    },
    handleResize() {
      if (this.gridApi !== null) {
        this.gridApi.sizeColumnsToFit();
      }
    },

  },
};
</script>

<style lang="scss">
  .assayModal {
    background: white;
    max-height: 80%;
    overflow-x: auto;
    width: 100%;
    padding:0;
  }

.modal-dialog {
    width: 80%;
    margin: 1.75rem auto;
}

</style>
