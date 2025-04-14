<template>
  <client-only>
    <div style="margin-top:10px">
      <div class="h2">
        <ccte-help-text
          data-cy="GenotoxicityHeader"
          label-type="span"
          :heading-text="`Hazard Data - Genotoxicity`"
          help-key="SR Genotoxicity"
        />
      </div>
      <grid-tips
        :cname="cname"
        grid-reference="summary"
        :grid-heading="cname.baseName"
        :show-export="true"
        :grid-size="summarySize"
        :config-obj="gridConfigurationObj"
        @onExport="exportData"
        @gridRef="onGridRef"
      />
      <grid-tips
        :cname="detailsCname"
        grid-reference="details"
        :grid-heading="detailsCname.baseName"
        :show-export="true"
        :grid-size="detailsSize"
        :config-obj="detailsGridConfigurationObj"
        @onExport="exportData"
        @gridRef="onGridRef"
      />
    </div>
  </client-only>
</template>

<script>
import {
  mapGetters, mapState,
} from 'vuex';
import GridTips from '~/components/grids/GridWithToolTips.vue';

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (currentChem.dtxsid === data.params.id || currentChem.dtxcid === data.params.id) {
        return true;
        // eslint-disable-next-line no-else-return
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical', data, data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'GenotoxicityView',
  components: {
    GridTips,
  },

  data() {
    return {
      genotoxicityDetails: null,
      cname: {
        camelName: 'GenotoxicitySummary',
        hyphenName: 'genotoxicity-summary',
        baseName: 'Genotoxicity Summary',
      },
      detailsCname: {
        camelName: 'GenotoxicityDetails',
        hyphenName: 'genotoxicity-details',
        baseName: 'Genotoxicity Details',
      },
      gridConfigurationObj: {},
      detailsGridConfigurationObj: {},
      tableHeader: 'Genotoxicity Summary',
      summarySize: 'height:120px;width:100%; overflow:auto',
      detailsSize: 'height:320px;width:100%; overflow:auto',
      detailsGridApi: null,
      detailsColumnApi: null,
      gridApi: null,
      columnApi: null,
    };
  },
  computed: {
    ...mapGetters({
      detailsGridDefs: 'genoToxicity/getDetailsGridDefs',
      summaryGridDefs: 'genoToxicity/getSummaryGridDefs',
    }),
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    currentIdentifier() {
      if (this.genotoxicitySummaryData.length && this.genotoxicitySummaryData[0]?.dtxsid) {
        return this.genotoxicitySummaryData[0]?.dtxsid;
      }

      if (this.genotoxicityDetailsData.length && this.genotoxicityDetailsData[0]?.dtxsid) {
        return this.genotoxicityDetailsData[0]?.dtxsid;
      }

      return this.$route.params.id;
    },
  },
  async asyncData(context) {
    let genotoxicitySummaryData = [];
    let genotoxicityDetailsData = [];
    try {
      const genotoxicitySummary = await context.app.$repositories.genoToxicitySummary.find(context.params.id);
      genotoxicitySummaryData = genotoxicitySummary._embedded.GenetoxicitySummary;
    } catch (err) {

    }
    try {
      const genotoxicityDetails = await context.app.$repositories.genoToxicityDetails.find(context.params.id);
      genotoxicityDetailsData = genotoxicityDetails._embedded.GenetoxicityDetails;
    } catch (err) {

    }
    return {
      genotoxicitySummaryData,
      genotoxicityDetailsData,
    };
  },
  beforeMount() {
    let gridColumnDefs = this.summaryGridDefs();
    let gridData = this.genotoxicitySummaryData;
    this.gridConfigurationObj = {
      gridColumnDefs,
      gridData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        suppressMenu: false,
        headerClass: 'hide-filter-icon',
        floatingFilter: true,
      },
      gridOptions: {
        popupParent: document.querySelector('body'),
        rowHeight: 28,
        unSortIcon: true,
        headerHeight: 40,
        suppressContextMenu: true,
        domLayout: 'autoHeight',
        animateRows: true,
        rowStyle: {fontSize: '11px', color: '#444'},
        components: {
          ncctRound2: this.ncctRound2,
        },
      },
    };
    gridColumnDefs = this.detailsGridDefs();
    gridData = this.genotoxicityDetailsData;
    this.detailsGridConfigurationObj = {
      popupParent: document.querySelector('body'),
      gridColumnDefs,
      gridData,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        suppressMenu: false,
        floatingFilter: false,
      },
      gridOptions: {
        rowHeight: 28,
        headerHeight: 40,
        unSortIcon: true,
        domLayout: 'normal',
        animateRows: true,
        rowStyle: {fontSize: '11px', color: '#444'},
        components: {
          ncctRound2: this.ncctRound2,
          ncctNumericCommaSep: this.ncctNumericCommaSep,
        },
      },
    };
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Hazard Genotoxicity`,
      meta: [],
    };
  },
  methods: {
    onGridRef(params) {
      if (params.reference === 'summary') {
        this.gridApi = params.gridApi;
        this.columnApi = params.columnApi;
      }
      if (params.reference === 'details') {
        this.detailsGridApi = params.gridApi;
        this.detailsColumnApi = params.columnApi;
      }
    },
    exportData(params) {
      const currentGridApi = params.reference === 'summary' ? this.gridApi : this.detailsGridApi;
      const todaysDate = this.dateFormat();

      // Uppercase first letter of reference
      // eg: Input: details Output: Details
      const fileNameLabel = params.reference.charAt(0).toUpperCase() + params.reference.slice(1);

      params.fileName = `${this.currentIdentifier} Hazard Genotoxicity ${fileNameLabel}-${todaysDate}`;

      if (params.fileType === 'csv') {
        currentGridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        currentGridApi.exportDataAsExcel(params);
      }
    },
  },
};
</script>
