<template>
  <client-only>
    <mdb-container fluid class="content left-fullwidth-container">
      <div class="h2">
        <ccte-help-text
          data-cy="SearchResults"
          label-type="span"
          :heading-text="`Search Results`"
          help-key="SearchResults"
        />
      </div>

      <div class="card">
        <div class="card-body">
          <p class="ml-3">
            <span class="card-text ml-3">{{ searchInfo }}</span>
          </p>
        </div>
      </div>
      <div v-if="gridConfigurationObj.gridData" class="mt-4">
        <mdb-btn
          type="button"
          class="blue lighten-1 text-white m-0"
          size="sm"
          :disabled="!hasSelection"
          @click="viewMultipleResults"
        >
          View Selected Formula(e)
        </mdb-btn>

        <grid-tips
          :cname="cname"
          grid-reference="formulas"
          :grid-heading="tableHeader"
          :grid-size="gridSize"
          :config-obj="gridConfigurationObj"
          :percent-done="percentDone"
          :progress-msg="progressMsg"
          :loading="true"
          @selectionChanged="onSelectionChanged"
          @gridRef="onGridRef"
          @onExport="onExportData"
        />
      </div>
      <div v-else style="display: inline-block;">
        <div class="spinner-border text-primary ml-5 mt-5" role="status" style="display: inline-block;">
          <span class="sr-only">Loading...</span>
        </div>
        <div class="mb-3 ml-3" style="display: inline-block;">
          <strong>Please wait while we calculate the number of substances associated with the returned formula(e)</strong>
        </div>
      </div>
    </mdb-container>
  </client-only>
</template>

<script>
import {mdbContainer, mdbBtn} from 'mdbvue';
import {
  mapGetters, mapMutations, mapState,
} from 'vuex';
import chemCalc from 'chemcalc';
import GridTips from '~/components/grids/GridWithToolTips.vue';

