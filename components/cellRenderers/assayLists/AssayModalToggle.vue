<template>
  <div>
    <button type="button" class="btn btn-outline btn-grid-inline" @click="clickDetails">
      <i class="fas fa-file-alt" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'AssayModalToggle',
  computed: {
    display() {
      const data = this.params.value
      return data
    },
  },
  methods: {
    clickDetails() {
      this.params.context.componentParent.detailsClicked(this.params.data)
    },
  },
}
</script>
<style lang="scss" scoped>
.btn-grid-inline{
    padding:4px 8px;
  }
</style>
