<template>
  <div class="container-fluid left-fullwidth-container content" />
</template>

<script>
export default {
  created() {
    return this.$nuxt.error({statusCode: 404, message: 'page not found'})
  },
}
</script>
