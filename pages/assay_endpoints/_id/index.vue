<template>
  <mdb-container />
</template>

<script>

export default {
  name: 'AssayEndpointRedirect',
  data() {
    return {
      id: this.$route.params.id,
    }
  },
  created() {
    this.$router.push({path: `/assay-endpoints/${this.id}`})
  },
}
</script>
