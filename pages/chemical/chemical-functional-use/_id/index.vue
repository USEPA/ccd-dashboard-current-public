<template>
  <div style="margin-top:10px">
    <div class="h2 ml-5">
      <ccte-help-text
        data-cy="ExposureCollectedDataonFunctionalUse"
        label-type="span"
        :heading-text="`Exposure - Collected and Predicted Data on Functional Use`"
        help-key="ChemicalFunctionalUseHeader"
      />
    </div>

    <div v-if="rfuGridConfigurationObj.gridData.length > 0" class="row pr-4">
      <div class="col-12">
        <div class="d-flex flex-wrap">
          <div class="col" style="min-width: 550px;">
            <chemical-detail-tab-grid-toolbar
              :cname="rfuConfig.cname"
              :toolbar-config="toolbarConfig"
              @onFilter="onFilterReported"
              @onExport="onExportReported"
            />
            <grid-tips
              :show-export="showExport"
              :cname="rfuGridConfigurationObj.cname"
              grid-reference="rfu_table"
              grid-heading="Collected Data on Functional Use"
              :grid-size="gridSize"
              :config-obj="rfuGridConfigurationObj"
              @gridRef="onGridRef"
            >
              <mdb-popover trigger="hover" data-cy="keywords-header-tooltip" :append-to-body="true" :options="{placement: 'right'}">
                <span slot="body">
                  <strong style="font-size: .85rem; color: #444; font-weight: 600;">The Collected Data on Functional Use Table contains chemical functional uses that have been reported in public documents and collected and harmonized by EPA.</strong> The following papers are recommended reading: <a href="http://www.sciencedirect.com/science/article/pii/S2214750016300671" target="_blank">K Isaacs et al, 2016, Toxicology Reports</a> and <a href="http://pubs.rsc.org/en/content/articlelanding/2016/gc/c6gc02744j#!divAbstract" target="_blank" rel="noopener noreferrer">K Phillips et al 2017, Green Chemistry</a><br>Reported functions have been mapped to categories defined in the OECD report “<a href="https://one.oecd.org/document/ENV/JM/MONO(2017)14/en/pdf" title="Internationally Harmonised Functional, Product, and Article Use Categories" target="_blank" rel="noopener noreferrer">Internationally Harmonised Functional, Product, and Article Use Categories</a>”. Additional categories (denoted with “EPA”) have been developed by EPA Office of Research and Development for use in its Chemicals and Products Database (CPDat). Current and future releases of CPDat (including detailed functional use data) can be found at <a href="https://doi.org/10.23645/epacomptox.5352997" target="_blank" rel="noopener noreferrer">https://doi.org/10.23645/epacomptox.5352997</a>.
                </span>
                <mdb-icon slot="reference" :class="'ml-2'" icon="info-circle" />
              </mdb-popover>
            </grid-tips>
          </div>
          <div class="col" style="min-width: 550px;">
            <chemical-detail-tab-grid-toolbar
              :cname="pfuConfig.cname"
              :toolbar-config="toolbarConfig"
              @onFilter="onFilterPredicted"
              @onExport="onExportPredicted"
            />
            <grid-tips
              :show-export="showExport"
              :cname="pfuGridConfigurationObj.cname"
              grid-reference="pfu_table"
              grid-heading="Predicted Probability of Associated Functional Use"
              :grid-size="gridSize"
              :config-obj="pfuGridConfigurationObj"
              @gridRef="onGridRef"
            >
              <mdb-popover trigger="hover" data-cy="keywords-header-tooltip" :append-to-body="true" :options="{placement: 'right'}">
                <div slot="body">
                  <strong style="font-size: .85rem; color: #444; font-weight: 600;">The Predicted Probability of Functional Use Table contains predictions from EPA’s Quantitative Structure Use Relationship (QSUR) models.</strong> The following paper is recommended reading: <a href="http://pubs.rsc.org/en/content/articlelanding/2016/gc/c6gc02744j#!divAbstract" target="_blank" rel="noopener noreferrer">K Phillips et al 2017, Green Chemistry</a>.
                  <strong style="font-size: .85rem; color: #444; font-weight: 600;">
                    QSUR Version/Date: 2015-11-06
                  </strong>
                </div>
                <mdb-icon slot="reference" :class="'ml-2'" icon="info-circle" />
              </mdb-popover>
            </grid-tips>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row pr-4">
        <div class="col-12 d-flex justify-content-center">
          <h3 style="font-size: 16px; color: #444; font-weight: 600;">
            <strong style="font-size: 16px; color: #444; font-weight: 600;">
              There are no Collected Data on Functional Use
            </strong>
          </h3>
        </div>
      </div>
      <div class="row pr-4">
        <div class="col-12">
          <chemical-detail-tab-grid-toolbar
            :cname="pfuConfig.cname"
            :toolbar-config="toolbarConfig"
            @onFilter="onFilterPredicted"
            @onExport="onExportPredicted"
          />
          <grid-tips
            :show-export="showExport"
            :cname="pfuGridConfigurationObj.cname"
            grid-reference="pfu_table"
            grid-heading="Predicted Probability of Associated Functional Use"
            :grid-size="gridSize"
            :config-obj="pfuGridConfigurationObj"
            @gridRef="onGridRef"
          >
            <mdb-popover trigger="hover" data-cy="keywords-header-tooltip" :append-to-body="true" :options="{placement: 'right'}">
              <div slot="body">
                <strong style="font-size: .85rem; color: #444; font-weight: 600;">The Predicted Probability of Functional Use Table contains predictions from EPA's Quantitative Structure Use Relationship (QSUR) models.</strong> The following paper is recommended reading: <a href="http://pubs.rsc.org/en/content/articlelanding/2016/gc/c6gc02744j#!divAbstract" target="_blank" rel="noopener noreferrer">K Phillips et al 2017, Green Chemistry</a>.
                <strong style="font-size: .85rem; color: #444; font-weight: 600;">
                  QSUR Version/Date: 2015-11-06
                </strong>
              </div>
              <mdb-icon slot="reference" :class="'ml-2'" icon="info-circle" />
            </mdb-popover>
          </grid-tips>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mdbPopover,
  mdbIcon,
} from 'mdbvue';
import {
  mapState,
} from 'vuex';
import ChemicalDetailTabGridToolbar from '~/components/toolbars/gridToolbar/ChemicalDetailTabGridToolbar.vue';
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
  name: 'ChemicalFunctionalUseView',
  components: {
    GridTips,
    ChemicalDetailTabGridToolbar,
    mdbPopover,
    mdbIcon,
  },
  data() {
    return {
      rfuConfig: {cname: {
        baseName: 'Reported',
        camelName: 'rfu',
      }},
      pfuConfig: {cname: {
        baseName: 'Predicted',
        camelName: 'pfu',
      }},
      active: 'chemical-functional-use',
      gridSize: 'width:100%; overflow:auto',
      gridRefs: {},
      rfuGridConfigurationObj: {},
      pfuGridConfigurationObj: {},
      showExport: false,
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: true,
      },

    };
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Collected Data on Functional Use`,
      meta: [],
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    const cfuData =
       await context.app.$repositories.exposure.chemicalFunctionalUse(context.params.id);
    if (cfuData.reportedFunctionalUse === null) {
      cfuData.reportedFunctionalUse = [];
    }
    if (cfuData.predictedFunctionalUse === null) {
      cfuData.predictedFunctionalUse = [];
    }
    return {
      cfuData,
    };
  },
  beforeMount() {
    this.rfuGridConfigurationObj = {
      gridColumnDefs: [
        {
          headerName: 'Harmonized functional use',
          field: 'harmonizedFunctionalUse',

          headerTooltip: 'Harmonized functional categories (n=137) were determined by cluster analysis of reported functions for each chemical. A harmonized functional category may include more than one functional use (i.e. the cluster analysis grouped functions where the same chemicals were commonly used for all of the functions).',
        }, {
          headerName: 'Reported functional use',
          field: 'reportedFunctionalUse',
          headerTooltip: 'Functional use of the chemical in the product as defined by the original source.',
        },
      ],
      gridData: this.cfuData.reportedFunctionalUse,
      gridOptions: {
        unSortIcon: true,
        defaultColDef: {
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          autoHeight: true,
          sortable: true,
          floatingFilter: true,
        },
        headerHeight: 50,
        domLayout: 'autoHeight',
        animateRows: false,

      },
      statusBar: {
        statusPanels: [{statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'}],
      },
      cname: {
        camelName: 'reportedFunctionalUse',
        hyphenName: 'reported-functional-use',
        baseName: 'Reported Functional Use',
      },
    };
    this.pfuGridConfigurationObj = {
      gridColumnDefs: [
        {
          headerName: 'Harmonized functional use',
          field: 'harmonizedFunctionalUse',
          headerTooltip: 'Harmonized functional categories (n=137) were determined by cluster analysis of reported functions for each chemical. A harmonized functional category may include more than one functional use (i.e. the cluster analysis grouped functions where the same chemicals were commonly used for all of the functions).',
        }, {
          headerName: 'Probability',
          field: 'probability',
          cellRenderer: 'ncctRound2',
          headerTooltip: 'Probability of the chemical being used for that harmonized functional use.',
        },
      ],
      gridData: this.cfuData.predictedFunctionalUse,
      gridOptions: {
        unSortIcon: true,
        components: {
          ncctRound2: this.ncctRound2,
        },
        defaultColDef: {
          filter: 'agTextColumnFilter',
          resizable: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          autoHeight: true,
          floatingFilter: true,
          sortable: true,
        },
        headerHeight: 50,
        domLayout: 'autoHeight',
        animateRows: false,
      },
      statusBar: {
        statusPanels: [{statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'}],
      },
      cname: {
        camelName: 'predictedFunctionalUse',
        hyphenName: 'predicted-functional-use',
        baseName: 'Predicted Functional Use',
      },
    };
  },
  methods: {
    onGridRef(params) {
      this.gridRefs[params.reference] = params;
    },

    onFilterReported(input) {
      this.gridRefs.rfu_table.gridApi.setQuickFilter(input);
    },
    onFilterPredicted(input) {
      this.gridRefs.pfu_table.gridApi.setQuickFilter(input);
    },
    onExportReported(params) {
      params.fileName = `${this.chemical.dtxsid} Chemical Functional Use.${params.fileType}`;
      if (params.fileType === 'csv') {
        this.gridRefs.rfu_table.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridRefs.rfu_table.gridApi.exportDataAsExcel(params);
      }
    },
    onExportPredicted(params) {
      params.fileName = `${this.chemical.dtxsid} Chemical Functional Use-Predicted .${params.fileType}`;
      if (params.fileType === 'csv') {
        this.gridRefs.pfu_table.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridRefs.pfu_table.gridApi.exportDataAsExcel(params);
      }
    },
  },
};
</script>
