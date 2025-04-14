<template>
  <span>
    <mdb-popover v-if="popText" :append-to-body="true" size="sm" trigger="hover" :options="getPlacement">
      <span slot="body" v-html="popText" />
      <span v-if="isBatch" slot="reference" class="popoverLabel">
        {{ display }} &nbsp;
        <mdb-icon class="cyData" :icon="icon" />
      </span>
      <span v-if="!isBatch" slot="reference" class="d-flex align-content-start flex-wrap popoverLabel">
        {{ display }} &nbsp;
        <mdb-icon class="cyData" :icon="icon" />
      </span>
    </mdb-popover>
    <span v-if="!popText">{{ display }}</span>
  </span>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import {
  mdbPopover, mdbIcon,
} from 'mdbvue'

export default {
  name: 'GridPopover',
  components: {
    mdbPopover,
    mdbIcon,
  },
  data() {
    return {
      icon: 'info-circle',
    }
  },
  computed: {
    popText() {
      const p = this.params.data[this.params.popField] || ''
      return p
    },
    getPlacement() {
      if (this.params.isbatch) {
        return {placement: 'top'}
      }
      return {placement: 'right'}
    },
    display() {
      const r = this.params.value
      return r
    },
    isBatch() {
      const i = this.params.isbatch
      return i
    },


  },
  mounted() {},
}
</script>

<style scoped lang="scss">
@import "~/assets/styles/_custom-variables.scss";

.widen {
  max-width: 500px !important;
}

.popoverLabel {
  width:fit-content;
  text-decoration-line: underline;
  text-decoration-style: dashed;
  // margin: auto;
}

.fa-info-circle {
  color: $grey-darken-2 !important;
}
</style>
