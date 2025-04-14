<template>
  <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
    <span slot="tip">{{ tipText }}</span>
    <copy-text slot="reference" :tip-text="tipText" :to-copy="copyText" :copy-type="copyType" />
  </mdb-tooltip>
</template>

<script>
import {
  mdbTooltip,
} from 'mdbvue'

export default {
  name: 'GridCopyUrlButton',
  components: {
    mdbTooltip,
  },
  props: {
    tipText: {
      type: String,
      default: 'Copy Url',
    },
    copyType: {
      type: String,
      default: 'gridbutton',
    },
    copyText: {
      type: String,
      default: 'Copy Url',
    },
    cname: {
      type: Object,
      default: null,
    },
  },
  methods: {
    emitCopy() {
      console.log('onCopy')
      // this.$emit('onCopy')
    },
  },
}
</script>
