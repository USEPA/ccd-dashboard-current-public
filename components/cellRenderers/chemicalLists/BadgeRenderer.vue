<template>
  <div class="rowFlag">
    <span class="badge bg-success">{{ display }}</span>
  </div>
</template>

<script>

export default {
  name: 'BadgeRenderer',
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
  width: 90%;
  height: auto;
  font-size: .80rem;
  white-space: normal;

  .badge{
    height: auto !important;
    margin-bottom: 5px !important;
    padding-top: 3px;
    width: 100%;

    span {
      text-align: center;
      word-wrap: normal;
      height: 100px;
      width: 100%;
      }
  }
}
</style>
