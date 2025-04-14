<template>
  <client-only>
    <mdb-container fluid class="content left-fullwidth-container pl-0 pr-0">
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
          <p class="ml-3" data-cy="searched-with">
            <span v-if="inputType==='exact_formula'" class="card-text" v-html="formattedFormula(searchTerm)" />
            <span v-else class="card-text"> {{ searchTerm }}. <span v-if="cpDatSearch" data-cy="cp-dat"> More detailed use and product category results are available in the <a href="https://comptox.epa.gov/chemexpo" alt="link to https://comptox.epa.gom/chemexpo" target="_blank" rel="noopener noreferrer">ChemExpo Knowledgebase</a>.</span>
              <span v-if="$route.query.error_da">{{ massTotal }} +/- {{ $route.query.error_da }} Da.</span>
              <span v-if="$route.query.error_ppm">{{ massTotal }} +/- {{ $route.query.error_ppm }} ppm.</span>
              <span v-if="$route.query.min">{{ minMaxMassTotal }} Da.</span>
            </span>
          </p>
        </div>
      </div>
      <export-modal
        :title="title"
        :visibility="showExportModal"
        :export-download-link="exportDownloadLink"
        @toggleVisibility="showHideExportModal"
      />
      <Results
        v-if="!tooManyResults"
        :row-data="chemicals"
        :cname="cname"
        :loading="isLoading"
        :percent-done="percentDone"
        :chunk-data="chunkData"
        :grid-size="gridSize"
        :input_type="inputType"
        :custom-sort="customSort"
        :csearch="csearch"
        :copy-url-config="copyUrlConfig"
        :config-obj="gridConfigurationObj"
        grid-reference="results"
        grid-heading="Search Results"
        @gridRef="onGridRef"
        @exportData="onExportData"
      />
      <div v-if="tooManyResults" class="alert alert-primary p-2" role="alert">
        It is taking too long to return the results for your requested search. Please go back and refine your search.
      </div>
    </mdb-container>
  </client-only>
</template>

<script>
/* eslint-disable no-case-declarations */
import {mdbContainer} from 'mdbvue';
import {
  mapGetters, mapMutations, mapState,
} from 'vuex';
import ExportModal from '~/components/batch-search/ExportModal.vue';
import Results from '~/components/results/Results.vue';


