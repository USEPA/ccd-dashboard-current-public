<template>
  <div class="rowFlag">
    <div>{{ display }}</div>
  </div>
</template>

<script>
export default {
  name: 'RenderLabel',
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
  width: 90%;
  height: auto;
  font-size: .80rem;
  font-weight: 500;
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
