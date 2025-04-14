<template>
  <mdb-modal
    info
    size="lg"
    data-cy="isotope-pattern"
    :show="visibility"
    @shown="handleShown"
    @close="toggleVisibility"
  >
    <mdb-modal-header class="primary-color lighten-1" :close="true">
      <h3 class="white-text ">
        Isotope Pattern
      </h3>
    </mdb-modal-header>
    <mdb-modal-body class="mb-0">
      <mdb-container style="width: auto; overflow-x: auto;">
        <div id="graph" ref="graph">
          graph_placeholder
        </div>
      </mdb-container>
      <div class="container-fluid" style="height: 300px;">
        <div class="row">
          <div class="col-2" />
          <div class="col-8">
            <ag-grid-vue
              v-if="showGrid"
              ref="isotopePattern"
              :cname="cname.camelName"
              :style="gridSize"
              class="ag-theme-balham"
              :grid-options="gridConfigurationObj.gridOptions"
              :row-data="gridConfigurationObj.gridData"
              :default-col-def="defaultColDef"
              :column-defs="gridConfigurationObj.gridColumnDefs"
              :sorting="true"
              :filter="true"
              :enable-cell-text-selection="true"
              :suppress-row-click-selection="false"
              :data-cy="`${cname.camelName}Grid`"
              @handleResize="handleResize"
              @first-data-rendered="onModelUpdated"
              @grid-ready="onGridReady"
              @cell-clicked="onCellClicked"
            />
          </div>
          <div class="col" />
        </div>
      </div>
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>

import {
  mdbModal, mdbModalBody, mdbModalHeader, mdbBadge, mdbContainer,
} from 'mdbvue';
import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'IsotopePattern',
  components: {
    AgGridVue,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbContainer,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['formula', 'visibility', 'chartData', 'rowData'],
  data() {
    return {
      showGrid: false,
      defaultColDef: {
        width: 100,
        editable: false,
        sortable: true,
        resizable: true,
        filter: true,
        tooltipComponent: 'customTooltip',
      },
      gridOptions: {headerHeight: 50},
      gridApi: null,
      columnApi: null,
      gridComponent: '',
      gridConfigurationObj: {
        gridOptions: {
          headerHeight: 50,
        },
        gridColumnDefs: [
          {
            headerName: 'Mass',
            field: 'x',
            sortable: true,
            width: 200,
            suppressSizeToFit: true,
          },
          {
            headerName: 'Relative Abundance',
            field: 'y',
            resizable: true,
            sortable: true,
            width: 200,
          },
        ],
        gridData: this.rowData,
      },
      gridSize: 'height: 280px; overflow: auto; width: 450px;',
      containerClass: '',
      cname: {
        camelName: 'isotopePattern',
        hyphenName: 'isotope-pattern',
        baseName: 'Isotope Pattern',
      },
    };
  },
  updated() {
    if (this.visibility) {
      const graph = document.getElementById('graph');
      // eslint-disable-next-line no-undef
      const g = new Dygraph('graph', this.chartData, {
        highlightCircleSize: 4,
        ylabel: 'relative abundance',
        xlabel: 'm/z',
        title: 'Isotope Pattern',
        width: 600,
        height: 400,
        xRangePad: 20,
        xValueParser: parseFloat,
        colors: ['rgb(0,0,204)', 'rgb(0,135,35)', 'rgb(204,0,0)', 'rgb(204,0,0)'],
        connectSeparatedPoints: true,
        labels: ['mass', 'relative abundance'],
        includeZero: true,
        plotter: this.barChartPlotter,
      });
    }
  },
  methods: {
    handleShown() {
      this.showGrid = true;
    },
    toggleVisibility() {
      this.showGrid = false;
      this.$emit('toggleVisibility');
    },
    barChartPlotter(e) {
      const ctx = e.drawingContext;
      const {points} = e;
      const yBottom = e.dygraph.toDomYCoord(0);
      const barWidth = 1;

      // Do the actual plotting.
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const centerX = p.canvasx;

        // center of the bar
        ctx.fillRect(centerX - barWidth / 2, p.canvasy,
          barWidth, yBottom - p.canvasy);
        ctx.strokeRect(centerX - barWidth / 2, p.canvasy,
          barWidth, yBottom - p.canvasy);
      }
    },
    handleResize() {
      if (this.gridApi !== null) {
        this.gridApi.sizeColumnsToFit();
        if (window.screen.width === 1200 ||
            window.screen.width === 992 ||
            window.screen.width === 768 ||
            window.screen.width === 576) {
          this.gridApi.resetRowHeights();
        }
      }
    },
    onCellClicked(params) {
      // leave for future use
    },
    onModelUpdated(params) {
      this.handleResize();
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
  },
};
</script>
<style>
#graph {
  margin: 24px;
}

.dygraph-title {
  font-weight: bold;
}

.dygraph-label {
  text-align: center;
}

.dygraph-ylabel {
  transform: rotate(-90deg);
  margin-left: 38px;
}

.dygraph-legend {
  float: right;
  margin-top: 22px;
}
</style>
