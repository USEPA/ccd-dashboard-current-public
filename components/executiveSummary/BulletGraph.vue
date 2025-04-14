<template>
<div class="clip">
	<svg :width="width" :height="height">
		<g class="chart-lines">
			<g class="gridline" v-for="line in labels" :key="line">
				<line class="gridlines" :x1="valueToGrid(line)" :y1="height - margin + 5" :x2="valueToGrid(line)"
					  :y2="margin" />
				<line :x1="valueToGrid(line)" :y1="height - margin + 11" :x2="valueToGrid(line)" :y2="height - margin + 5" />
				<text :x="valueToGrid(line) - 5" :y="height - margin + 25" font-size="12">{{ line }}</text>
			</g>
			<line class="axisline" :x1="margin" :y1="height - margin + 5" :x2="width - margin" :y2="height - margin + 5" />
			<line :x1="valueToGrid(min)" :y1="height - margin + 11" :x2="valueToGrid(min)" :y2="height - margin + 5" />
			<line :x1="valueToGrid(max)" :y1="height - margin + 11" :x2="valueToGrid(max)" :y2="height - margin + 5" />
		</g>
		<g v-for="color in graph.range" class="colorbar" :key="`${color.color}${Math.random()*10}`">
			<line :x1="valueToGrid(color.range[0])" :x2="valueToGrid(color.range[1])" y1="45" y2="45"
				  :stroke="color.color" />
		</g>
		<g class="marker">
			<line :x1="valueToGrid(minMaxCheck(data))" y1="54" :x2="valueToGrid(minMaxCheck(data))" y2="36" />
			<circle :cx="valueToGrid(minMaxCheck(data))" cy="54" r="4" />
			<circle :cx="valueToGrid(minMaxCheck(data))" cy="36" r="4" />
			<text :x="valueToGrid(minMaxCheck(data)) - 12" y="28" font-size="12">{{ data }}</text>
		</g>
	</svg>
	<div>
		{{ name }}
	</div>
</div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'bullet-graph',
  props: ['name', 'graph', 'data'],
  data() {
    return {
      width: 200,
      height: 80,
      margin: 30,
    }
  },
  computed: {
    min() { return Math.min(...this.graph.range.reduce((acc, el) => acc.concat(el.range), [])) },
    max() { return Math.max(...this.graph.range.reduce((acc, el) => acc.concat(el.range), [])) },
    labels() {
      const labels = []
      for (let i = this.graph.min; i <= this.max; i = i + this.graph.step) {
        labels.push(i)
      }
      return labels
    },
  },
  methods: {
    minMaxCheck(value) {
      return Math.max(Math.min(value, this.max), this.min)
    },
    valueToGrid(value) {
      const width = this.width - this.margin * 2
      return this.margin + (value - this.min) * (width / (this.max - this.min))	
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg line {
	stroke-width: 1px;
}

.chart-lines line {
	stroke:          black;
	shape-rendering: crispedges;
}

line.gridlines {
	stroke: lightgrey;
}

.colorbar line {
	stroke-width: 12px;
}

.marker line {
	stroke-width: 2px;
	stroke:       black;
}

.label text {
	text-anchor: middle;
	font-size:   14px;
}

.clip {
	text-align: center;
}
</style>
