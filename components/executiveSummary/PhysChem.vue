<template>
  <div class="bullet-container">
    <bullet-graph v-if="logp !== null" name="logKow" :graph="logP" :data="logp" />
    <bullet-graph v-if="bcf !== null" name="log(BCF)" :graph="BCF" :data="bcf" />
    <bullet-graph v-if="vp !== null" name="log(VP)" :graph="VP" :data="vp" />
  </div>
</template>
<script>
import {mapState} from 'vuex'
import BulletGraph from './BulletGraph.vue'

export default {
  components: {
    BulletGraph,
  },
  data() {
    return {
      logP: {
        min: -5,
        step: 5,
        range: [
          {
            range: [-5, -2],
            color: 'red',
          }, {
            range: [-2, 2],
            color: 'yellow',
          }, {
            range: [2, 7],
            color: 'green',
          }, {
            range: [7, 11],
            color: 'yellow',
          }, {
            range: [11, 15],
            color: 'red',
          },
        ],
      },
      BCF: {
        min: -5,
        step: 5,
        range: [
          {
            range: [10, 15],
            color: 'red',
          }, {
            range: [5, 10],
            color: 'yellow',
          }, {
            range: [-5, 5],
            color: 'green',
          },
        ],
      },
      VP: {
        min: -4,
        step: 2,
        range: [
          {
            range: [-5, -1],
            color: 'green',
          }, {
            range: [-1, 1],
            color: 'yellow',
          }, {
            range: [1, 3],
            color: 'red',
          },
        ],
      },
      logp: null,
      bcf: null,
      vp: null,

    }
  },
  created() {
    this.physChemData.forEach((item) => {
      if (item.endpointAbbr === 'logKow') {
        this.logp = parseFloat(item.logvalue).toFixed(2)
      }
      if (item.endpointAbbr === 'vp') {
        this.vp = parseFloat(item.logvalue).toFixed(2)
      }
      if (item.endpointAbbr === 'bcf') {
        this.bcf = parseFloat(item.logvalue).toFixed(2)
      }
    })
  },
  computed: {
    ...mapState({
      physChemData: state => state.executiveSummary.physChemData,
    }),
  },
}
</script>
<style scoped>
.bullet-container {
	display:         flex;
	justify-content: space-around;
	flex-flow:       row wrap;
	align-items:     center;
}

.bullet-container > * {
	padding: 4px;
}
</style>
