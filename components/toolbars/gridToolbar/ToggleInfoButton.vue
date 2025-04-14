<template>
  <mdb-tooltip trigger="hover" :options="{placement: 'top'}">
    <span slot="tip">{{ tipText }}</span>
    <mdb-btn
      slot="reference"
      size="sm"
      class="blue lighten-1 m-0"
      data-cy="copyUrlBtn"
      @click.native="toggleInfo"
    >
      Tile Details
    </mdb-btn>
  </mdb-tooltip>
</template>

<script>
import {
  mdbIcon, mdbBtn, mdbTooltip,
} from 'mdbvue'

export default {
  name: 'GridCopyUrlButton',
  components: {

    mdbBtn,
    mdbTooltip,
  },
  props: {
    tipText: {
      type: String,
      default: 'Toggle',
    },
    cname: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      btnIcon: 'th',
    }
  },
  methods: {
    toggleInfo() {
      this.btnIcon = (this.btnIcon === 'th') ? 'table' : 'th'
      this.$emit('doToggle')
    },
  },
}
</script>
