<template>
  <div class="container pt-5 pl-5">
    <div v-if="chemId.length > 0">
      <h1>No results found for {{ chemId }}</h1>
      <p class="h3 blue-text">
        Please try a search from the <NuxtLink title="Home Page" to="/">Home page</NuxtLink>
      </p>
    </div>
    <div v-else-if="error.statusCode === 404">
      <h1>Page not found</h1>      
    </div>

    <div v-else class="container">
      <h1>An error occurred</h1>
      Error <br>
      statusCode: {{ error.statusCode }}<br>
      message: {{ error.message }}
    </div>
    <div>
      <h1>Useful links for the Comptox Chemicals Dashboard</h1>
      <p class="h3 blue-text">
        Our <NuxtLink title="Home Page" to="/">Home Page</NuxtLink> has searches for chemicals, product and use categories, assays and genes.
      </p>
      <p class="h3 blue-text">
        You can access our <NuxtLink title="Chemical lists" to="/chemical-lists">Chemical Lists</NuxtLink> to view specific EPA  chemical lists and view the chemicals in those lists.
      </p>
      <p class="h3 blue-text">
        You can see our <NuxtLink title="Assay Endpoints" to="/assay-endpoints">Assay Endpoints</NuxtLink> and access details of specific assays with a single click.
      </p>
      <p class="h3 blue-text">
        Our <NuxtLink title="Advanced Search" to="/advanced-search">Advanced Search</NuxtLink> page allows you to search on mass, molecular formula, or to generate molecular formulae for searching.
      </p>
      <p class="h3 blue-text">
        The <NuxtLink title="Batch Search" to="/batch-search">Batch Search</NuxtLink> page allows you to enter a list of mixed chemical identifiers  and use the results of the search to generate advanced reports that are downloadable in multiple file types.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  data() {
    return {
      chemId: '',
    }
  },
  mounted() {
    if (this.$route.query.chemId) {
      this.chemId = this.$route.query.chemId
    }
  },
}
</script>
