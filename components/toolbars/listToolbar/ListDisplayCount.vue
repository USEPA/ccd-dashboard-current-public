<template>
  <div class="d-flex align-items-center list-toolbar-count" :data-cy="`${cname}DisplayCount`">
    Displaying <span :data-cy="`${cname}FilteredCount`" class="px-1">{{ filteredCount }}</span>
    of <span :data-cy="`${cname}TotalCount`" class="px-1">{{ totalCount }}</span> {{ cname }}
  </div>
</template>

<script>
export default {
  name: 'ListDisplayCount',
  props: {
    cname: {
      type: String,
      default: '',
    },
    filteredCount: {
      type: Number,
      default: 0,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>
.list-toolbar-count {
  font-size: 0.8rem;
}
</style>
