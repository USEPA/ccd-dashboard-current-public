<template>
  <canvas ref="myChart" width="500" height="400" />
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {Chart} from 'chart.js'

export default {
  name: 'Histogram',
  props: {
    value: {
      type: Array,
      default: null,
    },
    xAxisDataPoints: {
      type: Array,
      default: null,
    },
    yAxisDataPoints: {
      type: Array,
      default: null,
    },
    xAxisLabel: {
      type: String,
      default: null,
    },
    toolTips: {
      type: Array,
      default: null,
    },
    gridApi: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    selected: [],
    chart: null,
  }),
  mounted() {
    const ctx = this.$refs.myChart.getContext('2d')
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        cursor: 'pointer',
        labels: this.xAxisDataPoints,
        datasets: [
          {
            barPercentage: 0.5,
            label: 'Count of Chemicals',
            backgroundColor: '#C33',
            borderColor: '#FF6384',
            data: this.yAxisDataPoints,
          },
        ],
      },
      options: {
        onClick: (_, el) => {
          if (el[0]) {
            this.updateSelected(el[0]._index)
          }
        },
        onHover: (e) => {
          const point = this.chart.getElementAtEvent(e)
          if (point.length) { e.target.style.cursor = 'pointer' } else { e.target.style.cursor = 'default' }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.xAxisLabel,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Number of chemicals',
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem, data) => `Chemicals: ${tooltipItem[0].yLabel}`,
            label: (tooltipItem, data) => this.toolTips[tooltipItem.index],
          },
        },
      },
    })
  },
  methods: {
    updateSelected(value) {
      if (this.selected.includes(value)) {
        const index = this.selected.indexOf(value)
        this.selected.splice(index, 1)
      } else {
        this.selected.push(value)
      }
      this.$emit('input', this.selected)
      this.chart.data.datasets[0].backgroundColor = this.getBarBackground()
      this.chart.update()
    },
    getBarBackground() {
      return this.xAxisDataPoints.map((dataPoint, index) => (this.selected.includes(index) ? '#0E6993' : '#C33'))
    },
  },
}
</script>
