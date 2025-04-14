<template>
  <product-type-ahead-search-box
    :cname="cname"
    :placeholder="placeholder"
  />
</template>

<script>
import ProductTypeAheadSearchBox from '~/components/homepageSearch/ProductTypeAheadSearchBox.vue'

export default {
  name: 'ProductSearch',
  components: {
    ProductTypeAheadSearchBox,
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
