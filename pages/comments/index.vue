<template>
  <div class="container-fluid left-fullwidth-container content pt-3">
    <chem-img-modal />
    <ccte-help-text
      data-cy="comments"
      label-type="h2"
      :heading-text="`Comments`"
      help-key="Comments"
    />
    <ClientOnly>
      <grid-tips
        :cname="cname"
        grid-reference="chemicalComments"
        grid-heading="Chemical Comments"
        :grid-size="gridSize"
        :config-obj="gridConfigurationObj"
        @gridRef="onGridRef"
        @onExport="onExportData"
        @cellClicked="onCellClicked"
      />
    </ClientOnly>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {
  mapMutations,
} from 'vuex';
import {parseISO} from 'date-fns';
import ChemImgModal from '~/components/modals/ChemImgModal.vue';
import GridTips from '~/components/grids/GridWithToolTips.vue';


export default {
  name: 'ChemicalComments',
  components: {
    ChemImgModal,
    GridTips,
  },
  data() {
    return {
      cname: {
        camelName: 'commentsLists',
        hyphenName: 'comments-lists',
        baseName: 'Comments Lists',
      },
      toolbarConfig: {
        search: true,
        filter: false,
        export: true,
        copy: false,
      },
      gridConfigurationObj: {},
      gridSize: 'height: 500px; width:100%; overflow:auto',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      defaultColumnDef: {
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        sortable: true,
        resizable: true,
      },
      columnDefs: [
        {
          headerName: 'Chemical Name',
          colId: 'chemName',
          minWidth: 130,
          maxWidth: 320,
          sortable: true,
          unSortIcon: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: false},
          field: 'chemName',
          suppressMenu: true,
          cellRenderer: 'PopOverUnderline',
          cellRendererParams: {popField: 'chemName'},
          resizable: true,
        },
        {
          headerName: 'Structure',
          field: 'dtxsid',
          colId: 'structureImage',
          suppressSizeToFit: true,
          maxWidth: 130,
          minWidth: 110,
          sortable: false,
          filter: false,
          autoHeight: true,
          suppressMenu: true,
          suppressColumnsToolPanel: true,
          floatingFilterComponentParams: {suppressFilterButton: true},
          cellRenderer: 'CommentDtxsidLink',
          cellRendererParams: {columnType: 'image'},
        },
        {
          colId: 'dtxsid',
          headerName: 'DTXSID',
          sortable: true,
          unSortIcon: true,
          maxWidth: 150,
          minWidth: 110,
          suppressSizeToFit: true,
          wrapText: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: true},
          field: 'dtxsid',
          cellRenderer: 'CommentDtxsidLink',
          cellRendererParams: {columnType: 'link'},
        },
        {
          headerName: 'Date Submitted',
          width: 80,
          minWidth: 80,
          maxWidth: 130,
          sortable: true,
          unSortIcon: true,
          suppressMenu: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: {suppressFilterButton: false},
          field: 'createdAt',
          cellRenderer: 'dateSubmitted',
          resizable: true,
        },
        {
          headerName: 'Comment',
          filter: 'agNumberColumnFilter',
          filterParams: {
            inRangeInclusive: true,
          },
          minWidth: 180,
          autoHeight: true,
          wrapText: true,
          field: 'comment',
          suppressMenu: true,
          floatingFilterComponentParams: {suppressFilterButton: false},
          cellRenderer: 'MdbCardTextRenderer',
          resizable: true,
        },
        {
          headerName: 'Status',
          width: 100,
          minWidth: 100,
          maxWidth: 170,
          field: 'status',
          suppressMenu: false,
          floatingFilterComponentParams: {suppressFilterButton: false},
          filter: 'agTextColumnFilter',
          resizable: true,
        },
        {
          headerName: 'Reply',
          width: 100,
          field: 'feedback',
          suppressMenu: true,
          autoHeight: true,
          cellRenderer: 'MdbCardTextRenderer',
          resizable: true,
        },
      ],
      exportColDefs: [
        {
          header: 'DTXSID',
          key: 'dtxsid',
          width: '16',
          formatter: 'cellHyperlink',
          formatterParams: {route: 'chemical/details/', useValue: true},
        }, {
          header: 'CHEMICAL NAME',
          key: 'chemName',
          width: '32',
        }, {
          header: 'CREATE DATE',
          key: 'createdAt',
          width: '20',
          formatter: 'cellFormatDate',
        }, {
          header: 'COMMENT',
          key: 'comment',
          width: 70,
        },
        {
          header: 'REPLY',
          key: 'feedback',
          width: 70,
        },
      ],
      rowData: null,
      gridRefs: {},
    };
  },
  async asyncData(context) {
    try {
      const currentDate = new Date(Date.now());
      const limitDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 2));
      const commentData = await context.app.$repositories.commentsAll.index('?size=3000');
      const filteredComments = commentData.filter(c => new Date(c.createdAt) >= limitDate);
      return {comments: filteredComments};
    } catch (err) {
      console.error(`ERROR ${err}`);
      return {comments: []};
    }
  },
  head() {
    return {
      title: `${process.env.APPLICATION_TITLE} Comments`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Comments`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Comments`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Comments`,
        },
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {
      headerHeight: 40,
      enableCellTextSelection: true,
      suppressContextMenu: true,
      rowHeight: 100,
      components: {
        structureImage: this.structureImage,
        dateSubmitted: this.dateSubmitted,
      },
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },

        ],
      },
    };
    const data = this.comments.map((item) => {
      if (item.dtxsid === null || typeof item.dtxsid == 'undefined' || !item.dtxsid) {
        item.dtxsid = item.annotationDtxsid;
      }
      return item;
    });
    this.gridConfigurationObj = {
      gridColumnDefs: this.columnDefs,
      defaultColumnDefs: this.defaultColumnDef,
      gridData: data,
      gridOptions: this.gridOptions,
    };
  },
  methods: {
    ...mapMutations({
      setChemicalImage: 'results/setChemicalImage',
      setModalVisibility: 'results/setModalVisibility',
    }),

    onExportData(params) {
      const timeStamp = this.dateFormat();
      this.exportData({
        fileName: `Chemical Comments-${timeStamp}`,
        gridApi: this.gridApi,
        fileFormat: params.fileType,
        columns: this.exportColDefs,
        splitSheet: {xSplit: 1, ySplit: 1},
      });
    },
    dateSubmitted(params) {
      if (params.data.createdAt) {
        return this.dateFormat(parseISO(params.data.createdAt), 'yyyy-MM-dd');
      }
      return ' - ';
    },
    onCellClicked(params) {
      if (params.colId === 'structureImage' && params.data.dtxsid) {
        const chemicalInfo = {
          name: params.data.name,
          gsid: params.data.dtxsid,
          imageBy: 'by-dtxsid',
          visible: true,
        };
        this.setChemicalImage(chemicalInfo);
      }
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
      // apply grid sort
      this.sortObj = {colId: 'createdAt', sort: 'desc'};
      this.columnApi.applyColumnState({
        state: [this.sortObj],
      });
    },
  },
};
</script>
<style >
.toolbar {
  margin-top: .7rem !important;
}

.ag-header-cell-text {
  color: #222;
  font-size: 10px;
  font-weight: 400;

}

.ag-header-cell {
  padding-left: 6px !important;
  padding-right: 6px !important;
}

.ag-header-cell-label {
  justify-content: center;
}
</style>
