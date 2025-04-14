<template>
  <div>
    <a
      v-if="params.data.dtxsid || params.data.dtxcid"
      :href="`/dashboard/chemical/details/${display}`"
      @click="startLoading"
    >
      {{ params.data.dtxsid || params.data.dtxcid }}
    </a>
    <span v-else>
      {{ display }}
    </span>
    <br>
    <mdb-tooltip v-if="isStereo" trigger="hover" :append-to-body="true" :options="{placement: 'right'}">
      <span slot="tip">Stereocenter(s) present</span>

      <img v-if="isStereo" slot="reference" :width="20" :src="`/dashboard/stereocenter.png`">
    </mdb-tooltip>
    <mdb-tooltip v-if="isIsotope" trigger="hover" :append-to-body="true" :options="{placement: 'right'}">
      <span slot="tip">Has Defined Isotope</span>

      <img v-if="isIsotope" slot="reference" :width="30" :src="`/dashboard/isotope.png`">
    </mdb-tooltip>
  </div>
</template>

<script>
import {
  mdbTooltip,
} from 'mdbvue'

export default {
  name: 'DTXSIDDetails',
  components: {
    mdbTooltip,
  },
  computed: {
    isStereo() {
      return parseInt(this.params.data.stereo, 10)
    },
    isIsotope() {
      return parseInt(this.params.data.isotope, 10)
    },
    display() {
      if (!this.params.data.dtxsid && this.params.data.dtxcid) { return `${this.params.data.dtxcid}` }
      if (this.params.data.listName) {
        return `${this.params.data.dtxsid}?list=${this.params.data.listName}`
      }
      return `${this.params.data.dtxsid}`
    },
  },
  methods: {
    startLoading() {
      this.$nuxt.$loading.start()
    },
  },
}
</script>
