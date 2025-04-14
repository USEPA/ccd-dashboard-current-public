<template>
  <assay-type-ahead-search-box :cname="cname" :placeholder="placeholder" />
</template>

<script>
import AssayTypeAheadSearchBox from '~/components/homepageSearch/AssayTypeAheadSearchBox.vue'

export default {
  name: 'AssaySearch',
  components: {
    AssayTypeAheadSearchBox,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
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

