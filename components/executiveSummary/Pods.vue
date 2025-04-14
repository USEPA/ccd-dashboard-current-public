<template>
  <div v-if="podData" class="pod-container">
    <PodChart
      :v-if="oralPodMins.length > 0"
      :width="width"
      :height="height"
      :class="{ disabled: !oralPodSort }"
      name="Oral"
      unit="mg/kg/day"
      :data="oralPodMins"
    />
    <PodChart
      v-if="inhalePodMins.length > 0"
      :width="width"
      :height="height"
      :class="{ disabled: !inhalePodMins }"
      name="Inhalation"
      unit="mg/m3"
      :data="inhalePodMins"
    />
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex'
import PodChart from './PODChart.vue'

export default {
  name: 'Pods',
  components: {PodChart},
  props: {
    width: Number,
    height: Number,
  },
  data() {
    return {
      podData: true,
      oralPodSort: [],
      inhalePodSort: [],
    }
  },
  computed: {
    ...mapGetters({
      getPodData: 'executiveSummary/getOralPodData',
    }),
    oralPodMins() {
      this.oralPodSort = this.getPodData()
      this.podData = this.getPodData()
      if (this.oralPodSort.length > 0) {
        if (this.oralPodSort[0].oral) {
          return this.oralPodSort[0].oral.map(item => ({
            label: item.label,
            min: Math.log10(item.min),
            max: Math.log10(item.max),
          }))
        }
      }
      return []
    },
    inhalePodMins() {
      this.inhalePodSort = this.getPodData()
      if (this.inhalePodSort.length > 0) {
        if (this.inhalePodSort[0].inhalation) {
          return this.inhalePodSort[0].inhalation.map(item => ({
            label: item.label,
            min: Math.log10(item.min),
            max: Math.log10(item.max),
          }))
        }
      }
      return []
    },
  },
  mounted() {
    if (this.getPodData().length > 0) {
      this.emitShowPods(true)
    } else {
      this.emitShowPods(false)
    }
  },
  methods: {
    emitShowPods(value) {
      this.$emit('onShowPods', value)
    },
  },
}
</script>

<style scoped>
.pod-container {
  display:         flex;
  justify-content: space-around;
  flex-flow:       row wrap;
  align-items:     center;
  background-color: white;
  width: fit-content;
}

.heading {
  flex-basis: 100%;
  text-align: center;
}

.headingText {
  font-size: 1.5em;
}

.pod-container > * {
  padding: 4px;
}
</style>