export default {
  name: 'AllAdductsPage',
  components: {
    mdbBtn,
    mdbContainer,
    GridTips,
  },
  data: () => ({
    gridConfigurationObj: {},
    tableHeader: '',
    searchInfo: '',
    gridSize: 'width:500px;height: 400px; overflow:auto',
    cname: {
      camelName: 'generateFormulas',
      hyphenName: 'generate-fomulas',
      baseName: 'generateFormulas',
    },

    inputs: {},
    calcMass: 0,
    calcRange: 0,
    hasSelection: false,
    selectedFormulas: [],
    formulaResults: null,
    percentDone: 0,
    progressMsg: '',
    loading: false,
    exportColDefs: [
      {
        header: 'FORMULA(E)',
        key: 'mf',
        width: '32',
        formatter: 'cellHyperlink',
        formatterParams: {route: 'search-results/multiple_results?input_type=ms_ready_formula&inputs=', useValue: true},
      }, {
        header: 'HITS',
        key: 'hits',
        width: '32',
      },
    ],
  }),
  beforeMount() {
    this.gridConfigurationObj = {
      gridData: null,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,

      },
      gridColumnDefs: [
        {
          headerName: '',
          filter: false,
          suppressSizeToFit: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          suppressMenu: true,
          sortable: false,
          resizable: false,
          width: 60,
        },
        {
          headerName: 'Molecular Formula(e)',
          width: 200,
          colId: 'mf',
          field: 'mf',
          floatingFilter: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            caseSensitive: true,
          },
          cellRenderer(params) {
            if (params.data.hits > 0) {
              const cellValue = `<a target='_blank' href='search-results/multiple_results?input_type=ms_ready_formula&inputs=${params.value}'>${params.value}</a>`;
              return cellValue;
            }
            return params.value;
          },

        },
        {
          headerName: 'Hits',
          width: 100,
          floatingFilter: true,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          field: 'hits',
          cellRenderer(params) {
            let cellValue = '';
            if (params.value !== '-') {
              cellValue = params.value;
            } else {
              cellValue = '<i  class="fas fa-cog fa-spin" /></i> searching';
            }
            return cellValue;
          },
        },
      ],
      gridOptions: {
        suppressContextMenu: true,
        rowSelection: 'multiple',
        headerHeight: 50,
        components: {
          searchUrl: this.searchUrl,
        },
      },
    };
    this.inputs.input_type = this.$route.query.input_type;
    this.inputs.mass = parseFloat(this.$route.query.mass);
    this.inputs.adduct = parseFloat(this.$route.query.adduct) || 0;
    this.inputs.error_da = parseFloat(this.$route.query.error_da) || null;
    this.inputs.error_ppm = parseFloat(this.$route.query.error_ppm) || null;
    this.inputs.min = parseFloat(this.$route.query.min) || null;
    this.inputs.max = parseFloat(this.$route.query.max) || null;
    this.inputs.reqStr = this.$route.query.reqStr || 'C1-50H0-100O0-20N0-20P0-10S0-10';
    this.generateFormulas();
  },
  methods: {
    ...mapMutations({

    }),
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      this.selectFormulae();

      this.columnApi.applyColumnState({
        state: [
          {
            colId: 'hits',
            sort: 'desc',
          },
        ],
      });

      // this.generateFormulas();
      this.gridApi.onFilterChanged();
    },
    selectFormulae() {
      const nodesToSelect = [];
      this.gridApi.forEachNode((node) => {
        if (node.data && node.data.hits > 0) {
          nodesToSelect.push(node);
        }
      });
      this.gridApi.setNodesSelected({nodes: nodesToSelect, newValue: true});
    },
    onSelectionChanged(params) {
      this.hasSelection = this.gridApi.getSelectedNodes().length > 0;
    },

    async generateFormulas() {
      if (!this.inputs.min && !this.inputs.max) {
        this.calcMass = this.inputs.mass + this.inputs.adduct;
        if (this.inputs.error_da) {
          this.calcRange = this.inputs.error_da;
        } else {
          // convert ppm to da
          this.calcRange = this.roundPrecision((this.inputs.error_ppm * this.inputs.mass) / 1000000, 14);
        }
      } else {
        const fromMass = parseFloat(this.inputs.min) + this.inputs.adduct;
        const toMass = parseFloat(this.inputs.max) + this.inputs.adduct;
        const range = this.roundPrecision((toMass - fromMass) / 2, 14);
        this.calcMass = fromMass + range;
        this.calcRange = Math.abs(range);
      }
      const search = chemCalc.mfFromMonoisotopicMass(this.calcMass, {
        massRange: this.calcRange, mfRange: this.inputs.reqStr, maxNumberRows: 10000,
      });
      this.count = search.numberResults;
      const countIncrement = 100 / this.count;
      const formattedRange = parseFloat(this.calcRange).toFixed(6);
      this.searchInfo = `${this.count} formula(e) calculated for a mass of ${this.calcMass} Da with a range of ${formattedRange} Da`;

      const hitsArray = [];
      this.loading = true;
      const asyncRes = await Promise.all(search.results.map(async(formula, idx) => {
        const hits = await this.$repositories.chemicalSearch.formulaCount(formula.mf);
        hitsArray.push({
          ...formula, hits: hits, id: idx,
        });
        this.percentDone += countIncrement;
        this.progressMsg = `${hitsArray.length} of ${this.count} formula(e) checked`;
      }));

      this.gridConfigurationObj.gridData = [...hitsArray];
      this.loading = false;
    },


    searchUrl() {
      let inputList = '';
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        if (rowNode.isSelected()) {
          inputList += `inputs=${rowNode.data.mf}&`;
        }
      });
      inputList = inputList.slice(0, -1);
      return inputList;
    },

    viewMultipleResults() {
      window.location.assign(`search-results/multiple_results?input_type=ms_ready_formula&${this.searchUrl()}`);
    },

    onExportData(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        const fname = `Formulas-${params.fileName}`;
        const exportConfig = {
          gridApi: this.gridApi, columns: this.exportColDefs, fileName: fname, splitSheet: {xSplit: 0, ySplit: 1},
        };
        this.exportData(exportConfig);
      }
    },

  },
};
</script>
