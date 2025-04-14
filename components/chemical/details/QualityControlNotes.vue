<template>
  <mdb-container class="p-0 m-0">
    <template v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </template>
    <template v-if="qcNotes.length > 1">
      <p class="ml-3">
        <span class="qcNotes" v-html="qcNotes" />
      </p>
    </template>
    <template v-else>
      <p>No Quality Control notes</p>
    </template>
  </mdb-container>
</template>

<script>
import { mdbContainer } from 'mdbvue'

export default {
  name: 'QualityControlNotes',
  components: {
    mdbContainer,
  },
  props: ['qcNotes'],
  data() {
    return {
      loading: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.qcNotes {
  width: 100%;
  height: 3rem;
  text-align: left;
  padding-left: 0px;
  margin-left: 0px;
}
</style>


