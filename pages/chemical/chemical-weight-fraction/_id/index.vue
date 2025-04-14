<template>
  <div class="pr-0">
    <div class="h2">
      <ccte-help-text
        data-cy="ChemicalWeightFractionHeader"
        label-type="span"
        heading-text="Chemical Weight Fractions (CWF)"
        help-key="SR Chemical Weight Fraction"
      />
    </div>
    <chemical-detail-tab-grid-toolbar
      :cname="cname"
      :toolbar-config="toolbarConfig"
      @onFilter="onFilter"
      @onExport="onExport"
    />
    <grid-tips
      :cname="cname"
      grid-heading=""
      grid-reference="cwf"
      :show-export="false"
      :toolbar-config="toolbarConfig"
      :config-obj="gridConfigurationObj"
      :grid-size="gridSize"
      @gridRef="onGridRef"
    />
  </div>
</template>

<script>
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
  name: 'ExposureChemicalWeightFractions',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
  },
  data() {
    return {
      cwfData: [],
      toolbarConfig: {
        select: false,
        search: true,
        radio: false,
        export: true,
      },
      gridConfigurationObj: {},
      gridRefs: {},
      cname: {
        baseName: 'Chemical Weight Fractions',
        camelName: 'chemicalWeightFractions',
      },
      gridSize: 'height:450px;width:100%',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    const cwfData =
       await context.app.$repositories.exposure.chemicalWeightFractions(context.params.id);
    return {
      cwfData,
    };
  },
  beforeMount() {
    this.gridConfigurationObj = {
      gridData: this.cwfData,
      gridOptions: {
        enableCellTextSelection: true,
        unSortIcon: true,
        suppressContextMenu: true,
        headerHeight: 50,
        components: {
          ncctRound2: this.ncctRound2,
        },
      },
      defaultColDef: {
        hide: false,
        sortable: true,
        resizable: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        filter: true,
        tooltipShowDelay: 0,
        floatingFilter: true,
      },
      gridColumnDefs: [
        {
          headerName: 'Product Name',
          field: 'productName',
          filter: 'agTextColumnFilter',
          tooltipField: 'productName',
          cellClass: 'cell-tooltip',
          headerTooltip: 'Name of the product; note a product is defined by a unique UPC and not a unique name.',
          width: 250,
          minWidth: 200,
        }, {
          headerName: 'Product Use Category',
          field: 'displayPuc',
          headerTooltip: 'Product Use Category (PUC) assigned to a product (see Isaacs et al. 2020).',
          cellRenderer: 'PucPopOverUnderline',
          cellRendererParams: {
            popField: 'displayPuc',
          },
          minWidth: 170,
          maxWidth: 250,
        }, {
          headerName: 'Categorization Subtype',
          field: 'categorizationSubtype',
          headerTooltip: ' Indicates the type of PUC',
          filter: 'agTextColumnFilter',
          minWidth: 130,
          maxWidth: 170,
        }, {
          headerName: 'Minimum Weight Fraction',
          field: 'minimumWeightFraction',
          headerTooltip: 'Minimum weight fraction as reported in an MSDS or SDS, or 5th percentile of the predicted weight fraction value for ingredient lists. If the weight fraction was reported as a point estimate in the MSDS or SDS, min. and max. weight fraction will be the same.',
          minWidth: 120,
          maxWidth: 150,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          cellRenderer: 'ncctRound2',
        }, {
          headerName: 'Maximum Weight Fraction',
          field: 'maximumWeightFraction',
          headerTooltip: 'Maximum weight fraction as reported in an MSDS or SDS, or 95th percentile of the predicted weight fraction value for ingredient lists. If the weight fraction was reported as a point estimate in the MSDS or SDS, min. and max. weight fraction will be the same.',
          minWidth: 120,
          maxWidth: 150,
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          cellRenderer: 'ncctRound2',
        }, {
          headerName: 'Data Type',
          field: 'dataType',
          headerTooltip: 'Indicates data type for quantitative weight fraction data. Data on weight fraction may be reported by the manufacturer (typically through an MSDS or SDS), or predicted from an ingredient list (see Isaacs et al. 2017).',
          minWidth: 120,
          maxWidth: 140,
        }, {
          headerName: 'Source',
          field: 'source',
          filter: 'agTextColumnFilter',
          cellClass: 'cell-tooltip',
          tooltipValueGetter: x => `
            Weight fraction data for specific products were curated from the original publicly-available data source (${x.data.sourceURL}). Note: The original source may no longer be maintained or available.`,
          headerTooltip: 'Indicates source the data was obtained from.',
          cellRenderer(params) {
            return (params.value !== 'SIRI') ?
              `<a href='${params.data.sourceURL}' target="_blank" rel="noopener">${params.value}</a>` :
              `${params.value}`;
          },

        },
        {
          headerName: 'Product Count',
          field: 'productCount',
          headerTooltip: 'Number of products with identical name, weight fraction, and source data but unique UPCs.',
          minWidth: 100,
          maxWidth: 120,
          filter: 'agSetColumnFilter',
        },
      ],
      statusBar: {
        statusPanels: [{statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'}],
      },
    };
  },
  created() {
  },
  methods: {
    onGridRef(params) {
      this.gridRefs[params.reference] = params;
    },
    onFilter(input) {
      this.gridRefs.cwf.gridApi.setQuickFilter(input);
    },
    onExport(params) {
      // console.log('onExport in CWF ', this.config)
      params.fileName = `${this.chemical.dtxsid} CWF.xlsx`;
      if (params.fileType === 'csv') {
        this.gridRefs.cwf.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.gridRefs.cwf.gridApi.exportDataAsExcel(params);
      }
    },
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Chemical Weight Fractions`,
      meta: [],
    };
  },

};
</script>
<style>
.cell-tooltip>.ag-cell-wrapper {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  display: block !important;
}

.cell-tooltip {
  text-decoration-line: underline !important;
  text-decoration-style: dashed !important;
  text-underline-offset: 3px !important;
}
</style>
