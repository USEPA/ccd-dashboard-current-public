<template>
  <div>
    <mdb-popover v-if="popText" :append-to-body="true" size="sm" trigger="hover" :options="{placement: 'right'}">
      <span slot="body" v-html="popText" />
      <button
        slot="reference"
        type="button"
        class="btn btn-outline btn-grid-inline"
        @click="assayDataToggle"
      >
        <i v-if="icon === 'fa-file-alt'" class="fas fa-file-alt" />
        <i v-else-if="icon === 'fa-th'" class="fas fa-th" />
      </button>
    </mdb-popover>
  </div>
</template>

<script>
import {
  mdbPopover,
} from 'mdbvue'

export default {
  name: 'AssayDataToggle',
  components: {
    mdbPopover,
  },
  computed: {
    icon() {
      const data = this.params.icon
      return data
    },
    popText() {
      let textString = ''
      if (this.params.icon === 'fa-th') {
        textString = 'Show the assay data information.'
      }
      if (this.params.icon === 'fa-file-alt') {
        textString = 'Show the assay details modal popup.'
      }
      return textString
    },
  },
  methods: {
    assayDataToggle() {
      let qs = ''
      let params = {}
      if (this.params.dataAction === 'assayDataToggle') {
        params.assayId = this.params.data.assayId
        params.assayName = this.params.data.assayName
        params.dtxsid = this.params.data.dtxsid
        params.categoryId = this.params.data.categoryId
      }
      if (this.params.dataAction === 'actorDetailsModal') {
        qs = `assayId=${this.params.data.assayId}&categoryId=${this.params.data.categoryId}`
        params.qs = qs
        params.assayId = `assayId=${this.params.data.assayId}`
      }
      this.$nuxt.$emit(this.params.dataAction, params)
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-grid-inline{
    padding:4px 8px;
  }
</style>
