<template>
  <div>
    <grid-tips
      v-show="show"
      v-if="getRegionalScreeningData"
      :cname="cname"
      grid-heading=""
      :grid-size="altgridSize"
      :config-obj="gridConfig"
      :show-export="showExport"
      @gridRef="onGridRef"
    />
    <h3 v-else>
      No Data Found
    </h3>
  </div>
</template>
<script>
import {
  mapGetters, mapMutations, mapState, mapActions,
} from 'vuex';
import GridTips from '~/components/grids/GridWithToolTips.vue';

export default {
  name: 'RegionalScreening',
  components: {
    GridTips,
  },
  data() {
    return {
      show: true,
      cname: {
        camelName: 'regionalScreening',
        hyphenName: 'regional-screening',
        baseName: 'Regional Screening',
      },
      altgridSize: ' width:540px; height: 400px; overflow:auto',
      gridConfig: {},
      showExport: false,
    };
  },
  computed: {
    ...mapGetters({
      getRegionalScreeningGridDef: 'executiveSummary/getRegionalScreeningGridDef',
      getRegionalScreeningData: 'executiveSummary/getRegionalScreeningData',
    }),
    ...mapState({
      regionalScreeningData: 'executiveSummary/regionalScreeningData',
    }),
  },
  beforeMount() {
    const screeningData = this.getRegionalScreeningData() || [];
    if (this.getRegionalScreeningData()) {
      screeningData.map((item) => {
        item.toxvalType = `${item.toxvalType} (${item.toxvalUnits})`;
      });
    }

    this.gridConfig = {
      gridColumnDefs: this.getRegionalScreeningGridDef(),
      gridData: screeningData,
      gridOptions: {
        headerHeight: 50,
        unSortIcon: true,
        components: {
          calculationDetailsLink: this.calculationDetailsLink,
          ncctRound2: this.ncctRound2,
          whenEmpty: this.whenEmpty,
        },
        suppressContextMenu: true,
        defaultColDef: {
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          sortable: true,
          floatingFilter: false,
        },
      },
    };
  },

  methods: {
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      this.columnApi.applyColumnState({
        state: [
          {
            colId: 'thq',
            sort: 'asc',
          },
          {
            colId: 'toxvalNumeric',
            sort: 'asc',
          },
        ],
      });
    },
  },
};

</script>
