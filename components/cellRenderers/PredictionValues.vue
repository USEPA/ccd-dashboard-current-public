<template>
  <div>
    <div v-if="display === 'text'" style="display: block;">
      <div
        v-for="(val, idx) in valueArray"
        :key="idx"
      >
        <span style="display: block; marginTop: 2px;">{{ val }}</span>
      </div>
    </div>
    <div v-else-if="display === 'link'">
      <div
        v-for="(val, idx) in linkArray"
        :key="idx"
      >
        <a
          v-if="params.value"
          :href="link"
          target="_blank"
        >
          {{ val }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */

export default {
  name: 'PredictionValues',
  data() {
    return {
      icon: 'info-circle',
    }
  },
  computed: {
    display() {
      return this.params.displayType
    },
    link() {
      if (this.params.displayType === 'link') {
        return this.params.value.link
      }
      return false
    },
    linkArray() {
      if (this.params.displayType === 'link') {
      // eslint-disable-next-line no-eval
        const arr = []
        if (this.params.value.name) {
          const newVal = this.params.value.name.toString()
          if (newVal === 'true' || newVal === 'false') {
            arr.push(newVal)
            return arr
          }
          if (this.params.value.name.length > 0 && this.params.value.name.length !== 'undefined') {
            if (this.params.value.name.includes(' ')) {
              const base = this.params.value.name.split(') ')
              if (base.length > 1) {
                arr.push(`${base[0]})`)
                arr.push(base[1])
                return arr
              }
              arr.push(base[0])
              return arr
            }
          } else {
            arr.push(this.params.value.name)
            return arr
          }
        }
        return [this.params.value.name]
      }
      return []
    },
    // eslint-disable-next-line vue/return-in-computed-property
    valueArray() {
      if (this.params.displayType === 'text') {
      // eslint-disable-next-line no-eval
        const arr = []
        const newVal = this.params.value.toString()
        if (newVal === 'true' || newVal === 'false') {
          arr.push(newVal)
          return arr
        }
        if (this.params.value.length > 0 && this.params.value.length !== 'undefined') {
          if (this.params.value.includes(' ')) {
            const base = this.params.value.split(') ')
            if (base.length > 1) {
              arr.push(`${base[0]})`)
              arr.push(base[1])
              return arr
            }
            arr.push(base[0])
            return arr
          }
        } else {
          arr.push(this.params.value)
          return arr
        }
        return '[this.params.value]'
      }
      return []
    },
  },
}
</script>

<style scoped lang="scss">
.widen {
  max-width: 300px !important;
}
.valueLabel {
  width:fit-content;
  border-bottom:1px dashed;
  cursor: help;
  // margin: auto;
}
</style>
