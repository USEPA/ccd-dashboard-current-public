<template>
  <div class="chart-container">
    <header class="chart-header">
      <span>{{ title }}</span>
    </header>
    <histogram
      v-model="selectedBars"
      :x-axis-label="label"
      :x-axis-data-points="xAxisDataPoints"
      :y-axis-data-points="yAxisDataPoints"
      :tool-tips="toolTips"
    />
  </div>
</template>
<script>
import Histogram from '~/components/charts/Histogram.vue'

export default {
  name: 'AssayHistogram',
  components: {
    Histogram,
  },
  props: {
    value: {
      type: Array,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    chemicals: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    xAxisDataPoints: [],
    yAxisDataPoints: [],
    toolTips: [],
    chemicalsByRange: {},
    selectedBars: [],
  }),
  watch: {
    selectedBars(barIndicies) {
      this.$emit('input', barIndicies.flatMap(index => [...this.chemicalsByRange[index]]))
    },
  },
  created() {
    const bioActiveChemicals = this.chemicals.filter(c => c.hitc === 1)

    this.getBars(this.type).forEach((bar, index) => {
      const chemicalsInRange = bar.func(bioActiveChemicals)
      this.chemicalsByRange[index] = chemicalsInRange.map(c => c.dtxsid)

      const chemicalCount = chemicalsInRange.length
      this.yAxisDataPoints.push(chemicalCount)
      this.xAxisDataPoints.push(bar.label)
      this.toolTips.push(`Range: ${bar.min} - ${bar.max}`)
    })
  },
  methods: {
    getBars(histogramType) {
      const histFunc = (property, min, max, first, last) => chems => chems.filter((c) => {
        if (first) {
          return c[property] < max
        }
        if (last) {
          return min <= c[property]
        }
        return min <= c[property] && c[property] < max
      })

      if (histogramType === 'logAc50') {
        const logAcBases = [-3, -2, -1, 0, 1, 2, 3]
        const lastLogAcBase = logAcBases.length - 1
        return logAcBases.map((b, i) => ({
          label: 10 ** b,
          min: i === 0 ? '-Infinity' : b - 0.5,
          max: i === lastLogAcBase ? 'Infinity' : b + 0.5,
          func: histFunc('logAc50', b - 0.5, b + 0.5, i === 0, i === lastLogAcBase),
        }))
      }

      if (histogramType === 'scaled') {
        const scaledBases = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const lastScaledBase = scaledBases.length - 1
        return scaledBases.map((b, i) => ({
          label: b,
          min: i === 0 ? '-Infinity' : b - 0.5,
          max: i === lastScaledBase ? 'Infinity' : b + 0.5,
          func: histFunc('scaledTop', b - 0.5, b + 0.5, i === 0, i === lastScaledBase),
        }))
      }

      return null
    },
  },
}
</script>
<style scoped>
.chart-container {
  display: inline-block;
  margin: 14px;
  border: 1px black solid;
  padding-right: 28px;
}

.chart-header {
  text-align: center;
  margin: 8px;
}
</style>
