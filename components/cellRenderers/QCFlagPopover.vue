<template>
  <span>
    <mdb-popover v-if="flagKey" :append-to-body="true" size="sm" trigger="hover" :options="{placement: 'bottom'}">
      <span slot="body" v-html="flagKey" />
      <span slot="reference" class="align-content-start  popoverLabel" v-html="display" />
    </mdb-popover>
    <span v-if="!flagKey">{{ display }}</span>
  </span>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import {
  mdbPopover,
} from 'mdbvue'

export default {
  name: 'QcFlagPopover',
  components: {
    mdbPopover,
  },
  data() {
    return {
      icon: 'info-circle',
    }
  },
  computed: {
    flagKey() {
      if (this.params.value) {
        const flags = (this.params.value || '').split(', ')
        const flagDefs = (this.params.data.flagDescription || '').split(' | ')
        const str = []
        for (let i = 0; i < flags.length; i += 1) {
          str.push(`<div><b>${flags[i]}</b> = ${flagDefs[i]}</div>`)
        }
        return str.join('')
      }
      return false
    },
    display() {
      return this.params.value || '-'
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
