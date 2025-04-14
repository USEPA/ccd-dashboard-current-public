<template>
  <span>
    <span class="wrappedText">{{ display }}</span>
  </span>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'WrappedText',
  computed: {
    display() {
      const r = this.params.value
      return r
    },
  },
}
</script>

<style scoped lang="scss">
@import "~/assets/styles/_custom-variables.scss";

.wrappedText {
    line-height: 18px !important;
    white-space: normal;
  // margin: auto;
}
</style>
