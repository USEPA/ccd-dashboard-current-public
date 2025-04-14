<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text list-toolbar-search-icon">
        <mdbIcon icon="search" class="text-white" />
      </span>
    </div>
    <input
      v-model="input"
      type="text"
      class="form-control list-toolbar-search"
      :placeholder="`Search ${cname}`"
      :aria-label="`${cname}Search`"
      :data-cy="`${cname}SearchInput`"
      @keyup="emitUpdatedInput"
    >
  </div>
</template>

<script>
import {mdbIcon} from 'mdbvue'

export default {
  name: 'ListSearchBox',
  components: {
    mdbIcon,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
    }
  },
  methods: {
    emitUpdatedInput() {
      this.$emit('onFilter', this.input)
    },
  },
}
</script>

<style lang="scss">
.list-toolbar-search-icon {
  height: 2rem;
  font-size: 0.8rem;
  padding: .625rem;
  background-color: #0e6993 !important;
}

.list-toolbar-search {
  height: 2rem;
  font-size: 0.8rem;
}
</style>

