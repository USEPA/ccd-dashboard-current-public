<template>
  <div>
    <p class="header">
      {{ header }}
    </p>
    <Sentence :phrases="data" :link-dtxsid="dtxsid" />
  </div>
</template>

<script>
import Sentence from './Sentence.vue';

export default {
  name: 'Qrav',
  components: {
    Sentence,
  },
  props: ['data', 'header', 'dtxsid'],
};
</script>
<style scoped>
.header {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 0;
}
</style>
