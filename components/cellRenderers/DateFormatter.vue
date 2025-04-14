<template>
  <div> {{ dateFormat(new Date(display), 'MMMM dd, yyyy') }}</div>
</template>

<script>

export default {
  name: 'RenderDate',
  computed: {
    display() {
      const data = this.params.value;
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
