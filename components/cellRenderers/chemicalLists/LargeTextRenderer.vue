<template>
  <div class="rowFlag">
    <div>{{ display }}</div>
  </div>
</template>

<script>

export default {
  name: 'LargeTextRenderer',
  computed: {
    display() {
      const data = this.params.value
      return data
    },
  },
}
</script>

<style lang="scss" scoped>
.rowFlag {
  display: block;
  margin:  2px !important;
  width: 95%;
  height: auto;
  font-size: .75rem;
  font-weight: normal;
  line-height:normal;
  white-space: normal;

    div {
      text-align: left;
      word-wrap: normal;
      height: 100%;
      width: 100%;
    }
  }
</style>
