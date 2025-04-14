<template>
  <div>
    <div class="graphName">
      {{ name }}
    </div>
    <svg :width="width" :height="height">
      <g class="chart-lines">
        <g v-for="line in gridLines" :key="line" class="gridline">
          <line
            class="gridlines"
            :x1="valueToGrid(line)"
            :y1="height - margin - 15"
            :x2="valueToGrid(line)"
            :y2="margin - 20"
          />
          <line :x1="valueToGrid(line)" :y1="height - margin - 5" :x2="valueToGrid(line)" :y2="height - margin - 15" />
          <text :x="valueToGrid(line) - 5" :y="height - margin + 5" font-size="12">{{ line }}</text>
        </g>
        <line class="axisline" :x1="margin" :y1="height - margin - 15" :x2="width - margin" :y2="height - margin - 15" />
      </g>
      <g v-for="(pod, index) in data" :key="index" class="pod-data">
        <line
          :x1="valueToGrid(pod.min)"
          :y1="indexToGrid(index, data.length)"
          :x2="valueToGrid(pod.max)"
          :y2="indexToGrid(index, data.length)"
        />
        <text :x="width - 250" :y="indexToGrid(index, data.length) + 5" font-size="11">{{ pod.label }}</text>
        <circle :cx="valueToGrid(pod.min)" :cy="indexToGrid(index, data.length)" r="4"><title>Min: {{ pod.min.toFixed(3) }}</title>
        </circle>
        <circle :cx="valueToGrid(pod.max)" :cy="indexToGrid(index, data.length)" r="4"><title>Max: {{ pod.max.toFixed(3) }}</title>
        </circle>
      </g>
      <g>
        <text class="label" :x="width / 2" :y="height - margin / 3">log({{ unit }})</text>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'PodChart',
  props: {
    name: String,
    unit: String,
    data: Array,
    width: Number,
    height: Number,
  },
  data() {
    return {
      margin: 30,
      min: -12,
      max: 12,
      ticks: 7,
    };
  },
  computed: {
    gridLines() {
      const step = (this.max - this.min) / (this.ticks - 1);
      return Array.from(Array(this.ticks)).map((e, i) => this.min + i * step);
    },
  },
  methods: {
    indexToGrid(index, len) {
      const height = this.height - this.margin * 2;
      const val = this.margin - 25 + (len - index) * (height / len);
      return val;
    },
    valueToGrid(value) {
      const width = this.width - this.margin * 2;
      const result = this.margin + (value - this.min) * (width / (this.max - this.min));
      return result;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graphName {
  text-align: center;
  font-size:  1.2em;
}

svg {
  shape-rendering: crispedges;
}

svg line {
  stroke-width: 1px;
  stroke:       black;
}

line.gridlines {
  stroke: lightgrey;
}

.pod-data line {
  stroke-width: 3px;
}

text.name {
  font-size:   16px;
  font-weight: 200;
}

text.label {
  text-anchor: middle;
}
</style>
