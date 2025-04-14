<template>
  <div class="container-fluid">
    <client-only>
      <div class="container">
        <div class="center-aligned">
          <h1 class="title has-text-centered is-2 inline">
            Batch Search
          </h1>
        </div>

        <div id="inputs">
          <div>
            <span class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow">
                1
              </strong>
            </span>
            <strong>Select Input Type(s)</strong>
            <ul>
              <li v-for="checkbox in inputTypeCheckboxes" :key="checkbox.value">
                <input
                  :id="checkbox.value"
                  v-model="inputType"
                  type="checkbox"
                  class="custom-control-input radio"
                  :true-value="checkbox.value"
                  false-value=""
                  style="display: inline-block"
                >
                <label class="custom-control-label radiolabel" :for="checkbox.value" style="display: inline-block">

                  <batch-pop-over
                    :display="checkbox.label"
                    :pop-text="helpTextContent(checkbox.help)"
                    pop-text-placement="right"
                  />
                </label>

                <ul v-if="checkbox.hasOwnProperty('subinputs')" class="subinput-checkboxes">
                  <li v-for="subcheckbox in checkbox.subinputs" :key="subcheckbox.value">
                    <input
                      :id="subcheckbox.value"
                      v-model="synonymTypes"
                      type="checkbox"
                      class="custom-control-input checkbox"
                      :value="subcheckbox.value"
                      style="display: inline-block"
                    >
                    <label class="custom-control-label checkboxlabel" :for="subcheckbox.value">
                      <batch-pop-over
                        :display="subcheckbox.label"
                        :pop-text="helpTextContent(subcheckbox.help)"
                        pop-text-placement="right"
                      />
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div v-if="useMassDiff" id="mass-diff">
            <label for="mass-select">+/-</label>
            <select id="mass-select" v-model="massDiff" class="form-control input-sm">
              <option v-for="n in 10" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
            <label for="mass-select">ppm</label>
          </div>

          <div id="input-chemicals">
            <div v-if="identifiersInputHasInvalidCharacter" id="invalid-input">
              <h4 class="text-danger">
                Invalid character in input. Double quotes
                are not allowed. Please replace the double quotes with single quotes.
              </h4>
              <button
                type="button"
                class="btn btn-default"
                title="Replace double quotes in input with two single quotes"
                @click="replaceQuotes('\'\'')"
              >
                Replace
              </button>
            </div>

            <label for="identifiers">
              <span class="fa-stack" style="font-size:10px">
                <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
                <strong class="fa-stack-1x" style="color:snow">
                  2
                </strong>
              </span>
              <strong>Enter Identifiers to Search</strong>
              <p class="identifier-warning">
                (Please enter one identifier per line and limit the number of identifiers to 10,000 or less)
              </p>
            </label>
            <textarea id="identifiers" v-model.trim="identifiers" rows="8" :disabled="step < 1" />
            <div>
              <span class="fa-stack" style="font-size:10px">
                <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
                <strong class="fa-stack-1x" style="color:snow">
                  3
                </strong>
              </span>
              <strong> Select to View Chemical Information OR to Continue Batch Search Export</strong>
              <p class="identifier-warning">
                (More options will display below the selection)
              </p>
              <button
                class="button btn btn-sm btn-default "
                :disabled="step < 2 || useMassDiff || useDtxcid"
                @click="submitDisplayForm"
              >
                <span class="icon"><i class="fa fa-eye" /></span>
                <span>Display All Chemicals</span>
              </button> or
              <button class="button btn btn-sm btn-default " :disabled="step < 2 " @click="showExportOptions">
                <span class="icon"><i class="fa fa-eye" /></span>
                <span>Choose Export Options</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLoading" />
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <export-modal
              :title="title"
              :visibility="showExportModal"
              :export-download-link="exportDownloadLink"
              @toggleVisibility="showHideExportModal"
              @downloaded="hideAfterDownload"
            />
            <div v-if="showDisplayGrid && !useMassDiff " style="height: 100%; width:100%">
              <div v-show="batchGridTotalRows > 0 || chemicals > 0" class="text-center chem-found-bar">
                {{ batchGridTotalRows }} Chemicals Found from {{ numIdentifiersInput }} Input(s)
              </div>
              <Results
                :row-data="chemicals"
                :loading="isLoading"
                :percent-done="percentDone"
                :batch-search-items="batchGridTotalRows"
                :chunk-data="chunkData"
                :cname="batchCname"
                :grid-size="gridSize"
                :config-obj="gridConfigurationObj"
                :copy-url-config="copyUrlConfig"
                :csearch="csearch"
                grid-reference="batchSearchChemicals"
                grid-heading="Batch Search"
                @gridRef="onBatchGridReady"
                @exportData="onExportData"
              />
            </div>
          </div>
        </div>
        <div v-show="noRecordsFound" class="row">
          <div class="col ">
            <div class="text-center" style="margin-top:40px;font-size:24px;color:red">
              No Chemicals found for these Inputs
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="identifiers.length > 0 && outputsExpanded && !showDisplayGrid"
        id="outputs"
        class="container"
        style="margin-top:50px;margin-bottom:50px"
      >
        <div class="row">
          <div class="col ">
            <div class="text-center" style="margin-top:40px;background-color:#419CC6;color:white">
              Customize Export Results
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col">
            <span ref="export" class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow">
                4
              </strong>
            </span>
            <strong>
              Select Output Format to Continue Batch Search Export
            </strong>
            <p class="identifier-warning">
              (More options will display below the selection)
            </p>
          </div>
        </div>
        <!--        <div class="row mt-3">-->
        <!--        </div>-->
        <div class="row mt-3">
          <div class="col">
            <mdb-dropdown id="export-detail-btn">
              <mdb-dropdown-toggle slot="toggle" class="blue lighten-1 text-white" size="sm">
                <mdb-icon icon="download" /> Choose Export Format
              </mdb-dropdown-toggle>
              <mdb-dropdown-menu>
                <mdb-dropdown-item v-for="item in exportOptions" :key="item.value" @click="setExportType(item)">
                  {{ item.text }}
                </mdb-dropdown-item>
              </mdb-dropdown-menu>
            </mdb-dropdown>
          </div>
        </div>
        <div v-show="outputFormat !==''" class="row mt-3">
          <div class="col-6">
            <div class="output-headers  ">
              <ul>
                <li>
                  <input id="selectall" type="checkbox" class="custom-control-input checkbox" @click="selectAll">
                  <label style="font-weight:bold" class="custom-control-label checkboxlabel" for="selectall">
                    Select All columns available
                  </label>
                </li>
              </ul>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="output-headers">
                  <template v-for="(checkboxes, group) in outputsCol0">
                    <strong :key="`${group}-b`">{{ group }}</strong>
                    <ul :key="`${group}-ul`">
                      <span v-for="checkbox in checkboxes" :key="checkbox.value">
                        <li v-if="!checkbox.disabled">
                          <input
                            :id="checkbox.value + '-output'"
                            v-model="outputTypesWithDefault"
                            type="checkbox"
                            :value="checkbox"
                            :disabled="!checkboxEnabled(checkbox) || defaultCheckbox(checkbox)"
                            class="custom-control-input checkbox"
                          >
                          <label
                            class="custom-control-label checkboxlabel"
                            :for="checkbox.value + '-output'"
                          >
                            <batch-pop-over
                              :display="checkbox.label"
                              :pop-text="helpTextContent(checkbox.help)"
                              pop-text-placement="right"
                            />
                          </label>
                        </li>
                      </span>
                    </ul>
                  </template>
                </div>
              </div>
              <div class="col-6">
                <div class="output-headers">
                  <template v-for="(checkboxes, group) in outputsCol1">
                    <strong :key="`${group}-output-header`">{{ group }}</strong>
                    <ul :key="`${group}-output-ul`">
                      <span v-for="checkbox in checkboxes" :key="checkbox.value">
                        <li v-if="!checkbox.disabled">
                          <input
                            :id="checkbox.value + '-output'"
                            v-model="outputTypesWithDefault"
                            type="checkbox"
                            :value="checkbox"
                            :disabled="!checkboxEnabled(checkbox) || defaultCheckbox(checkbox)"
                            class="custom-control-input checkbox"
                          >
                          <label class="custom-control-label checkboxlabel" :for="checkbox.value + '-output'">
                            <batch-pop-over
                              :display="checkbox.label"
                              :pop-text="helpTextContent(checkbox.help)"
                              pop-text-placement="right"
                            />
                          </label>
                        </li>
                      </span>
                    </ul>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div id="output-lists">
              <batch-list-grid
                style="  width:100%"
                :cname="cname"
                grid-reference="chemicalLists"
                grid-heading="Presence in Lists"
                :show-record-counts="true"
                :show-export="false"
                :grid-size="gridSize"
                :config-obj="presenceGridConfigurationObj"
                @gridRef="onGridRef"
              />
            </div>
          </div>
        </div>
        <div v-show="outputFormat !==''" class="row">
          <div class="col">
            <div class="text-center" style="margin-top:20px;background-color:#419CC6;color:white">
              Download Export file for the chemicals selected
            </div>
          </div>
        </div>
        <div v-show="outputFormat !==''" class="row mt-3 mb-5">
          <div class="col text-center">
            <span class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow">
                5
              </strong>
            </span>
            <button
              class="btn btn-sm btn-default"
              @click.stop="startBatchExport"
            >
              <span class="icon"><i class="fa fa-download" /></span>
              <span>Download Export File</span>
            </button>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
} from 'vuex';

