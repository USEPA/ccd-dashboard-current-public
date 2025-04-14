<template>
  <div class="container-fluid left-fullwidth-container content pt-3">
    <client-only>
      <div class="row">
        <div class="col-xl-8 col-lg-12 mb-3">
          <SsKetcher
            ref="ketcher"
            :disabled="ketcherDisabled"
            @ketcherLoaded="onKetcherLoaded"
            @structureChanged="onStructureChanged"
          />
        </div>
        <div class="col-xl-4 col-lg-12">
          <div class="predict-sidebar">
            <div>
              <ul id="myTab" class="nav nav-tabs properties-tab" role="tablist">
                <li class="nav-item">
                  <a
                    id="searchM"
                    :class="{ disabled: false, active: true, enabledforuse: true }"
                    aria-controls="searchM"
                    aria-selected="true"
                    class="nav-link provider-nav font-weight-bold"
                    data-toggle="tab"
                    role="tab"
                  >
                    Search Type
                  </a>
                </li>
              </ul>
              <div class="tab-container">
                <div class="tab-content container">
                  <div
                    aria-labelledby="searchM"
                    class="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <SearchOptions v-model="searchOptions" :filters="filters" />

                    <b-button
                      :disabled="submitDisabled"
                      variant="primary"
                      @click.stop="onStructureSearch()"
                    >
                      Search
                      <b-spinner v-if="inProgress" small />
                    </b-button>
                    <div v-if="noResults" class="alert alert-danger mt-2" role="alert">
                      No Chemicals found for this search.
                    </div>
                    <div v-if="notSearchable" class="alert alert-danger mt-2" role="alert">
                      This structure is not searchable. You may edit to a searchable form.
                    </div>
                    <b-modal
                      v-model="showExportModal"
                      :title="title"
                      style="color: #fff !important"
                      :header-class="['primary-color', 'text-white', 'font-weight-bold']"
                    >
                      <template #modal-title>
                        <h4 class="text-white">
                          {{ title }}
                        </h4>
                      </template>
                      <p>
                        Your export request is being processed. <br>
                        Requests with lots of additional fields or Enhanced Data sheets
                        will take longer to process.
                      </p>
                      <div class="text-center">
                        <b-button
                          v-if="exportDownloadLink != ''"
                          style="color: #fff !important"
                          size="sm"
                          variant="primary"
                          :href="exportDownloadLink"
                          @click="$emit('downloaded')"
                        >
                          Download File
                        </b-button>
                        <b-button v-else variant="primary" disabled>
                          <b-spinner small type="grow">
                            <span class="sr-only">Loading...</span>
                          </b-spinner>
                          Loading...
                        </b-button>
                      </div>
                      <template #modal-footer="{ ok, cancel, hide }">
                        <!-- Emulate built in modal footer ok and cancel button actions -->
                        <b-button size="sm" variant="primary" @click="ok()">
                          OK
                        </b-button>
                        <b-button
                          size="sm"
                          variant="danger"
                          @click="
                            $emit('downloaded');
                            cancel();
                          "
                        >
                          Cancel
                        </b-button>
                      </template>
                    </b-modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="chemicals.length > 0" id="search-results" class="row mr-4">
        <div class="col-12">
          <Results
            v-if="chemicals.length > 0 && resultsView === 'nonSim'"
            :row-data="chemicals"
            :search-name="searchName"
            :cname="cname"
            :loading="isLoading"
            :percent-done="percentDone"
            :chunk-data="chunkData"
            :grid-size="gridSize"
            :input_type="inputType"
            :custom-sort="customSort"
            :csearch="csearch"
            search-type="nonSim"
            :config-obj="gridConfigurationObj"
            grid-reference="results"
            grid-heading="Search Results"
            @gridRef="onGridRef"
          />
          <Results
            v-if="chemicals.length > 0 && resultsView === 'Sim'"
            :row-data="chemicals"
            :search-name="searchName"
            :cname="cname"
            :loading="isLoading"
            :percent-done="percentDone"
            :chunk-data="chunkData"
            :grid-size="gridSize"
            :input_type="inputType"
            :custom-sort="customSort"
            :csearch="csearch"
            search-type="Sim"
            :config-obj="gridSimConfigurationObj"
            grid-reference="results"
            grid-heading="Search Results"
            @gridRef="onGridRef"
            @exportData="onExportData"
          />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-mixed-operators */
