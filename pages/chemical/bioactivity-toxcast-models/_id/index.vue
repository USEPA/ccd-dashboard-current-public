<template>
  <div style="margin-top:10px">
    <div class="h2 ml-5">
      <ccte-help-text
        data-cy="BioactivityToxCastModels"
        label-type="span"
        :heading-text="`Bioactivity - ToxCast: Models`"
        help-key="Bioactivity ToxCast: Models Header"
      />
    </div>
    <div v-if="getModelData().length > 0" style="width:95%;">
      <grid-tips
        ref="toxcastModelsGrid"
        :show-export="showExport"
        :cname="gridConfigurationObj.cname"
        :saved-state="pageState"
        grid-reference="toxcast-models-grid"
        grid-heading="ToxCast Model Predictions"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @gridRef="onGridRef"
        @onExport="onExport"
      />
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations, mapState, mapActions,
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
  name: 'ToxCastModelsView',
  components: {
    GridTips,
  },
  data() {
    return {
      active: 'bioactivity-toxcast-models',
      toxcastModelsConfig: {cname: {
        baseName: 'Toxcast Models',
        camelName: 'toxcastModelsToolbar',
        hyphenName: 'toxcast-models-grid',
      }},
      gridSize: 'height: 210px; width: 100%; overflow:auto',
      pageState: {
        section: null,
        gridRef: null,
        colState: null,
        filter: null,
      },
      defaultSort: null,
      gridRef: 'toxcastModelsToolbar',
      gridConfigurationObj: {},
      showExport: true,
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: true,
      },
    };
  },
  computed: {
    ...mapGetters({
      getColumnDefs: 'bioactivity/getToxcastModelsGridDef',
      getModelData: 'bioactivity/getToxcastModelsData',
    }),
    ...mapState({
      activeChemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    try {
      const tcm = await context.app.store.dispatch('bioactivity/asyncToxcastModels', context);
    } catch (err) {
      console.error(`ERROR regional screening api ${err}`);
    }
  },
  head() {
    return {
      title: `${this.activeChemical.preferredName} - ToxCast: Models`,
      meta: [],
    };
  },

  beforeMount() {
    this.pageState = JSON.parse('{"page":"bioactivity-toxcast-models","gridRef":"toxcast-models-grid","colStateSort":[{"colId":"model"},{"colId":"receptor"},{"colId":"agonist"},{"colId":"antagonist"},{"colId":"binding"}],"sort":[{"colId":"model","sort":"desc"},{"colId":"receptor","sort":"asc"}],"filter":{}}');

    this.gridConfigurationObj = {
      cname: {
        baseName: 'Toxcast Models',
        camelName: 'toxcastModelsToolbar',
        hyphenName: 'toxcast-models-grid',
      },
      gridColumnDefs: this.getColumnDefs(),
      gridData: this.getModelData(),
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: false,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
      },
      gridOptions: {
        components: {
          roundTo2: this.roundTo2,
          ncctRound2: this.ncctRound2,
        },
        unSortIcon: true,
        suppressContextMenu: true,
        headerHeight: 50,
        rowHeight: 30,

      },
    };
  },
  methods: {
    onGridRef(params) {
      this.gridRefs = params;
    },
    onExport(params) {
      params.fileName = `${this.activeChemical.dtxsid} Toxcast Models.xlsx`;
      if (params.fileType === 'csv') {
        this.gridRefs.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridRefs.gridApi.exportDataAsExcel(params);
      }
    },
  },
};

</script>