import {
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbIcon,
} from 'mdbvue';

import {useHelpTexts} from '@/stores/helpTexts.ts';
import batchExcludeList from './batchExcludeList.json';
import batchSearchOptions from './batchSearchOptions.json';
import batchSearchInputTypes from './batchInputTypes.json';
import ExportModal from '~/components/batch-search/ExportModal.vue';
import BatchPopOver from '~/components/batch-search/BatchPopOver.vue';
import Results from '~/components/results/Results.vue';
import BatchListGrid from '~/components/batch-search/BatchListGrid.vue';
// import PopOverUnderlineLayout from '~/components/cellRenderers/PopOverUnderlineLayout.vue'
const helptexts = useHelpTexts();

export default {
  name: 'BatchSearch',
  components: {
    ExportModal,
    Results,
    BatchListGrid,
    // eslint-disable-next-line vue/no-unused-components
    // eslint-disable-next-line vue/no-unused-components
    BatchPopOver,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbIcon,
  },

  data() {
    return {
      identifierWarning: '(Please enter one identifier per line and limit the number of identifiers to 10,000 or less)',
      settings: null,
      batchCname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      cname: {
        camelName: 'batchPresenceList',
        hyphenName: 'batch-presence-list',
        baseName: 'Batch Presence List',
      },
      outputs: null,
      outputsCol0: null,
      outputCols1: null,
      lists: null,
      listsUrl: `${process.env.APPLICATION_ROUTER_BASE}chemical-lists`,
      inputTypeCheckboxes: batchSearchInputTypes.inputTypes,
      inputTypeData: '',
      synonymTypesData: [],
      massDiff: 5,
      identifiers: '',
      outputsExpanded: false,
      outputFormat: '',
      exportOptions: [
        {
          text: 'Excel',
          value: 'excel',
          molFormat: '-',
          exportMsg: 'Your file will be exported in Microsoft Excel Format (.xlsx)',
        },
        {
          text: 'CSV',
          value: 'csv',
          molFormat: '-',
          exportMsg: 'Your file will be exported in Comma Separated Format (.csv)',
        },
        {
          text: 'SDF v2000 MOL Format (.sdf)',
          value: 'sdf2',
          molFormat: 'V2000',
          exportMsg: 'Your file will be exported in Structure-Data File Format with MOL Format V2000 (.sdf)',
        },
        {
          text: 'SDF v3000 MOL Format (.sdf)',
          value: 'sdf3',
          molFormat: 'V3000',
          exportMsg: 'Your file will be exported in Structure-Data File Format with MOL Format V3000 (.sdf)',
        },
      ],
      molVersion: '',
      showExportModal: false,
      showDisplayGrid: false,
      exportDownloadLink: '',
      exportJobId: '',
      finalExportJobId: '',
      exportStatus: null,
      pollInterval: null,
      title: 'Exporting in progress',
      outputTypes: [],
      filterOptions: [],
      checkedLists: [],
      formPath: '',
      chemicalsToSubmit: [],
      gridConfigurationObj: {},
      presenceGridConfigurationObj: {},
      gridSize: 'height: 500px;   overflow:auto;',
      presenseGridOptions: null,
      exportColDefs: [],
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,

      },
      copyUrlConfig: {
        copy: true,
        copyButtonTipText: 'Copy Url',
      },
      columnDefs: null,
      rowData: null,
      gridRefs: {},
      hasSelectedRows: false,
      batchGridOptions: {},
      batchChemicals: [],
      chemicals: [],
      batchObj: {},
      batchGridSize: 'height: 400px; overflow:auto',
      batchcname: {
        camelName: 'results',
        hyphenName: 'results',
        baseName: 'Results',
      },
      isLoading: false,
      stopLoading: false,
      noRecordsFound: false,
      chunkData: [],
      percentDone: 0,
      batchGridTotalRows: 0,
      testExpandedCols: [
        'BIOCONCENTRATION_FACTOR_TEST_PRED',
        'BOILING_POINT_DEGC_TEST_PRED',
        '48HR_DAPHNIA_LC50_MOL/L_TEST_PRED',
        'DENSITY_G/CM^3_TEST_PRED',
        'DEVTOX_TEST_PRED',
        '96HR_FATHEAD_MINNOW_MOL/L_TEST_PRED',
        'FLASH_POINT_DEGC_TEST_PRED',
        'MELTING_POINT_DEGC_TEST_PRED',
        'AMES_MUTAGENICITY_TEST_PRED',
        'ORAL_RAT_LD50_MOL/KG_TEST_PRED',
        'SURFACE_TENSION_DYN/CM_TEST_PRED',
        'THERMAL_CONDUCTIVITY_MW/(M*K)_TEST_PRED',
        'TETRAHYMENA_PYRIFORMIS_IGC50_MOL/L_TEST_PRED',
        'VISCOSITY_CP_CP_TEST_PRED',
        'VAPOR_PRESSURE_MMHG_TEST_PRED',
        'WATER_SOLUBILITY_MOL/L_TEST_PRED',
      ],
      operaExpandedCols: [
        'ATMOSPHERIC_HYDROXYLATION_RATE_(AOH)_CM3/MOLECULE*SEC_OPERA_PRED',
        'BIOCONCENTRATION_FACTOR_OPERA_PRED',
        'BIODEGRADATION_HALF_LIFE_DAYS_DAYS_OPERA_PRED',
        'BOILING_POINT_DEGC_OPERA_PRED',
        'HENRYS_LAW_ATM-M3/MOLE_OPERA_PRED',
        'OPERA_KM_DAYS_OPERA_PRED',
        'OCTANOL_AIR_PARTITION_COEFF_LOGKOA_OPERA_PRED',
        'SOIL_ADSORPTION_COEFFICIENT_KOC_L/KG_OPERA_PRED',
        'OCTANOL_WATER_PARTITION_LOGP_OPERA_PRED',
        'MELTING_POINT_DEGC_OPERA_PRED',
        'OPERA_PKAA_OPERA_PRED',
        'OPERA_PKAB_OPERA_PRED',
        'VAPOR_PRESSURE_MMHG_OPERA_PRED',
        'WATER_SOLUBILITY_MOL/L_OPERA_PRED',
        'LOGD5.5',
        'LOGD7.4',
        'READY_BIO_DEG',
      ],
      nhanesExpandedCols: [
        'EXPOCAST_MEDIAN_EXPOSURE_PREDICTION_MG/KG-BW/DAY',
        'NHANES',
      ],
      toxvalExpandedCols: [
        'TOXCAST_NUMBER_OF_ASSAYS/TOTAL',
        'TOXCAST_PERCENT_ACTIVE',
      ],

    };
  },
  computed: {
    ...mapGetters({
      getGridDefs: 'chemicalResultsConfig/getBaseGridDefs',
      getExportColDefs: 'chemicalResultsConfig/getExportColDefs',
      getToolBar: 'chemicalResultsConfig/getBaseToolBar',
      getChemicalLists: 'chemicalLists/getChemicalLists',
      getFiltered: 'chemicalLists/getFiltered',
      getPresenseInListDefs: 'batchSearchResults/getPresenseInListDefs',
      getBatchGridDefs: 'batchSearchResults/getBaseGridDefs',
      getSendToBatchChemicals: 'batchSearchResults/getSendToBatchChemicals',
      getChemicals: 'results/getChemicals',
    }),
    csearch() {
      let searchStr = '';
      if (this.$route.query.search) {
        searchStr = this.$route.query.search;
      }
      return searchStr;
    },
    step() {
      let step = 0;
      // Select input types
      const stepConditions = [
        // Enter identifiers
        this.inputType !== '',
        // Select download or display
        this.identifiers.length > 0,
        // Select output file format
        this.outputsExpanded === true,
        //  Select output data
        //  Download
        this.outputTypes.length > 0,
      ];
      while (stepConditions[step]) {
        step += 1;
      }
      return step;
    },
    useDtxcid() {
      return this.inputType === 'dsstox_compound_id';
    },
    useMassDiff() {
      return this.inputType === 'MASS';
    },
    identifiersInputHasInvalidCharacter() {
      return this.identifiers.includes('"');
    },
    numIdentifiersInput() {
      // even empty, the textarea length will be 1 after the .split
      return this.identifiers.split('\n').length;
    },
    exportFileTypeLabel() {
      return `${this.outputFormat} File`;
    },
    exportFileFormatMsg() {
      let msg = 'Please select output format.';
      if (this.outputFormat !== '') {
        msg = this.exportOptions.find(obj => obj.value === this.outputFormat).exportMsg;
      }
      return msg;
    },
    defaultCheckboxes() {
      return Object.values(this.outputs)
        .reduce((accumulator, currentValue) => accumulator
          .concat(currentValue
            .filter(checkbox => this.defaultCheckbox(checkbox))), []);
    },
    inputType: {
      get() {
        return this.inputTypeData;
      },
      set(value) {
        if (value !== 'synonym') {
          this.synonymTypesData = [];
        } else {
          this.synonymTypesData = ['chemical_name', 'CASRN', 'INCHIKEY', 'dtxsid'];
        }
        this.inputTypeData = value;
      },
    },
    synonymTypes: {
      get() {
        return this.synonymTypesData;
      },
      set(value) {
        if (value.length > 0) {
          this.inputTypeData = 'synonym';
        } else {
          this.inputTypeData = '';
        }
        this.synonymTypesData = value;
      },
    },
    outputTypesWithDefault: {
      get() {
        return this.outputTypes.filter(checkbox => this.checkboxEnabled(checkbox)).concat(this.defaultCheckboxes);
      },
      set(value) {
        if (value.length > this.outputTypesWithDefault.length) {
          // added value
          const valueToAdd = value.filter(checkbox => !this.outputTypesWithDefault.includes(checkbox));
          this.outputTypes = this.outputTypes.concat(valueToAdd);
        } else {
          // removed value
          this.outputTypes = this.outputTypes.filter(checkbox => value.includes(checkbox));
        }
      },
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
    const response = await context.store.dispatch('chemicalLists/asyncChemicalLists', context);
  },

  created() {
    this.lists = this.getChemicalLists();
    this.setFilterOptions(this.getToolBar().filterOptions);
    this.setSortOptions(this.getToolBar().sortOptions);
    this.setTileInfoOptions(this.getToolBar().tileInfoOptions);
    // eslint-disable-next-line prefer-destructuring
    this.outputsCol0 = batchSearchOptions[0];
    // eslint-disable-next-line prefer-destructuring
    this.outputsCol1 = batchSearchOptions[1];
    this.outputs = {...this.outputsCol0, ...this.outputsCol1};
    if (!helptexts.helpTexts.length) {
      helptexts.fillHelpTexts(this);
    }
  },
  beforeMount() {
    this.settings = this.apiSettings();
    if (this.$route.query.sendToBatch === 'true') {
      this.inputType = 'synonym';
      this.identifiers = this.getSendToBatchChemicals().join('\n');
    }

    this.columnDefs = this.getGridDefs();
    this.columnDefs.push({
      headerName: 'InchiString',
      valueGetter: this.splitInchi,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      hide: true,
    });
    this.columnDefs = this.columnDefs.map((col) => {
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
    const newArr = this.getExportColDefs();
    newArr.forEach((item) => {
      if (item.key !== 'massDiff') {
        this.exportColDefs.push(item);
      }
    });

    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
        floatingFilter: true,
      },
      gridOptions: {
        components: {
          dtxsidDetail: this.dtxsidDetail,
          linkPreferredName: this.linkPreferredName,
          toxCastActive: this.toxCastActive,
          structureImage: this.structureImage,
          percentFormatter: this.percentFormatter,
          ncctRound: this.ncctRound,
          ncctRound2: this.ncctRound2,
          formatPreferredName: this.formatPreferredName,
          roundTo6: this.roundTo6,
          qcLevel: this.qcLevel,
          whenEmpty: this.whenEmpty,
        },
        valueCache: true,
        suppressContextMenu: true,
        rowHeight: 110,
        unSortIcon: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        headerHeight: 50,
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
    };
    this.gridConfigurationObj.gridOptions.getRowId = data => data.data.uuId;
    this.presenseColumnDefs = this.getPresenseInListDefs();
    const data = this.getChemicalLists();
    this.presenceGridConfigurationObj = {
      gridColumnDefs: this.presenseColumnDefs,
      gridData: data,
      gridOptions: {
        components: {
          acronymRenderer: this.acronymRenderer,
          descriptionLinkRenderer: this.descriptionLinkRenderer,
          titleRenderer: this.titleRenderer,
        },
        rowSelection: 'multiple',
        unSortIcon: true,
        suppressContextMenu: true,
        headerHeight: 50,
        statusBar: {
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.$nuxt.$on('replaceBatchList', (batchChemicals) => {
      this.resetChemList(batchChemicals);
    });
  },
  methods: {
    ...mapMutations({
      setChemicals: 'results/setChemicals',
      addChemicals: 'results/addChemicals',
      setFilterOptions: 'results/setFilterOptions',
      setSortOptions: 'results/setSortOptions',
      setTileInfoOptions: 'results/setTileInfoOptions',
      setFilterModel: 'results/setFilterModel',
    }),
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
        this.startBatchExportGrid();
      } else {
        this.exportData({
          fileName: `Batch-Search-chemical-list-${timeStamp}`,
          gridApi: this.gridApi,
          fileFormat: params.fileType,
          columns: this.exportColDefs,
          splitSheet: {xSplit: 1, ySplit: 1},
        });
      }
    },
    resetChemList(batchChemicals) {
      this.identifiers = '';
      this.$nuxt.$emit('clearCounts', this.chemicals.length);
      this.chemicals = [];
      this.showDisplayGrid = false;
      this.inputType = 'synonym';
      this.identifiers = batchChemicals.join('\n');
      this.identifierWarning = 'Batch search chemicals replaced with selected chemicals from grid.';
      window.scroll({
        top: 200,
        left: 0,
        behavior: 'smooth',
      });
    },
    helpTextContent(key) {
      let returnText = '';
      const sentry = this.$sentry;
      const ht = helptexts.getBatchHelp(key, sentry);
      if (ht) {
        returnText = ht.helpText;
      }
      return returnText;
    },
    replaceQuotes(string) {
      this.identifiers = this.identifiers.replaceAll('"', string);
    },

    replaceIdentifiers() {
      const newIndents = [];
      this.batchGridApi.forEachNodeAfterFilter((rowNode, index) => {
        if (rowNode.selected) {
          newIndents.push(rowNode.data.dtxsid);
        }
      });
      this.identifiers = newIndents.join('\n');
      this.inputTypeData = 'synonym';
      this.synonymTypesData = ['dtxsid'];
    },
    onSelectionChanged() {
      this.hasSelectedRows = this.listGridApi.getSelectedRows().length > 0;
    },
    defaultCheckbox(checkbox) {
      let outputFormat = 'excel';
      if (this.outputFormat === 'sdf2' || this.outputFormat === 'sdf3') {
        outputFormat = 'sdf';
      } else {
        outputFormat = this.outputFormat;
      }
      return (checkbox.default[outputFormat] ||
                    ((this.inputType in checkbox) && ('default' in checkbox[this.inputType]) && checkbox[this.inputType].default[outputFormat])) &&
                this.checkboxEnabled(checkbox);
    },
    checkboxEnabled(checkbox) {
      let outputFormat = 'excel';
      if (this.outputFormat === 'sdf2' || this.outputFormat === 'sdf3') {
        outputFormat = 'sdf';
      } else {
        outputFormat = this.outputFormat;
      }
      return (checkbox.enabled[outputFormat] ||
                ((this.inputType in checkbox) && ('enabled' in checkbox[this.inputType]) && checkbox[this.inputType].enabled[outputFormat]));
    },
    selectAll(ev) {
      if (ev.currentTarget.checked) {
        this.outputTypes = Object.values(this.outputs).reduce((accumulator, checkboxes) => accumulator.concat(checkboxes.filter(checkbox => !this.outputTypes.includes(checkbox) && !(('disableSelectAll' in checkbox) && checkbox.disableSelectAll))), this.outputTypes);
      } else {
        this.outputTypes = [];
      }
    },
    selectAllLists(ev) {
      if (ev.currentTarget.checked) {
        this.checkedLists = this.lists.map(o => o.value);
      } else {
        this.checkedLists = [];
      }
    },
    setChemicalsToSubmit() {
      // Extract chemicals per line replacing certain values (.,;:) and
      // filtering to exclude items on the batchExcludeList.json
      this.chemicalsToSubmit = this.identifiers.split('\n').map(value => value.replace(/^[.,;:\s]+|[,;:\s]+$/gm, '')).filter(value => !batchExcludeList.includes(value));
    },
    setBatchSearchPostObject() {
      this.batchObj = {
        identifierTypes: [''],
        massError: 0,
        downloadItems: [],
        searchItems: [],
      };
      // this.columnApi.setColumnVisible('dtxcid', false)
      switch (this.inputType) {
      case 'synonym':
        this.batchObj.inputType = 'IDENTIFIER';
        this.batchObj.identifierTypes = this.synonymTypes;
        break;
      case 'DTXCID':
        this.batchObj.inputType = 'DTXCID';
        // this.batchColumnApi.setColumnVisible('dtxcid', true)
        break;
      case 'INCHIKEY_SKELETON':
        this.batchObj.inputType = 'INCHIKEY_SKELETON';
        break;
      case 'MSREADY_FORMULA':
        this.batchObj.inputType = 'MSREADY_FORMULA';
        this.batchObj.identifierTypes = [''];
        break;
      case 'EXACT_FORMULA':
        this.batchObj.inputType = 'EXACT_FORMULA';
        this.batchObj.identifierTypes = [''];
        break;
      case 'MASS':
        this.batchObj.inputType = 'MASS';
        this.batchObj.massError = this.massDiff;
        break;
      default:
      }
    },
    async submitDisplayForm() {
      this.$nuxt.$emit('clearCounts', this.chemicals.length);
      this.chemicals = [];
      this.showDisplayGrid = true;
      this.stopLoading = false;
      this.noRecordsFound = false;
      this.setChemicalsToSubmit();
      await this.$nextTick(() => {
        this.setBatchSearchPostObject();
        this.getChemsForBatchSearch();
      });
    },
    showExportOptions() {
      this.showDisplayGrid = false;
      this.outputsExpanded = true;
      this.noRecordsFound = false;
      window.scroll({
        top: 400,
        left: 0,
        behavior: 'smooth',
      });
    },
    async getChemsForBatchSearch() {
      this.batchGridTotalRows = 0;
      this.isLoading = true;
      this.batchChemicals = [];
      const chunkSize = 50;
      let startChunk = 0;
      const totalBatchChems = this.chemicalsToSubmit.length;
      // console.log('this.chemicalsToSubmit.length ', this.chemicalsToSubmit.length)
      const totalPages = Math.ceil(totalBatchChems / chunkSize);
      const percentChunk = parseInt(100 / totalPages, 10);
      this.percentDone = 0;
      let itemsChunk = [];
      try {
        for (let index = 0; index < (totalBatchChems / chunkSize); index += 1) {
          if (this.stopLoading) { break; }
          itemsChunk = this.chemicalsToSubmit.slice(startChunk, (startChunk + chunkSize));
          this.batchObj.searchItems = itemsChunk.join('\n');
          // eslint-disable-next-line no-await-in-loop
          const response = await this.$repositories.batchSearch.getChemicalsByInputType(this.batchObj);
          this.chunkData = response;
          this.percentDone += percentChunk;
          this.batchChemicals = this.batchChemicals.concat(response);
          startChunk += chunkSize;
          this.percentDone += percentChunk;
          this.batchGridTotalRows = this.batchChemicals.length;
          this.gridApi.hideOverlay();
        }
      } catch (ex) {
        console.error('error loding chunked data:', ex);
      }
      if (this.batchChemicals.length === 0) {
        this.showDisplayGrid = false;
        this.outputsExpanded = false;
        this.noRecordsFound = true;
      }
      this.batchGridTotalRows = this.batchChemicals.length;
      this.percentDone = 100;
      this.isLoading = false;
    },
    doCancel() {
      this.stopLoading = true;
    },
    setExportType(item) {
      this.outputFormat = item.value;
      this.molVersion = item.molFormat;
    },

    fetchData() {
      const statusURL = `${process.env.APPLICATION_BASE_API}${this.apiSettings().BATCH_SEARCH_EXPORT_STATUS_API}${this.exportJobId}?${Date.now().toString(36)}`;
      this.$axios.get(statusURL)
        .then((response) => {
          if (response.data === true) {
            clearInterval(this.pollInterval);
            this.exportStatus = response.data;
            this.finalExportJobId = this.exportJobId;
          }
          this.exportStatus = response.data;
        });
    },

    startInterval() {
      this.pollInterval = setInterval(() => {
        this.fetchData();
      }, 3000);
    },

    removeBatchJob() {
      const removeURL = `${process.env.APPLICATION_BASE_API}${this.apiSettings().BATCH_SEARCH_EXPORT_REMOVE_API}${this.exportJobId}`;
      this.$axios.get(removeURL)
        .then((response) => {
          clearInterval(this.pollInterval);
        });
    },
    async startBatchExportGrid() {
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
      // const exportJobId = await this.$repositories.batchSearch.startBatchSearchExportJob(this.batchObj)
      this.exportJobId = await this.$repositories.batchSearch.startBatchSearchExportJob(this.batchObj);
      this.showExportModal = true;

      this.fetchData(this.exportJobId);
      // check if the status is completed, if not fetch data every 10 secs
      if (this.exportStatus !== true) {
        this.startInterval(this.exportJobId);
      }
    },

    async startBatchExport() {
      this.setChemicalsToSubmit();
      this.exportDownloadLink = '';
      this.finalExportJobId = null;
      this.exportStatus = false;
      this.setBatchSearchPostObject();
      this.batchObj.searchItems = this.chemicalsToSubmit.join('\n');
      this.batchObj.downloadType = this.outputFormat.toUpperCase();
      this.batchObj.downloadItems = this.outputTypesWithDefault
        .filter(checkbox => checkbox.value !== 'DTXSID' && checkbox.value !== 'PREFERRED_NAME')
        .reduce((acc, checkbox) => {
          acc.push(checkbox.value);
          return acc;
        }, []);
      if (this.batchObj.downloadItems.includes('TEST')) {
        this.batchObj.downloadItems = this.batchObj.downloadItems.filter(field => field !== 'TEST');
        this.batchObj.downloadItems = this.batchObj.downloadItems.concat(this.testExpandedCols);
      }
      if (this.batchObj.downloadItems.includes('OPERA')) {
        this.batchObj.downloadItems = this.batchObj.downloadItems.filter(field => field !== 'OPERA');
        this.batchObj.downloadItems = this.batchObj.downloadItems.concat(this.operaExpandedCols);
      }
      if (this.batchObj.downloadItems.includes('EXPOCAST')) {
        this.batchObj.downloadItems = this.batchObj.downloadItems.concat(this.nhanesExpandedCols);
      }
      if (this.batchObj.downloadItems.includes('TOXVALCOUNT')) {
        this.batchObj.downloadItems = this.batchObj.downloadItems.filter(field => field !== 'TOXVALCOUNT');
        this.batchObj.downloadItems = this.batchObj.downloadItems.concat(this.toxvalExpandedCols);
      }
      if (this.outputFormat === 'sdf2' || this.outputFormat === 'sdf3') {
        this.batchObj.downloadItems = this.batchObj.downloadItems.filter(field => field !== 'MOL_FILE');
        this.batchObj.molVersion = this.molVersion;
        this.batchObj.downloadType = 'SDF';
      }

      if (this.listGridApi.getSelectedRows().length > 0) {
        const lists = [];
        this.listGridApi.forEachNodeAfterFilter((rowNode, index) => {
          if (rowNode.selected) {
            lists.push(rowNode.data.listName);
          }
        });

        this.batchObj.chemicalLists = lists;
      }
      this.exportJobId = await this.$repositories.batchSearch.startBatchSearchExportJob(this.batchObj);
      this.showExportModal = true;

      this.fetchData();
      if (this.exportStatus !== true) {
        this.startInterval();
      }
    },

    showHideExportModal() {
      clearInterval(this.pollInterval);
      this.showExportModal = !this.showExportModal;
      this.removeBatchJob();
    },
    hideAfterDownload() {
      clearInterval(this.pollInterval);
      this.showExportModal = false;
    },
    onGridRef(params) {
      this.listGridApi = params.gridApi;
      this.listColumnApi = params.columnApi;
    },
    onBatchGridReady(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },
    onRowDataChanged(params) {
      if (this.chemicals.length > 0) {
        params.api.hideOverlay();
      } else {
        params.api.showLoadingOverlay();
      }
    },
    titleRenderer(params) {
      return `<div class="titleClass" style="display: inline-block !important;">${params.data.listName}</div>  <a v-if="name": href="/dashboard/chemical-lists/${params.data.listName}" target="_blank" style="display: inline-block !important;"><span class="icon"><i class="fa fa-external-link"></i></span></a>`;
    },
  },
};
</script>

<style lang="scss" scoped>
.identifier-warning {
    font-size: 12px;
    color: orangered;
}

.output-headers {
    ul {
        li {
            label.custom-control-label {
                font-size: 12px;
                padding-top: 3px;
            }
        }
    }
}

#invalid-input {
    margin: 0 0 10px 0;
}

#inputs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    #input-chemicals {
        display: flex;
        flex-direction: column;
        width: 50%;
        textarea {
            resize: none;
        }
    }
    #mass-diff {
        display: inline-flex;
        align-items: baseline;
        &>select {
            margin: 0 5px;
        }
    }
    .chem-found-bar {
        margin-top: 20px;
        margin-bottom: 20px;
        background-color: #419CC6;
        color: white;
    }
}
</style>


