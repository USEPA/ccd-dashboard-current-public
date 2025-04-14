<template>
  <div>
    <div class="row pr-4 mt-2">
      <div class="col-sm-12 h2">
        <ccte-help-text
          data-cy="ProductandUseCategoriesHeader"
          label-type="span"
          heading-text="Product and Use Categories (PUCs)"
          help-key="ProductandUseCategoriesHeader"
        />
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-12">
        <div class="d-flex flex-wrap">
          <div class="col" style="min-width: 550px;">
            <chemical-detail-tab-grid-toolbar
              :cname="pucConfig.cname"
              :toolbar-config="toolbarConfig"
              @onFilter="onFilterPuc"
              @onExport="onExportPuc"
            />
            <grid-tips
              :cname="pucConfig.cname"
              grid-reference="puc"
              grid-heading="Product Use Categories (PUCs)"
              data-cy="productUse"
              :show-export="showExport"
              :grid-size="gridSize"
              :toolbar-config="toolbarConfig"
              :config-obj="pucConfig.gridConfigurationObj"
              @gridRef="onGridRefPuc"
            >
              <mdb-popover
                trigger="hover"
                data-cy="puc-header-tooltip"
                :append-to-body="true"
                :options="{placement: 'right'}"
              >
                <span slot="body">
                  The following is recommended reading: <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://www.nature.com/articles/s41370-019-0187-5"
                  >K.
                    Isaacs et al., 2019, Journal of Exposure Science &amp; Environmental Epidemiology.
                  </a></span>
                <span slot="reference" class="fa fa-info-circle fa-lg icon" />
              </mdb-popover>
            </grid-tips>
          </div>
          <div class="col" style="min-width: 550px;">
            <chemical-detail-tab-grid-toolbar
              :cname="keywordsConfig.cname"
              :toolbar-config="toolbarConfig"
              @onFilter="onFilterKeywords"
              @onExport="onExportKeywords"
            />
            <grid-tips
              :cname="keywordsConfig.cname"
              grid-reference="keywords"
              grid-heading="General Use Keywords"
              data-cy="generalUse"
              :show-export="showExport"
              :grid-size="gridSize"
              :toolbar-config="toolbarConfig"
              :config-obj="keywordsConfig.gridConfigurationObj"
              @gridRef="onGridRefKeywords"
            >
              <mdb-popover
                trigger="hover"
                data-cy="keywords-header-tooltip"
                :append-to-body="true"
                :options="{placement: 'right'}"
              >
                <span slot="body">
                  The following is recommended reading: <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://www.sciencedirect.com/science/article/pii/S2214750014001632"
                  >Dionisio et al. 2015</a>.
                  Please note the general use keywords presented here are an updated version of the CPCat terms and
                  cassettes presented in the paper(<a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://doi.org/10.1038/s41370-022-00451-8"
                  >see Koval et al. 2022</a>); however
                  application and interpretation of keywords/terms remains the same.
                </span>
                <span slot="reference" class="fa fa-info-circle fa-lg icon" />
              </mdb-popover>
            </grid-tips>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mdbPopover,
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
  name: 'ProductAndUseCategories',
  components: {
    ChemicalDetailTabGridToolbar,
    GridTips,
    mdbPopover,
  },
  data: vm => ({
    pucData: null,
    keywordsData: null,
    toolbarConfig: {
      select: false,
      search: true,
      radio: false,
      export: true,
    },
    showExport: false,
    gridSize: 'height: 500px; ',
    pucConfig: {
      cname: {
        baseName: 'PUC',
        camelName: 'puc',
      },
      gridConfigurationObj: {
        gridOptions: {
          enableCellTextSelection: true,
          unSortIcon: true,
          suppressContextMenu: true,
          headerHeight: 50,
        },
        defaultColDef: {
          hide: false,
          sortable: true,
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          filter: true,
          unSortIcon: true,
        },
        gridColumnDefs: [
          {
            headerName: 'Product Use Category',
            field: 'displayPuc',
            cellRenderer: 'PucPopOverUnderline',
            cellRendererParams: {
              popField: 'pucDescription',
            },
            headerTooltip: 'Product Use Category (PUC) assigned to a product',
            width: 120,
            minWidth: 120,
          },
          {
            headerName: 'Categorization Subtype',
            field: 'categorizationSubtype',
            headerTooltip: 'Indicates the type of PUC',
            width: 74,
            minWidth: 110,
          },
          {
            headerName: 'Number of Products',
            field: 'productCount',
            headerTooltip: 'Number of products assigned to the PUC',
            width: 110,
            minWidth: 110,
          },
        ],
        statusBar: {
          statusPanels: [{statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'}],
        },
      },
      gridRefs: {},
    },
    keywordsConfig: {
      cname: {
        baseName: 'Key Words',
        camelName: 'keywords',
      },
      gridConfigurationObj: {
        gridOptions: {
          enableCellTextSelection: true,
          suppressContextMenu: true,
          unSortIcon: true,
          headerHeight: 50,
        },
        defaultColDef: {
          hide: false,
          sortable: true,
          resizable: true,
          autoHeight: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          filter: true,
        },
        gridColumnDefs: [
          {
            headerName: 'General Use Keywords',
            colId: 'keywordSearch',
            flex: 1,
            width: 120,
            minWidth: 120,
            headerTooltip: 'General use keyword set assigned to a report',
            valueGetter: params => params.data.keywords.reduce((acc, wrd, idx) => {
              acc += `${wrd.keyword}${idx === params.data.keywords.length - 1 ? '' : ', '}`;
              return acc;
            }, ''),
          },
          {
            headerName: 'Number of Sources',
            field: 'sourceCount',
            headerTooltip: 'Number of sources assigned to the keyword set',
            width: 120,
            minWidth: 120,
          },
        ],
        statusBar: {
          statusPanels: [{statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'}],
        },
      },
      gridRefs: {},
    },
  }),
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    const pucData =
        await context.app.$repositories.exposure.productUseCategories(context.params.id);
    const keywordsData =
        await context.app.$repositories.exposure.productUseCategoryKeywords(context.params.id);
    return {
      pucData,
      keywordsData,
    };
  },
  created() {
    this.pucConfig.gridConfigurationObj.gridData = this.pucData || [];
    this.keywordsConfig.gridConfigurationObj.gridData = this.keywordsData || [];
  },
  methods: {
    onGridRefPuc(params) {
      this.pucConfig.gridRefs[params.reference] = params;
    },
    onFilterPuc(input) {
      this.pucConfig.gridRefs.puc.gridApi.setQuickFilter(input);
    },
    onExportPuc(params) {
      params.fileName = `${this.chemical.dtxsid} PUC.${params.fileType}`;
      if (params.fileType === 'csv') {
        this.pucConfig.gridRefs.puc.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.pucConfig.gridRefs.puc.gridApi.exportDataAsExcel(params);
      }
    },
    onGridRefKeywords(params) {
      this.keywordsConfig.gridRefs[params.reference] = params;
    },
    onFilterKeywords(input) {
      this.keywordsConfig.gridRefs.keywords.gridApi.setQuickFilter(input);
    },
    onExportKeywords(params) {
      params.fileName = `${this.chemical.dtxsid} General Use.${params.fileType}`;
      if (params.fileType === 'csv') {
        this.keywordsConfig.gridRefs.keywords.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        this.keywordsConfig.gridRefs.keywords.gridApi.exportDataAsExcel(params);
      }
    },
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Product and Use Categories (PUCs)`,
      meta: [],
    };
  },
};
</script>
