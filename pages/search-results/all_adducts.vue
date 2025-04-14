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
          <p class=" card-text">
            <span class=" ">Searched with {{ searchTerm }}</span>
          </p>
        </div>
      </div>
      <grid-tips
        :cname="cname"
        grid-reference="adducts"
        :grid-heading="tableHeader"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @gridRef="onGridRef"
        @onExport="onExportData"
      />
    </mdb-container>
  </client-only>
</template>

<script>
import {mdbContainer} from 'mdbvue';
import {
  mapGetters, mapMutations, mapState,
} from 'vuex';

import ExcelJS from 'exceljs';
import GridTips from '~/components/grids/GridWithToolTips.vue';

export default {
  name: 'AllAdductsPage',
  components: {
    mdbContainer,
    GridTips,
  },
  data: () => ({
    gridConfigurationObj: {},
    tableHeader: '',
    gridSize: 'width:500px;height: 400px; overflow:auto',
    cname: {
      camelName: 'allAdducts',
      hyphenName: 'allAdducts',
      baseName: 'allAdducts',
    },
    adductValues: [
      {text: 'Neutral', value: '0'},
      {text: 'M+', value: '0.00054'},
      {text: '[M+H]+', value: '-1.007285'},
      {text: '[M+NH4]+', value: '-18.033834'},
      {text: '[M+Na]+', value: '-22.989229'},
      {text: '[M+K]', value: '-38.963167'},
      {text: 'M-', value: '-0.00054'},
      {text: '[M-H]-', value: '1.007285'},
      {text: '[M+Cl]-', value: '-34.969393'},
      {text: '[M+HCOO]-', value: '-44.998194'},
      {text: '[M+CH3COO]-', value: '-59.013844'},
    ],
    inputs: {},
    resultsUrlBase: 'search-results?input_type=ms_ready_monoisotopic_mass',
    exportColDefs: [
      {
        header: 'ADDUCT',
        key: 'adduct',
        width: '32',
      }, {
        header: 'HITS',
        key: 'hits',
        width: '32',
      },
    ],
  }),
  computed: {
    searchTerm() {
      let text = '';
      if (this.$route.query.error_da) {
        text = `a mass of ${this.inputs.mass} Da with a range of  +/- ${this.inputs.error_da} Da.`;
      } else if (this.$route.query.error_ppm) {
        text = `a mass of ${this.inputs.mass} Da with a range of  +/- ${this.inputs.error_ppm} ppm.`;
      }
      if (this.$route.query.min && this.$route.query.max) {
        text = `a mass between ${this.inputs.min} and ${this.inputs.max} Da.`;
      }

      return text;
    },
    massTotal() {
      const adducts = parseFloat(this.$route.query.mass_adducts) || 0;
      return parseFloat(this.$route.query.mass) + adducts;
    },

  },

  created() {

  },
  beforeMount() {
    this.gridConfigurationObj = {
      gridData: [],
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: false,
      },
      gridColumnDefs: [
        {
          headerName: 'Adduct',
          colId: 'adduct',
          field: 'adduct',
          cellRenderer: 'searchUrl',
        },
        {
          headerName: 'Hits',
          field: 'hits',
          colId: 'hits',
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
    this.inputs.mass_adducts = parseFloat(this.$route.query.mass_adducts);
    this.inputs.error_da = parseFloat(this.$route.query.error_da) || null;
    this.inputs.error_ppm = parseFloat(this.$route.query.error_ppm) || null;
    this.inputs.min = parseFloat(this.$route.query.min) || null;
    this.inputs.max = parseFloat(this.$route.query.max) || null;
  },
  methods: {
    ...mapMutations({

    }),
    onGridRef(params) {
      // console.log('GridReady')
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      this.gridApi.showLoadingOverlay();
      this.getCounts();

      this.columnApi.applyColumnState({
        state: [
          {
            colId: 'hits',
            sort: 'desc',
          },
        ],
      });
    },

    searchUrl(params) {
      let unit = '';
      let range = '';
      if (this.$route.query.error_da) {
        unit = `error_da=${this.inputs.error_da}`;
      } else if (this.$route.query.error_ppm) {
        unit = `error_ppm=${this.$route.query.error_ppm}`;
      }

      if (this.$route.query.min && this.$route.query.max) {
        range = `min=${this.inputs.min}&max=${this.inputs.max}`;
      }

      return `<a href="search-results?input_type=${this.inputs.input_type}&mass_adducts=${params.data.adductValue}&${range}&mass=${this.inputs.mass}&${unit}">${params.value}</a>`;
    },

    searchRoute(params) {
      let unit = '';
      let range = '';
      if (this.$route.query.error_da) {
        unit = `error_da=${this.inputs.error_da}`;
      } else if (this.$route.query.error_ppm) {
        unit = `error_ppm=${this.$route.query.error_ppm}`;
      }

      if (this.$route.query.min && this.$route.query.max) {
        range = `min=${this.inputs.min}&max=${this.inputs.max}`;
      }
      return `search-results?input_type=${this.inputs.input_type}&mass_adducts=${params.data.adductValue}&${range}&mass=${this.inputs.mass}&${unit}`;
    },

    runTask(spec) {
      return this.$repositories.chemicalSearch.count(spec.range);
    },

    parseQueryInputs(adduct) {
      let min,
        max;
      const adductParsed = parseFloat(adduct.value);
      if (this.inputs.error_da != null) {
        min = this.inputs.mass + adductParsed - this.inputs.error_da;
        max = this.inputs.mass + adductParsed + this.inputs.error_da;
      } else if (this.inputs.error_ppm != null) {
        const baseMass = this.inputs.mass + adductParsed;
        const error = this.inputs.error_ppm * baseMass / 1000000;
        min = baseMass - error;
        max = baseMass + error;
      } else {
        min = this.inputs.min + adductParsed;
        max = this.inputs.max + adductParsed;
      }
      const range = `${min}/${max}`;
      return {adduct: adduct.text, range: range};
    },

    getAllAdducts() {
      const calls = this.adductValues.map(this.parseQueryInputs);
      return calls;
    },

    async getCounts() {
      const tasks = this.getAllAdducts().map(this.runTask);
      const results = await Promise.all(tasks);
      const counts = [];
      results.forEach((value, i) => {
        counts.push({
          adduct: this.adductValues[i].text,
          adductValue: this.adductValues[i].value,
          hits: value,

        });
      });
      this.gridConfigurationObj.gridData = counts;
    },

    async onExportData(params) {
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        const fname = `All Adducts-${params.fileName}`;

        const hasSelectedRows = this.gridApi.getSelectedRows().length > 0;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Worksheet1');
        worksheet.columns = this.exportColDefs;

        this.gridApi.forEachNodeAfterFilterAndSort((node, index) => {
          if ((hasSelectedRows && (node.data.selected || node.selected)) || !hasSelectedRows) {
            const rowData = node.data;
            worksheet.addRow(rowData);
          }
        });

        // format the header record
        worksheet.getRow(1).eachCell((cell, cellNumber) => {
          cell.font = {
            bold: true,
          };
        });
        // freeze header row and first column
        worksheet.views = [
          {
            state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'B2',
          },
        ];

        const column2Format = worksheet.getColumn(1);
        const appUrl = process.env.APPLICATION_EXTERNAL_LINK_URL;
        const base = process.env.APPLICATION_ROUTER_BASE;

        column2Format.eachCell((cell, rowNumber) => {
          if (rowNumber !== 1) {
            const p = {};
            p.data = {};
            p.data.adductValue = this.adductValues.find(obj => obj.text === cell.text).value;
            const sUrl = this.searchRoute(p);
            const url = `${appUrl}${base}${sUrl}`;
            cell.value = {text: cell.text, hyperlink: url};
          }
        });

        await workbook.xlsx.writeBuffer().then((data) => {
          const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.setAttribute('download', `${fname}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
    },


  },
};
</script>
