<template>
  <div>
    <template slot="body">
      <template v-if="wikiData.loading"> 
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </template>
      <template v-else="wikiData.summary.length > 0">
        <div class="card-body">
          <p
            class="card-text ml-3 wiki"
            data-cy="wikiText"
            v-html="wikiData.summary"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'WikipediaCollapse',
  props: ['auto-open', 'wikiData'],
  data() {
    return {
      ext: null,
    }
  },
}
</script>

<style lang="scss" scoped>
  .wiki {
    min-height: 5rem;
    height: fit-content;
    overflow: visible !important;
  }
</style>