<style lang="scss" scoped>
.identifier-warning {
    font-size: 12px;
    color: orangered;
}

.output-headers {
    ul {
        li {
            label.custom-control-label {
                font-size: 12px;
                padding-top: 3px;
            }
        }
    }
}

#invalid-input {
    margin: 0 0 10px 0;
}

#inputs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    #input-chemicals {
        display: flex;
        flex-direction: column;
        width: 50%;
        textarea {
            resize: none;
        }
    }
    #mass-diff {
        display: inline-flex;
        align-items: baseline;
        &>select {
            margin: 0 5px;
        }
    }
    .chem-found-bar {
        margin-top: 20px;
        margin-bottom: 20px;
        background-color: #419CC6;
        color: white;
    }
}
</style>


<style lang="scss" scoped>
.identifier-warning {
    font-size: 12px;
    color: orangered;
}

.output-headers {
    ul {
        li {
            label.custom-control-label {
                font-size: 12px;
                padding-top: 3px;
            }
        }
    }
}

#invalid-input {
    margin: 0 0 10px 0;
}

#inputs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    #input-chemicals {
        display: flex;
        flex-direction: column;
        width: 50%;
        textarea {
            resize: none;
        }
    }
    #mass-diff {
        display: inline-flex;
        align-items: baseline;
        &>select {
            margin: 0 5px;
        }
    }
    .chem-found-bar {
        margin-top: 20px;
        margin-bottom: 20px;
        background-color: #419CC6;
        color: white;
    }
}
</style>
