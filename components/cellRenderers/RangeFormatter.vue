<template>
  <span> {{ display }}</span>
</template>

<script>

export default {
  name: 'RangeFormat',
  computed: {
    display() {
      const data = this.params.value
      let r = '-'
      if (data) {
        if (Array.isArray(data) && data.length === 2) {
          const from = this.ncctRound(data[0])
          const to = this.ncctRound(data[1])

          if (from === to) {
            r = from
          } else {
            r = `${from} to ${to}`
          }
        }
      }
      return r
    },
  },
}
</script>
