<template>
  <div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">Isotope Pattern</p>
  </header>
  <section class="modal-card-body">
    <div ref="graph"></div>
    <bTable :data="tableData" default-sort="x">
      <template slot-scope="props">
        <bTableColumn field="x" label="Mass" width="50" sortable numeric>
          {{ props.row.x }}
        </bTableColumn>
        <bTableColumn field="y" label="Relative Abundance" width="50" sortable numeric>
          {{ props.row.y | ncctRound }}
        </bTableColumn>
      </template>
    </bTable>
  </section>
  </div>
  </template>

<script>
export default {
  name: 'IsotopePattern',
  props: ['formula'],
  data() {
    return {tableData: []}
  },
  mounted() {
    const settings = {
      highlightCircleSize: 4,
      ylabel: 'relative abundance',
      xlabel: 'm/z',
      title: 'Isotope Pattern',
      visibility: [true, true, true, true],
      width: 580,
      height: 400,
      xRangePad: 20,
      xValueParser: parseFloat,
      axes: {
        x: {
          axisWidthLabel: 60,
        },
      },
      colors: ['rgb(0,0,204)', 'rgb(0,135,35)', 'rgb(204,0,0)', 'rgb(204,0,0)'],
      // fillGraph: true,
      connectSeparatedPoints: true,
      labels: ['mass', 'relative abundance'],
      includeZero: true,
      'relative abundance': {
        plotter: this.barChartPlotter,
      },
      centroid: {
        plotter: this.barChartPlotter,
      },
      intensoid: {
        plotter: this.barChartPlotter,
      },
    }
    const {xy} = window.CI.Chemcalc.analyseMF(this.formula, {isotopomers: 'xy', fwhm: 0.0001})
    // this is how Dygraph works http://dygraphs.com/
    // eslint-disable-next-line no-unused-vars
    const g = new window.Dygraph(this.$refs.graph, xy, settings)
    this.tableData = xy.trim().split(/\n/g).map((line) => {
      const lineSplit = line.split(/,/).map(text => parseFloat(text.trim()))
      return {x: lineSplit[0], y: lineSplit[1]}
    })
  },
  methods: {
    barChartPlotter(e) {
      var ctx = e.drawingContext
      var points = e.points
      var yBottom = e.dygraph.toDomYCoord(0)

      var barWidth = 1
      // 2/3 * (points[1].canvasx - points[0].canvasx)
      // ctx.fillStyle =e.color
      // ctx.fill()

      // Do the actual plotting.
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const centerX = p.canvasx
        // center of the bar

        ctx.fillRect(centerX - barWidth / 2, p.canvasy,
          barWidth, yBottom - p.canvasy)
        ctx.strokeRect(centerX - barWidth / 2, p.canvasy,
          barWidth, yBottom - p.canvasy)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
