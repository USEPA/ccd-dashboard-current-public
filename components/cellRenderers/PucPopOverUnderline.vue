<template>
  <pop-over-underline-layout :display="display" :pop-text="popText" pop-text-placement="top" />
</template>

<script>
import PopOverUnderlineLayout from './PopOverUnderlineLayout.vue';

export default {
  name: 'PucPopOverUnderline',
  components: {
    PopOverUnderlineLayout,
  },
  computed: {
    popText() {
      return this.params.data[this.params.popField];
    },
    display() {
      const urlEncKeyword = encodeURIComponent(this.params.data.displayPuc);
      return (this.params.data.displayPuc === 'Not yet Categorized') ? `<div>${this.params.data.displayPuc}</div>` :
        `<a target="_blank" href='/dashboard/search-results?input_type=puc&inputs=${urlEncKeyword}'>${this.params.data.displayPuc}</a>`;
    },
  },
};
</script>
