<template>
  <b-button-group>
    <b-button
      v-for="item in state"
      :key="item.value"
      variant="light"
      :size="size"
      class="p-1"
      @click="onClick(item.value)"
    >
      <b-icon
        :icon="getIconName(item)"
        :variant="getVariant(item)"
      />
      {{ item.text }} {{ getCount(item) }}
    </b-button>
    <b-button
      variant="outline-dark"
      @click="onReset()"
    >
      Reset
    </b-button>
  </b-button-group>
</template>

<script>
/* eslint-disable consistent-return */
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
    },
  },

  data() {
    return {
      state: this.value,
    }
  },

  methods: {
    getCount(item) {
      if (!item.count) { return null }
      return `(${item.count})`
    },

    getIconName(item) {
      if (item.state === true) { return 'check-circle' }
      if (item.state === false) { return 'x-circle' }
      if (item.state === null) { return 'circle' }
    },

    getVariant(item) {
      if (item.state === true) { return 'outline-success' }
      if (item.state === false) { return 'outline-danger' }
      if (item.state === null) { return 'outline-dark' }
    },

    onClick(id) {
      const item = this.state.find(v => v.value === id)
      if (item) {
        // eslint-disable-next-line default-case
        switch (item.state) {
        case true:
          item.state = item.next ? false : null
          break
        case false:
          item.state = item.next ? null : true
          break
        case null:
          item.state = !!item.next
          break
        }
      }

      this.$emit('input', [...this.state])
    },

    onReset() {
      // eslint-disable-next-line no-return-assign
      this.state.forEach(item => item.state = null)
      this.$emit('input', [...this.state])
    },
  },
}
</script>

<style scoped>
.true-state {
    font-weight: bold;
    color: black;
}

.false-state {
    font-weight: normal;
    color: black;
}

.null-state {
    font-weight: normal;
    color: grey;
}
</style>
