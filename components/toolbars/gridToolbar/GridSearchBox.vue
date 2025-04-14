<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text blue lighten-1 grid-toolbar-search-icon">
        <mdbIcon icon="search" class="text-white" />
      </span>
    </div>
    <input
      v-model="input"
      :placeholder="`Search ${cname.baseName}`"
      :aria-label="cname.camelName"
      :data-cy="`${cname.camelName}FilterQueryInput`"
      class="form-control grid-toolbar-search-input"
      @keyup="emitInput"
    >
  </div>
</template>

<script>
import {
  mdbIcon,
} from 'mdbvue'

export default {
  name: 'GridSearchBox',
  components: {
    mdbIcon,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    qsearch: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
    }
  },
  mounted() {
    if (this.qsearch.length > 0) {
      this.input = this.qsearch
    }
  },
  methods: {
    emitInput() {
      this.$emit('onFilter', this.input)
    },
  },
}
</script>
