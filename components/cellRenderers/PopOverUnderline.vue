<template>
  <pop-over-underline-layout
    :display="display"
    :is-link="isLink"
    :pop-text="popText"
    :pop-text-placement="popTextPlacement"
  />
</template>

<script>
import PopOverUnderlineLayout from './PopOverUnderlineLayout.vue';

export default {
  name: 'PopOverUnderline',
  components: {
    PopOverUnderlineLayout,
  },
  computed: {
    popText() {
      return this.params.data[this.params.popField];
    },
    popTextPlacement() {
      return this.params.popTextPlacement || 'right';
    },
    display() {
      return this.params.value;
    },
    isLink() {
      return this.params.value && this.params.value.trim().startsWith('https://');
    },
  },
};
</script>
