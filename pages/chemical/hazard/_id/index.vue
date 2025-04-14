<template>
  <div class="mr-2">
    <client-only>
      <div class="row pr-4 ">
        <div class="col h2">
          <ccte-help-text
            data-cy="HazardHeader"
            label-type="span"
            :heading-text="`Hazard: ${currentSectionName}`"
            help-key="HazardHeader"
          />
        </div>
        <div
          class="skiplinks"
          role="navigation"
          aria-labelledby="Data Description"
        >
          <a
            id="DetailsLink"
            data-cy="dataDescriptionLink"
            href="javascript:void(0)"
            class="skiplinks__link sr-only sr-only-focusable"
            @keyup.enter.prevent="toggleDetails('dataDescription')"
          >Toggle Data Description</a>
        </div>
      </div>
      <mdb-accordion class="assayAccordion mt-2 mb-0 pb-0 shadow-none" aria-label="accordion" role="contentInfo" table>
        <mdb-accordion-pane
          id="DataDescription"
          title="Data Description"
          type="table"
          tabindex="0"
          data-cy="dataDescriptionHeader"
          :is-open="dataDescription"
          @keydown="toggleDetails('dataDescription')"
          @pane-clicked="toggleDetails('dataDescription')"
        >
          <div class="card">
            <div class="card-body">
              <span class="card-title text-bold">
                <h3>
                  Data Description
                </h3>
              </span>
              <p>
                EPA Center for Computational Toxicology and Exposure’s ToxValDB is a resource designed to curate, normalize, quality assure, store, and make accessible a wide range of human health relevant toxicity information. ToxValDB data are summarized from over 40 publicly available sources – links are provided for users to consult the data source for more information.
              </p>
              <p>
                Each record in ToxValDB is assigned to one of the following categories:
                <ul>
                  <li>Toxicity Value: A value derived to define the exposure level of a chemical associated with cancer or noncancer human health effects.</li>
                  <li>Media Exposure Guidelines: The level of chemical in a defined media used to inform human health risks for exposure over a specific time period.</li>
                  <li>Acute Exposure Guidelines: The level of chemical in a defined media used to inform human health effects for acute exposures.</li>
                  <li>Dose Response Summary Value: An exposure level or lower confidence bound at which an effect or no effect is observed in the exposed population compared with an appropriate unexposed control group.</li>
                  <li> Mortality Response Summary Value: An exposure level at which a defined level of mortality is observed in the exposed population after a specified duration.</li>
                </ul>
              </p>
              <p>
                The complete ToxValDB database is available for download <a href="https://www.epa.gov/comptox-tools/downloadable-computational-toxicology-data#AT" target="_blank" alt="Downloadable Computational Toxicology Data" referrerpolicy="no-referrer">here</a>.  To access the R scripts used in data processing, please visit the <a href="https://github.com/USEPA/toxvaldbmain" target="_blank" alt="DToxValDB github page" referrerpolicy="no-referrer">ToxValDB github page</a>.
              </p>
              <p>
                The source ToxRefDB within ToxValDB presents point of departure values summarized across each unique study type, sex, life stage, and species combination from the Toxicity Reference Database, ToxRefDB. Complete (not summarized) positive effect data for ToxRefDB study curations can be exported via Batch Search. The complete ToxRefDB database can be found <a href="https://www.epa.gov/comptox-tools/downloadable-computational-toxicology-data#AT" target="_blank" alt="Downloadable Computational Toxicology Data" referrerpolicy="no-referrer">here</a>.
              </p>
              <p>
                For ecological toxicity data, visit the <a href="http://www.epa.gov/ecotox" target="_blank" alt="ECOTOX Knowledgebase" referrerpolicy="no-referrer">ECOTOX Knowledgebase</a>  which provides curated data on effects and endpoints measured and detailed metadata from each toxicity test including details on the test compound, test organism, study design, test conditions, and statistical analysis.
              </p>
            </div>
          </div>
        </mdb-accordion-pane>
      </mdb-accordion>
      <div>
        <div class="row pr-0">
          <div class="col">
            <chemical-detail-tab-grid-toolbar
              ref="ChemicalDetailToolbar"
              :cname="cname"
              :toolbar-config="toolbarConfig"
              :select-options="selectOptions"
              :select-default="activeSection"
            />
          </div>
        </div>
        <div class="row pr-0">
          <div class="col">
            <grid-tips
              ref="hazard-human"
              :cname="cname"
              :grid-reference="cname.camelName"
              :grid-heading="humanHeading"
              :grid-size="gridSize"
              :saved-state="pageState"
              :config-obj="gridConfigurationObj"
              @onCellClicked="onSummaryClick"
              @onExport="onExportData"
              @gridRef="onGridRef"
              @gridState="onGridState"
            />
          </div>
        </div>
        <mdb-modal size="lg" data-cy="hazardModal" :show="moreModalvis" info @close="toggleModal">
          <mdb-modal-header class="primary-color lighten-1" :close="true">
            <button class="btn" @click="downloadData">
              Download Data
            </button>
          </mdb-modal-header>
          <mdb-modal-body>
            <table id="moreInfo" class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value,prop,idx,) in moreData" :key="idx">
                  <td v-if="idx < 72">
                    {{ prop }}
                  </td>
                  <td v-if="idx < 72">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </mdb-modal-body>
        </mdb-modal>
      </div>
    </client-only>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import {
  mdbAccordion,
  mdbAccordionPane,
  mdbModal,
  mdbModalHeader,
  mdbModalBody,
} from 'mdbvue';
import {mapState as mapPiniaState} from 'pinia';
import ChemicalDetailTabGridToolbar from '~/components/toolbars/gridToolbar/ChemicalDetailTabGridToolbar.vue';
import GridTips from '~/components/grids/GridWithToolTips.vue';
import {useHazardStore} from '~/stores/hazard/hazard';
import LinkRenderer from '~/components/cellRenderers/LinkRenderer.vue';

