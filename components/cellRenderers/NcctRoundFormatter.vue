<template>
  <span>{{ display }}</span>
</template>

<script>

export default {
  name: 'RoundFormat',
  computed: {
    display() {
      let r = ''
      if (this.params.value) {
        r = this.ncctRound2(this.params.value)
      }
      return r
    },
  },
}
</script>
