<template>
  <span>
    <mdb-popover v-if="popText" :append-to-body="true" size="sm" trigger="hover" :options="{placement: 'bottom'}">
      <span slot="body" v-html="popText" />
      <span slot="reference" class="align-content-start  popoverLabel" v-html="display" />
    </mdb-popover>
    <span v-if="!popText">{{ display }}</span>
  </span>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import {
  mdbPopover,
} from 'mdbvue'

export default {
  name: 'GridPopover',
  components: {
    mdbPopover,
  },
  data() {
    return {
      icon: 'info-circle',
    }
  },
  computed: {
    popText() {
      if (this.params.data[this.params.popField] == null) {
        return ''
      }

      let p = this.params.data[this.params.popField]
      if (this.params.popField === 'preferredName') {
        p = this.params.data[this.params.popField].replace(/~(\d+)~/g, '<sup>$1</sup>')
        // .replace(/_(\d+)_/g, '<sub>$1</sub>')
      }
      return p
    },
    display() {
      let r = this.params.value || '-'
      if (this.params.popField === 'preferredName') {
        if (this.params.data[this.params.popField] == null) { return '' }
        r = this.params.data[this.params.popField].replace(/~(\d+)~/g, '<sup>$1</sup>')
        // .replace(/_(\d+)_/g, '<sub>$1</sub>')
      }
      return r
    },

  },
}
</script>

<style scoped lang="scss">
@import "~/assets/styles/_custom-variables.scss";

.widen {
  max-width: 500px !important;
}

.popoverLabel {
  width:fit-content;
  border-bottom:1px dashed;
  cursor: help;
  // margin: auto;
}


</style>