import {
  exportGridDefs, summaryGridDefs,
} from './columnDefs';

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
  name: 'HazardView',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
    mdbModal,
    mdbAccordion,
    mdbAccordionPane,
    LinkRenderer,
    mdbModalHeader,
    mdbModalBody,
  },
  data() {
    return {
      dataDescription: false,
      activeProperties: {},
      activeSection: 'SUMMARY',
      activeCategory: '',
      currentSectionName: '',
      pageState: {
        section: null,
        gridRef: null,
        colState: null,
        filter: null,
        category: null,
      },
      cname: {
        camelName: 'hazard',
        hyphenName: 'hazard',
        baseName: 'Hazard',
      },
      toolbarConfig: {
        select: true,
        search: false,
        radio: false,
        export: false,
      },
      selectOptions: [],
      gridConfigurationObj: {},
      tableHeader: '',
      gridSize: 'height:570px; width:100%; margin-bottom: 25px !important;',
      moreModalvis: false,
      moreData: [],
      rowNum: 0,
      gridApi: null,
      ecoGridApi: null,
      columnApi: null,
    };
  },
  computed: {
    getExportGridDefs() {
      return exportGridDefs;
    },
    getSummaryGridDefs() {
      return summaryGridDefs;
    },
    getEcoGridDefs() {
      return ecoGridDefs;
    },
    ...mapPiniaState(useHazardStore, {
      getHazard: 'Hazard',
      getDtxsid: 'dtxsid',
      getSelectListValues: 'getSelectListValues',
    }),
    ...mapState({
      chemical: state => state.results.activeChemical,
      propertySelection: state => state.chemicalProperties.propertySelection,
    }),
    humanHeading() {
      return `Human-Relevant ${this.currentSectionName} Data`;
    },
    ecoHeading() {
      return `Eco-Relevant ${this.currentSectionName} Data`;
    },
  },
  watch: {
    propertySelection(n, o) {
      this.selectDataType(n);
    },
  },
  async asyncData(context) {
    let deepLink = {};
    const hazardStore = useHazardStore();
    try {
      const result = await context.app.$repositories.hazard.find(context.params.id);
      if (result._embedded.Hazard.length > 0) {
        const hazard = result._embedded.Hazard[0];
        if (!hazard.human) {
          hazard.human = [];
        }
        if (!hazard.eco) {
          hazard.eco = [];
        }
        hazardStore.setHazard(hazard);
        hazardStore.setDtxsid(context.params.id);
      }
      // if there is a valid hazard object in the returned result and a deeplink query param on the call check for the deeplink value
      if (context.route.query.deepLink && result._embedded.Hazard.length > 0) {
        let deepLink = {};
        const linkId = context.route.query.deepLink;
        // verify the param value is a number before calling the api
        if (!isNaN(linkId)) {
          deepLink = await context.app.$repositories.deepLinks.find(linkId);
          return {deepLink};
        }
      }
    } catch (err) {
      context.$sentry.captureMessage(`HAZARD ERROR-IN DEEPLINK ${context.params.id} :  ${err.toString()}`);
    }
  },
  beforeMount() {
    this.activeProperties = this.getHazard;
    this.exportColDefs = this.getExportGridDefs;
    this.selectOptions = this.getSelectListValues;
    this.activeSection = this.selectOptions[0].value;
    this.currentSectionName = this.selectOptions[0].text;
    let data = [];
    let ecoData = [];
    if (this.activeProperties.human.length > 0) {
      data = this.activeProperties.human[0].rawData;
    }
    if (this.activeProperties.eco.length > 0) {
      ecoData = this.activeProperties.eco[0].rawData;
    }
    this.gridConfigurationObj = {
      gridColumnDefs: this.getSummaryGridDefs,
      gridData: data,
      defaultColDef: {
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        resizable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        autoHeight: true,
        sortable: true,
        suppressMenu: false,
        floatingFilterComponentParams: {suppressFilterButton: true},
      },
      gridOptions: {
        unSortIcon: true,
        components: {
          moreButton: this.moreButton,
          linkRenderer: this.linkRenderer,
          ncctRound2: this.ncctRound2,
          splitPipeDelimtedField: this.splitPipeDelimtedField,
        },
        headerHeight: 50,
        rowHeight: 28,
        domLayout: 'normal',
        suppressContextMenu: true,
        rowStyle: {fontSize: '11px', color: '#444'},
        tooltipShowDelay: 1,
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
      },
    };
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Hazard`,
      meta: [],
    };
  },
  mounted() {
    // if is used to apply a returned deepLink filter
    // else if is used to show the filter during the preparation of the filter that will be uploaded to the database
    if (this?.deepLink?.deepLink) {
      this.pageState = this.deepLink.deepLink;
      this.activeSection = this.pageState.activeSection;
      this.activeCategory = this.pageState.category;
      this.selectDataType(this.activeSection);
    } else if (window.localStorage.getItem('gridState')) {
      const saved = JSON.parse(window.localStorage.getItem('gridState'));
      const pagePath = this.$route.path.split('/')[2];
      if (saved.page === pagePath) {
        this.pageState = saved;
        // eslint-disable-next-line radix
        this.activeSection = saved.activeSection;
        this.activeCategory = saved.category;
        this.selectDataType(this.activeSection);
      }
    }
  },
  methods: {
    toggleDetails(paneName) {
      this[paneName] = !this[paneName];
    },
    onGridState(params) {
      const pageState = {};
      pageState.page = params.page;
      pageState.gridRef = params.reference;
      pageState.colStateSort = params.colStateSort;
      pageState.sort = params.sort;
      pageState.filter = params.filter;
      pageState.activeSection = this.activeSection;
      pageState.category = this.activeCategory;
      // console.log('UPDATED PAGE STATE: ', JSON.stringify(pageState))
      window.localStorage.setItem('gridState', JSON.stringify(pageState));
    },
    clickButton(button) {
      setTimeout(() => {
        if (button === 'human') {
          this.humanButton.click();
        }
        if (button === 'eco') {
          this.ecoButton.click();
        }
      }, 10);
    },
    onGridRef(params) {
      if (params.reference === 'hazard') {
        this.gridApi = params.gridApi;
        this.columnApi = params.columnApi;
      }
    },
    selectDataType(selectedCode) {
      this.activeSection = selectedCode;
      this.changeGridData();
    },
    basicRound(params) {
      return Math.round(params.value);
    },
    onExportData(format) {
      const gridType = format.reference;
      const exportLabel = format.reference === 'hazard' ? 'Human' : 'Eco';
      const timeStamp = this.dateFormat();
      const fileName = `${this.chemical.dtxsid} ${exportLabel} ${this.currentSectionName}-${timeStamp}`;
      if (gridType === 'hazard') {
        const exportConfig = {
          gridApi: this.gridApi,
          columns: this.exportColDefs,
          fileName: fileName,
          fileFormat: format.fileType,
          splitSheet: {
            xSplit: 1,
            ySplit: 1,
          },
        };
        this.exportData(exportConfig);
      }
    },
    changeGridData() {
      this.currentSectionName = this.selectOptions.find(el => el.value == this.activeSection).text;
      const humanObj = this.activeProperties?.human.find(obj => obj.arrKey === this.activeSection);
      if (humanObj && humanObj.rawData.length > 0) {
        this.gridConfigurationObj.gridData = humanObj.rawData;
      } else {
        this.gridConfigurationObj.gridData = [];
      }
    },
    onSummaryClick(params) {
      if (params.column.colId === 'more') {
        this.moreData = params.data;
        this.rowNum = params.rowIndex + 1;
        this.moreModalvis = true;
      }
    },
    toggleModal(p) {
      this.moreModalvis = false;
    },
    moreButton(params) {
      const b = '<i class="fas fa-file-alt fa-lg"></i>';

      return b;
    },
    downloadData() {
      let csv = '';
      // eslint-disable-next-line no-restricted-syntax
      const fileName = `${this.getDtxsid}_Hazard_${this.activeSection}_Toxval_${this.activeCategory}_row${this.rowNum}.csv`;
      Object.entries(this.moreData).forEach((key) => {
        csv += `${key}\n`;
      });
      const blob = new Blob([csv], {type: 'application/javascript'});
      this.fileDownloader(fileName, blob);
    },

  },
};
</script>

<style lang="css">
:deep(.toolbar) {
  margin-top:4px !important;
  padding-bottom:4px !important;
}
</style>