export default {
  name: 'SearchResultsPage',
  components: {
    mdbContainer,
    Results,
    ExportModal,
  },
  data: () => ({
    gridConfigurationObj: {},
    batchchemicals: null,
    gridSize: 'height: 600px; overflow:auto',
    cname: {
      camelName: 'results',
      hyphenName: 'results',
      baseName: 'Results',
    },
    exportColDefs: [],
    isLoading: false,
    chunkData: [],
    percentDone: 0,
    additionalTileOptions: [],
    customSort: {},
    copyUrlConfig: {
      copy: true,
      copyButtonTipText: 'Copy Url',
    },

    batchObj: {},
    cpDatSearch: false,
    showExportModal: false,
    exportDownloadLink: '',
    finalExportJobId: '',
    exportStatus: null,
    pollInterval: null,
    title: 'Exporting in progress',
    chemicalsToSubmit: [],
    molVersion: '',

  }),

  computed: {
    ...mapGetters({
      getGridDefs: 'chemicalResultsConfig/getBaseGridDefs',
      getExportColDefs: 'chemicalResultsConfig/getExportColDefs',
      getToolBar: 'chemicalResultsConfig/getBaseToolBar',
      getTileInfo: 'results/getTileInfo',
    }),
    csearch() {
      let searchStr = '';
      if (this.$route.query.search) {
        searchStr = this.$route.query.search;
      }
      return searchStr;
    },
    massTotal() {
      const adducts = parseFloat(this.$route.query.mass_adducts) || 0;
      return parseFloat(this.$route.query.mass) + adducts;
    },
    minMaxMassTotal() {
      const adducts = parseFloat(this.$route.query.mass_adducts) || 0;
      const formattedMassRange = `${parseFloat(this.$route.query.min) + adducts} to ${parseFloat(this.$route.query.max) + adducts} `;
      return formattedMassRange;
    },
    searchTerm() {
      let headText = '';
      const text = this.inputString;
      switch (this.inputType) {
      case 'inchikey_skeleton':
        headText = 'Searched with InChI Key Skeleton';
        break;
      case 'synonym_substring':
        headText = 'Searched with Synonym Substring';
        break;
      case 'consumer_product':
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.cpDatSearch = true;
        headText = 'Searched Product Use Category';
        break;
      case 'puc':
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.cpDatSearch = true;
        headText = 'Searched Product Use Category';
        break;
      case 'keyword':
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.cpDatSearch = true;
        headText = 'Searched Product Use Category with Keyword';
        break;
      case 'ms_ready_monoisotopic_mass':
        headText = 'Searched for Mass';
        break;
      case 'contains_formula':
        headText = 'Searched for Formula Contains';
        break;
      case 'ms_ready_formula':
        headText = 'Searched for MS Ready Formula(e)';
        break;
      case 'exact_formula':
        headText = 'Searched for Exact Formula(e)';
        break;
      case 'equalsDetails':
        headText = 'Exact search';
        break;
      // case 'batch':
      //   headText = 'Batch Search By Synonym'
      //   break
      default:
        headText = 'Searched with Synonym Substring';
      }
      return `${headText}: ${this.inputType === 'ms_ready_formula' || this.inputType === 'contains_formula' ? this.formattedSearchInput(text) : text}`;
    },
  },
  watch: {
    exportStatus(newStatus) {
      if (newStatus === true) {
        this.exportDownloadLink = `${process.env.APPLICATION_BASE_API}${this.apiSettings().BATCH_SEARCH_EXPORT_CONTENT_API}${this.finalExportJobId}`;
      }
    },
  },
  async asyncData(context) {
    const inputType = context.query.input_type;
    let tooManyResults = false;
    let chemicals = [];
    let errorMessage = null;
    const chemicalsToSubmit = [];
    let chemicalRange = [];
    let additionalTileOptions = [];
    let additionalSortOptions = [];
    let additionalColumns = [];
    let min,
      max;
    const inputs = [];
    let inputString = context.query.inputs || '';
    let range = '';
    const paging = {};
    const adductParsed = 0;
    let hasPagedOption = false;

    let altTileInfo = [];
    let preferredSort = [];

    const isBatchSearch = false;
    const batchChemicals = [];

    switch (inputType) {
    case 'inchikey_skeleton':
      chemicals = await context.app.$repositories.chemicalSearch.startsWithDetails(context.query.inputs);
      break;
    case 'synonym_substring':
      chemicals = await context.app.$repositories.chemicalSearch.containsDetails(context.query.inputs, context.$sentry);
      if (chemicals.length === 1 && chemicals[0].message) {
        tooManyResults = true;
      }
      break;
    case 'consumer_product':
      const productinput = context.query.inputs;
      const categorysplit = productinput.split(':');
      const chemicalsToFilter = await context.app.$repositories.productSearch.chemicalsByProduct(categorysplit[1]);
      chemicals = chemicalsToFilter.filter(a => a.searchMatch === categorysplit[0]);
      break;
    case 'puc':
      const productcategory = context.query.inputs;
      chemicals = await context.app.$repositories.productSearch.chemicalsByProduct(productcategory);
      break;
    case 'keyword':
      const keyword = context.query.inputs;
      chemicals = await context.app.$repositories.productSearch.chemicalsByProduct(keyword);
      break;
    case 'ms_ready_monoisotopic_mass':
      hasPagedOption = true;
      let isMinMaxSearch = false;
      inputs.mass = parseFloat(context.query.mass);
      inputs.mass_adducts = parseFloat(context.query.mass_adducts) || 0;
      inputs.error_da = parseFloat(context.query.error_da) || null;
      inputs.error_ppm = parseFloat(context.query.error_ppm) || null;
      inputs.min = parseFloat(context.query.min) || null;
      inputs.max = parseFloat(context.query.max) || null;
      const baseMass = inputs.mass + inputs.mass_adducts;
      if (inputs.error_da != null) {
        min = inputs.mass + inputs.mass_adducts - inputs.error_da;
        max = inputs.mass + inputs.mass_adducts + inputs.error_da;
      } else if (inputs.error_ppm != null) {
        const error = inputs.error_ppm * baseMass / 1000000;
        min = baseMass - error;
        max = baseMass + error;
      } else {
        min = inputs.min + inputs.mass_adducts;
        max = inputs.max + inputs.mass_adducts;
        isMinMaxSearch = true;
      }

      if (!isMinMaxSearch) {
        additionalTileOptions = [{label: 'Mass Diff.', id: 'massDiff'}];
        additionalSortOptions = [{text: 'Mass Diff.', value: 'massDiff'}];
        altTileInfo = ['dtxsid', 'casrn', 'toxcast', 'massDiff'];
        preferredSort = [{colId: 'massDiff', sort: 'asc'}];
        additionalColumns = [
          {
            headerName: 'Mass Difference',
            filter: 'agTextColumnFilter',
            field: 'massDiff',
            minWidth: 95,
            maxWidth: 165,
            width: 100,
            floatingFilterComponentParams: {suppressFilterButton: false},
            cellRenderer: 'roundTo6',
            suppressMenu: true,
            resizable: false,
            sortable: true,
            hide: false,
          },
        ];
        range = `${min}/${max}?mass=${baseMass}`;
        try {
          const response = await context.app.$repositories.chemicalSearch.massSearch(`${range}&size=1000`);
          // api paging is different for this call , so the data has to be conformed
          // so the chunkedData calls will work
          chemicals = response.content;
          paging.totalPages = response.totalPages;
          errorMessage = response.error;
        } catch (err) {
          errorMessage = `error retrieving data: mass range search failed with the the following error - ${err}`;
          chemicals = [];
          paging.totalPages = 0;
          console.error('errorMessage:', errorMessage);
        }
      } else {
        try {
          range = `${min}/${max}?mass=0`;
          const response = await context.app.$repositories.chemicalSearch.massSearch(`${range}&size=1000`, context);
          // api paging is different for this call , so the data has to be conformed
          // so the chunkedData calls will work
          chemicals = response.content;
          paging.totalPages = response.totalPages;
          errorMessage = response.error;
        } catch (err) {
          errorMessage = `error retrieving data: mass range search failed with the the following error - ${err}`;
          console.error('errorMessage:', errorMessage);
          chemicals = [];
          paging.totalPages = 0;
        }
      }
      break;

    case 'contains_formula':
      const containsParams = {
        formula: encodeURIComponent(context.query.inputs),
        currentCount: 0,
      };
      const containsResults = await context.app.$repositories.chemicalSearch.containsFormulaSearch(containsParams);
      chemicals = containsResults.content;
      break;

    case 'ms_ready_formula':
      const params = {
        formula: encodeURIComponent(context.query.inputs),
        currentCount: 0,
      };
      chemicalRange = await context.app.$repositories.chemicalSearch.formulaRange(context.query.inputs);
      const results = await context.app.$repositories.chemicalSearch.msReadySearch(params);
      chemicals = results.content;
      inputString = chemicalRange.join(', ');
      break;

    case 'exact_formula':
      chemicalRange = await context.app.$repositories.chemicalSearch.formulaRange(encodeURIComponent(context.query.inputs));
      if (chemicalRange.length > 1) {
        inputString = chemicalRange.join(', ');
      } else {
        inputString = context.query.inputs;
      }
      chemicals = await context.app.$repositories.chemicalSearch
        .exactFormulaSearch(encodeURIComponent(context.query.inputs));
      break;
    case 'equalsDetails':
      const searchString = encodeURIComponent(context.query.inputs);
      try {
        const equalsSearch = await context.app.$repositories.chemicalSearch
          .equals(decodeURIComponent(searchString), context.$sentry);
        chemicals = equalsSearch;
      } catch (e) {
        console.error(e);
      }
      break;
    default:
      chemicals = await context.app.$repositories.chemicalSearch.containsDetails(context.form.input_type, this.$sentry);
    }
    if (chemicals.length > 0) {
      chemicals = chemicals.map((chem, idx) => ({
        ...chem, uuId: idx + 1, preferredName: chem.preferredName,
      }));
    }
    return {
      chemicals,
      chemicalRange,
      loading: false,
      inputType: inputType,
      exportType: inputType,
      inputString: inputString,
      additionalTileOptions,
      additionalSortOptions,
      additionalColumns,
      paging,
      range,
      hasPagedOption,
      isBatchSearch,
      batchChemicals,
      altTileInfo,
      preferredSort,
      errorMessage,
      tooManyResults,
    };
  },
  created() {
    let baseSortOptions = this.getToolBar().sortOptions;
    if (this.additionalSortOptions.length > 0) {
      baseSortOptions = baseSortOptions.concat(this.additionalSortOptions);
    }
    this.setSortOptions(baseSortOptions);
    this.setFilterOptions(this.getToolBar().filterOptions);
    this.setTileInfoOptions(this.getToolBar().tileInfoOptions);
    let baseToolInfoOptions = this.getToolBar().tileInfoOptions;
    if (this.additionalTileOptions.length > 0) {
      baseToolInfoOptions = baseToolInfoOptions.concat(this.additionalTileOptions);
    }
    this.setTileInfoOptions(baseToolInfoOptions);

    if (this.inputType.includes('_mass') || this.inputType.includes('_formula')) {
      this.setFilterModel(['multicomponent']);
    }
  },
  beforeMount() {
    if (this.altTileInfo.length > 0) {
      this.setTileInfo(this.altTileInfo);
    }
    if (this.preferredSort.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      this.customSort = this.preferredSort[0];
    }

    this.exportColDefs = this.getExportColDefs();

    this.colDefs = this.getGridDefs();
    if (!this.inputType.includes('_mass')) {
      let massDiff = null;
      this.exportColDefs = this.exportColDefs.map((col, idx) => {
        if (col.key === 'massDiff') {
          massDiff = idx;
        }
        return col;
      });
      this.exportColDefs.splice(massDiff, 1);
    }
    this.colDefs = this.colDefs.map((col) => {
      if (col.children) {
        col.children.map((child) => {
          if (child.valueFormatter) {
            child.valueFormatter = this[child.valueFormatter];
          }
          if (child.valueGetter) {
            child.valueGetter = this[child.valueGetter];
          }
          return child;
        });
      }
      if (col.valueFormatter) {
        col.valueFormatter = this[col.valueFormatter];
      }
      if (col.valueGetter) {
        col.valueGetter = this[col.valueGetter];
      }
      if (col.getQuickFilterText) {
        col.getQuickFilterText = this[col.getQuickFilterText];
      }
      return col;
    });
    if (this.additionalColumns.length > 0) {
      this.colDefs = this.colDefs.concat(this.additionalColumns);
    }

    this.gridConfigurationObj = {
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridColumnDefs: this.colDefs,
      gridOptions: {
        valueCache: true,
        suppressContextMenu: true,
        rowHeight: 100,
        tooltipShowDelay: 500,
        rowSelection: 'multiple',
        headerHeight: 50,

        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          roundTo6: this.roundTo6,
          formatPreferredName: this.formatPreferredName,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
        },
      },
    };
    this.gridConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
  },
  mounted() {
    if (this.chemicals.length === 1 && this.chemicals[0]?.message && this.searchTerm === 'synonym_substring') {
      this.tooManyResults = true;
    }
    if (this.errorMessage) {
      console.error(this.errorMessage);

      this.$notify.error({
        message: this.errorMessage, position: 'top right', timeOut: 5000,
      });
    }
  },
  methods: {
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setFilterModel: 'results/setFilterModel',
      setTileInfo: 'results/setTileInfo',
    }),

    async getChemicalChunks() {
      this.isLoading = true;
      const percentChunk = parseInt(100 / this.paging.totalPages, 10);
      this.percentDone = percentChunk;
      try {
        for (let index = 1; index < this.paging.totalPages; index += 1) {
          // eslint-disable-next-line no-await-in-loop
          const response = await this.$repositories.chemicalSearch.massSearch(`${this.range}&size=1000&page=${index}`);

          this.chunkData = response.content;
          this.percentDone += percentChunk;
        }
      } catch (ex) {
        console.error(ex);
      }
      this.isLoading = false;
    },
    formattedFormula(formula) {
      if (!formula) {
        return 'Not Found';
      }
      return formula
        .replace(/\[(\d+)([A-Za-z])/g, '[<sup>$1</sup>$2')
        .replace(/([A-Za-z\]])(\d+)/g, '$1<sub>$2</sub>');
    },
    onExportData(params) {
      const timeStamp = this.dateFormat();
      if (params.fileType === 'sdf2' || params.fileType === 'sdf3') {
        switch (params.fileType) {
        case 'sdf2':
          this.molVersion = 'V2000';
          break;
        case 'sdf3':
          this.molVersion = 'V3000';
          break;

        default:
          this.molVersion = 'V2000';
          break;
        }
        this.startBatchExport();
      } else {
        this.exportData({
          fileName: `${this.exportType}-SearchResults-${timeStamp}`,
          gridApi: this.gridApi,
          fileFormat: params.fileType,
          columns: this.exportColDefs,
          splitSheet: {xSplit: 1, ySplit: 1},
        });
      }
    },

    startInterval(exportJobId) {
      this.pollInterval = setInterval(() => {
        this.fetchData(exportJobId);
      }, 5000);
    },


    async startBatchExport() {
      this.batchObj = {
        identifierTypes: [
          'chemical_name',
          'CASRN',
          'INCHIKEY',
          'dtxsid',
        ],
        massError: 0,
        downloadItems: [
          'CASRN',
          'INCHIKEY',
          'IUPAC_NAME',
          'SMILES',
          'INCHI_STRING',
          'MOLECULAR_FORMULA',
          'AVERAGE_MASS',
          'MONOISOTOPIC_MASS',
          'DTXSID',
          'PREFERRED_NAME',
          'MOL_FILE',
        ],
        searchItems: '',
        inputType: 'IDENTIFIER',
        downloadType: 'SDF',
        molVersion: this.molVersion,
      };

      this.exportDownloadLink = '';
      this.finalExportJobId = null;
      this.exportStatus = false;
      const hasSelectedRows = this.gridApi.getSelectedRows().length > 0;
      this.gridApi.forEachNodeAfterFilterAndSort((node, index) => {
        if (((hasSelectedRows && (node.data.selected || node.selected))) || !hasSelectedRows) {
          this.chemicalsToSubmit.push(node.data.dtxsid);
        }
      });

      this.batchObj.searchItems = this.chemicalsToSubmit.join('\n');
      const exportJobId = await this.$repositories.batchSearch.startBatchSearchExportJob(this.batchObj);
      this.showExportModal = true;

      this.fetchData(exportJobId);
      // check if the status is completed, if not fetch data every 10 secs
      if (this.exportStatus !== true) {
        this.startInterval(exportJobId);
      }
    },

    fetchData(exportJobId) {
      const statusURL = `${process.env.APPLICATION_BASE_API}${this.apiSettings().BATCH_SEARCH_EXPORT_STATUS_API}${exportJobId}?${Date.now().toString(36)}`;
      this.$axios.get(statusURL)
        .then((response) => {
          // console.log('RESPONSE FROM FETCH STATUS', response.data)
          // check if status is completed, if it is stop polling
          if (response.data === true) {
            clearInterval(this.pollInterval);
            this.exportStatus = response.data;
            this.finalExportJobId = exportJobId;
          }
          this.exportStatus = response.data;
        });
    },

    showHideExportModal() {
      this.showExportModal = !this.showExportModal;
    },

    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;

      if (this.hasPagedOption) {
        this.getChemicalChunks();
      }
      this.gridApi.sizeColumnsToFit();
      // if (this.isBatchSearch) {
      //   this.getChemsForBatchSearch()
      // }
    },
  },
};
</script>
<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
@import "~/assets/styles/global-styles/agGrid.scss";
</style>