import Axios from 'axios';
// eslint-disable-next-line no-shadow
import {scrollTo} from 'vue-scrollto';
import SsKetcher from '~/components/sssComponents/Lookup/Ketcher.vue';
import Results from '~/components/results/Results.vue';
import SearchOptions from '~/components/sssComponents/Search/SearchOptions.vue';

export default {
  components: {
    SearchOptions,
    SsKetcher,
    Results,
  },
  data() {
    return {
      inProgress: false,
      searchResult: null,
      errorMessage: null,
      notSearchable: false,
      noResults: false,
      toxval: false,
      searchOptions: {
        searchType: 'SUBSTRUCTURE',
        exportSearchType: 'Substructure',
        minSimilarity: 0.85,
        useSimilarity: false,
        similarityType: 'tanimoto',
        formula: null,
        queryFormula: false,
        minMass: null,
        maxMass: null,
        massType: 'monoisotopic-mass',
        singleComponent: true,
        features: [],
        includeElements: null,
        excludeElements: null,
        hazardName: null,
        hazardSource: null,
        hazardRoute: null,
        hazardCategory: null,
        hazardCode: null,
        hazardOrganism: null,
        toxicity: null,
        authority: null,
        toxval: false,
      },
      resultsView: '',
      sortBy: 'similarity',
      sortDirection: 'desc',
      ketcherInstance: null,
      currentPage: 1,
      chemicals: [],
      chemicalRange: [],
      gridConfigurationObj: {},
      gridSimConfigurationObj: {},
      batchchemicals: null,
      gridSize: 'height: 600px; overflow:auto',
      cname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      inputType: '',
      csearch: '',
      exportColDefs: [],
      isLoading: false,
      chunkData: [],
      percentDone: 0,
      additionalTileOptions: [],
      customSort: {},
      batchObj: {},
      showExportModal: false,
      exportDownloadLink: '',
      finalExportJobId: '',
      exportStatus: null,
      pollInterval: null,
      title: 'Exporting in progress',
      chemicalsToSubmit: [],
      headerBgVariant: 'primary',
      headerTextVariant: 'light',
      molVersion: '',
      hasPagedOption: false,
      paging: {},
      smiles: '',
      searchName: '',
      filters: [
        {
          text: 'Stereo',
          value: 'filter-stereo',
          state: null,
          count: null,
          next: true,
        },
        {
          text: 'Chiral',
          value: 'filter-chiral',
          state: null,
          count: null,
          next: true,
        },
        {
          text: 'Isotopes',
          value: 'filter-isotopes',
          state: null,
          count: null,
          next: false,
        },
        {
          text: 'Charged',
          value: 'filter-charged',
          state: null,
          count: null,
          next: false,
        },
        {
          text: 'Multicomponent',
          value: 'filter-multicomponent',
          state: null,
          count: null,
          next: false,
        },
        {
          text: 'Radicals',
          value: 'filter-radicals',
          state: null,
          count: null,
          next: false,
        },
        {
          text: 'Salts',
          value: 'filter-salts',
          state: null,
          count: null,
          next: false,
        },
        {
          text: 'Polymers',
          value: 'filter-polymers',
          state: null,
          count: null,
          next: false,
        },
        {
          text: 'Sgroups',
          value: 'filter-sgroups',
          state: null,
          count: null,
          next: false,
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      getGridDefs: 'sssChemicalResultsConfig/getBaseGridDefs',
      getSimGridDefs: 'chemicalSimResultsConfig/getBaseGridDefs',
      getSimExportColDefs: 'chemicalSimResultsConfig/getExportColDefs',
      getToolBar: 'sssChemicalResultsConfig/getBaseToolBar',
      getSimToolBar: 'chemicalSimResultsConfig/getBaseToolBar',
    }),
    somethingFound() {
      return (
        this.searchResult && this.searchResult.records && this.searchResult.records.length
      );
    },
    submitDisabled() {
      const foundBadSmiles = (this.smiles.includes(':') || this.smiles.includes('*'));
      if (foundBadSmiles) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.notSearchable = true;
      }
      if (!foundBadSmiles) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.notSearchable = false;
      }
      if (!this.smiles.length || this.inProgress || foundBadSmiles) {
        return true;
      }
      return false;
    },
    exportFileName() {
      let fileName = 'Substructure';
      if (this.searchOptions.useSimilarity) {
        fileName = 'Similarity';
      }
      return fileName;
    },
    ketcherDisabled() {
      return (
        this.searchOptions.searchType === 'FEATURES' ||
        this.searchOptions.searchType === 'ADVANCED' ||
        this.searchOptions.searchType === 'FORMULA' ||
        this.searchOptions.searchType === 'MASS'
      );
    },
  },
  watch: {
    exportStatus(newStatus) {
      if (newStatus === true) {
        this.exportDownloadLink = `${process.env.APPLICATION_BASE_API}${
          this.apiSettings().BATCH_SEARCH_EXPORT_CONTENT_API
        }${this.finalExportJobId}`;
      }
    },
  },
  created() {
    const baseSortOptions = this.getSimToolBar().sortOptions;
    // if (this.additionalSortOptions.length > 0) {
    //   baseSortOptions = baseSortOptions.concat(this.additionalSortOptions)
    // }
    this.setSortOptions(baseSortOptions);
    this.setFilterOptions(this.getSimToolBar().filterOptions);
    this.setTileInfoOptions(this.getSimToolBar().tileInfoOptions);
    let baseToolInfoOptions = this.getSimToolBar().tileInfoOptions;
    if (this.additionalTileOptions.length > 0) {
      baseToolInfoOptions = baseToolInfoOptions.concat(this.additionalTileOptions);
    }
    this.setTileInfoOptions(baseToolInfoOptions);
  },
  beforeMount() {
    this.gridConfigurationObj = {
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      statusBar: {
        statusPanels: [
          {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
          {statusPanel: 'agTotalRowCountComponent', align: 'center'},
          {statusPanel: 'agSelectedRowCountComponent'},
        ],
      },
      gridColumnDefs: this.getGridDefs(),
      gridOptions: {
        valueCache: true,
        suppressContextMenu: true,
        rowHeight: 100,
        rowSelection: 'multiple',
        headerHeight: 50,
        unSortIcon: true,
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          toxCastPercent: this.toxCastPercent,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          roundTo6: this.roundTo6,
          formatPreferredName: this.formatPreferredName,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
          toxvalDisplay: this.toxvalDisplay,
          similarityDisplay: this.similarityDisplay,
          GridPopover: this.GridPopover,
        },
      },
    };
    this.gridConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
    this.gridSimConfigurationObj = {
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      statusBar: {
        statusPanels: [
          {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
          {statusPanel: 'agTotalRowCountComponent', align: 'center'},
          {statusPanel: 'agSelectedRowCountComponent'},
        ],
      },
      gridColumnDefs: this.getSimGridDefs(),
      gridOptions: {
        valueCache: true,
        suppressContextMenu: true,
        tooltipShowDelay: 500,
        rowHeight: 100,
        rowSelection: 'multiple',
        headerHeight: 50,
        unSortIcon: true,
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          toxCastPercent: this.toxCastPercent,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          roundTo6: this.roundTo6,
          formatPreferredName: this.formatPreferredName,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
          toxvalDisplay: this.toxvalDisplay,
          similarityDisplay: this.similarityDisplay,
          GridPopover: this.GridPopover,
        },
      },
    };
    this.gridSimConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
    this.exportColDefs = this.getSimExportColDefs();
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
    onKetcherLoaded(k) {
      this.ketcherInstance = k;
    },
    onStructureChanged(smiles) {
      this.smiles = smiles;
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      if (this.hasPagedOption) {
        this.getChemicalChunks();
      }
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
          fileName: `${this.exportFileName}-SearchResults-${timeStamp}`,
          gridApi: this.gridApi,
          fileFormat: params.fileType,
          columns: this.exportColDefs,
          splitSheet: {xSplit: 1, ySplit: 1},
        });
      }
    },
    async startBatchExport() {
      this.batchObj = {
        identifierTypes: ['chemical_name', 'CASRN', 'INCHIKEY', 'dtxsid'],
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
        if (
          (hasSelectedRows && (node.data.selected || node.selected)) ||
          !hasSelectedRows
        ) {
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
      const statusURL = `${process.env.APPLICATION_BASE_API}${
        this.apiSettings().BATCH_SEARCH_EXPORT_STATUS_API
      }${exportJobId}?${Date.now().toString(36)}`;
      this.$axios.get(statusURL).then((response) => {
        if (response.data === true) {
          clearInterval(this.pollInterval);
          this.exportStatus = response.data;
          this.finalExportJobId = exportJobId;
        }
        this.exportStatus = response.data;
      });
    },
    startInterval(exportJobId) {
      this.pollInterval = setInterval(() => {
        this.fetchData(exportJobId);
      }, 5000);
    },
    showHideExportModal() {
      this.showExportModal = !this.showExportModal;
    },

    setFilterCount(id, count) {
      const filter = this.filters.find(f => f.value === id);
      if (filter) {
        filter.count = count;
      }
    },

    onStructureSearch() {
      this.inProgress = true;
      this.errorMessage = null;
      this.noResults = false;
      this.chemicals = [];
      this.chunkData = [];

      switch (this.searchOptions.searchType) {
      case 'SUBSTRUCTURE':
        this.searchName = 'Substructure';
        this.resultsView = 'Sim';
        Promise.resolve(this.ketcherInstance.getSmilesAsync()).then((value) => {
          const toxvalFlag = this.searchOptions.toxval ? '&toxval=Y' : '';
          const newSmiles = value == 'C1C=CC=CC=1' ? 'C1=CC=CC=C1' : value;
          const smilesEncoded = encodeURIComponent(newSmiles);
          const substructureSearchURL = `${process.env.APPLICATION_BASE_API}similar-compound/substructure/?smiles=${smilesEncoded}&includes=${this.searchOptions.includeElements}&excludes=${this.searchOptions.excludeElements}${toxvalFlag}`;
          Axios.get(substructureSearchURL)
            .then((response) => {
              this.inProgress = false;
              this.chemicals = response.data.map((chem, idx) => ({
                ...chem,
                uuId: idx + 1,
                displayName: chem.preferredName || chem.iupacName,
              }));
              this.chunkData = this.chemicals;
              if (this.chemicals.length > 0) {
                scrollTo('#search-results', 500, {easing: 'ease-in-out'});
              } else {
                this.noResults = true;
              }
            })
            .catch((error) => {
              this.inProgress = false;
              this.parseSearchError(error);
            });
        });
        break;

      case 'SIMILAR':
        this.searchName = 'Similarity';
        this.resultsView = 'Sim';
        Promise.resolve(this.ketcherInstance.getSmilesAsync()).then((value) => {
          const {minSimilarity} = this.searchOptions;
          const toxvalFlag = this.searchOptions.toxval ? '&toxval=Y' : '';
          const newSmiles = value == 'C1C=CC=CC=1' ? 'C1=CC=CC=C1' : value;
          const smilesEncoded = encodeURIComponent(newSmiles);
          const similarSearchURL = `${process.env.APPLICATION_BASE_API}similar-compound/no-known/${minSimilarity}?smiles=${smilesEncoded}&includes=${this.searchOptions.includeElements}&excludes=${this.searchOptions.excludeElements}${toxvalFlag}`;
          Axios.get(similarSearchURL)
            .then((response) => {
              this.inProgress = false;
              this.chemicals = response.data.map((chem, idx) => ({
                ...chem,
                uuId: idx + 1,
                displayName: chem.preferredName || chem.iupacName,
              }));
              this.chunkData = this.chemicals;
              if (this.chemicals.length > 0) {
                this.gotResults = true;
                scrollTo('#search-results', 500, {easing: 'ease-in-out'});
              } else {
                this.noResults = true;
              }
            })
            .catch((error) => {
              this.inProgress = false;
              this.parseSearchError(error);
            });
        });

        break;

      case 'FORMULA': {
        this.searchName = 'Molecular Fomula';
        this.resultsView = 'nonSim';
        const query = this.searchOptions.formula;
        const toxvalFlag = this.toxval ? '?toxval=Y' : '';
        const molFormulaSearch = `${process.env.APPLICATION_BASE_API}${
          this.apiSettings().CHEMICAL_SEARCH_MSREADY_API
        }${query}${toxvalFlag}`;

        Axios.get(molFormulaSearch)
          .then((response) => {
            this.inProgress = false;
            this.chemicals = response.data;
            this.chunkData = response.data;
            if (this.chemicals.length > 0) {
              this.gotResults = true;
              scrollTo('#search-results', 500, {easing: 'ease-in-out'});
            } else {
              this.noResults = true;
            }
          })
          .catch((error) => {
            this.inProgress = false;
            this.parseSearchError(error);
          });

        break;
      }
      case 'MASS': {
        this.searchName = 'Molecular Weight';
        this.resultsView = 'nonSim';

        this.hasPagedOption = true;
        let range = '';
        let minDelta = 0;
        let maxDelta = 0;
        let {mass} = this.searchOptions;
        const {
          minMass,
          maxMass,
          deltaMass,
          unitsDaltons,
          massPlusMinus,
        } = this.searchOptions;

        mass = parseFloat(mass);
        if (massPlusMinus) {
          if (unitsDaltons) {
            minDelta = mass - deltaMass;
            maxDelta = mass + parseFloat(deltaMass);
          } else {
            minDelta = mass - Number((deltaMass * mass) / 25);
            maxDelta = mass + Number((deltaMass * mass) / 25);
          }
          range = `${minDelta}/${maxDelta}`;
        } else {
          range = `${minMass}/${maxMass}`;
        }

        const toxvalFlag = this.toxval ? '&toxval=Y' : '';

        const massSearch = `${process.env.APPLICATION_BASE_API}ccdapp1/search/mass2/${range}?includes=${this.searchOptions.includeElements}&excludes=${this.searchOptions.excludeElements}${toxvalFlag}`;
        this.chemicals = [];
        Axios.get(massSearch)
          .then((response) => {
            this.chemicals = response.data;
            this.chunkData = response.data;
            if (this.chemicals.length > 0) {
              this.gotResults = true;
              scrollTo('#search-results', 500, {easing: 'ease-in-out'});
            } else {
              this.noResults = true;
            }
          })
          .catch((error) => {
            this.inProgress = false;
            this.parseSearchError(error);
          });
        break;
      }

      default:
        break;
      }
    },

    getChemicalChunks(searchStr) {
      this.isLoading = true;
      try {
        for (let index = 1; index < this.paging.totalPages; index += 1) {
          // eslint-disable-next-line no-await-in-loop
          Axios.get(`${searchStr}?size=1000&page=${index}`)
            .then((response) => {
              this.chunkData = response.data.content;
            })
            .catch((error) => {
              this.inProgress = false;
              this.parseSearchError(error);
            });
          this.inProgress = false;
        }
      } catch (ex) {
        this.$sentry.captureMessage(`SSS - error getting chunked data ${ex.toString()}`);
      }
      this.isLoading = false;
    },

    closeErrorMessage() {
      this.errorMessage = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/styles/global-styles.scss";
@import "bootstrap/scss/bootstrap.scss";
@import "bootstrap-vue/src/index.scss";
.child-properties {
  padding-left: 1rem;
}
.modal-header {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
  button .close {
    color: black !important;
  }
}
h5 {
  font-size: 1rem !important;
  color: #f2f3f5 !important;
}
.close {
  color: black !important;
}

.properties-tab {
  margin-bottom: 1rem;
}

.button-wrapper-right {
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}

.nav-tabs .nav-link.enabledforuse {
  color: #f2f3f5 !important;
  cursor: pointer;
  background-color: #1079a8 !important;
}

.category-btn-group {
  display: flex;
  align-items: center;
  height: 2rem;
}

.btn-category {
  width: 2rem;
}

.category-label {
  margin-right: 0.5rem;
}

.btn-fab {
  padding: 0;
  line-height: 0;
  border-color: transparent;
  background: transparent;
  font-size: 0.8rem;

  &:focus {
    box-shadow: none;
  }
}

.btn-outline-dark:hover {
  color: #fff;
  background-color: rgba(52, 58, 64, 0.18);
  border-color: #343a40;
}

.range-padding {
  padding: 0;
}

.page-item.active .page-link {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn .fa-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}

.btn .fa-icon:last-child {
  margin-right: 0;
}
.form-check-label {
  color: rgb(20, 20, 20) !important;
}
</style>
