<template>
  <pop-over-underline-layout :display="display" :pop-text="popText" pop-text-placement="top" />
</template>

<script>
import PopOverUnderlineLayout from './PopOverUnderlineLayout.vue'

export default {
  name: 'ExposureTimePopup',
  components: {
    PopOverUnderlineLayout,
  },
  computed: {
    popText() {
      return `Exposure Time ${this.params.data[this.params.popField]}`
    },
    display() {
      return this.params.data[this.params.popField]
    },
  },
}
</script>
