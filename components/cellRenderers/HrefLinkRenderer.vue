<template>
  <div v-html="display" />
</template>

<script>
export default {
  name: 'HrefLinkRenderer',
  computed: {
    display() {
      const itm = this.params.value
      const newObj = {link: null,
        text: null}
      if (itm.includes('https://')) {
        return `<a href="${itm}" target="_blank" title="${itm}">${itm}</a>`
      }
      return `${itm} `
    },
  },
  methods: {
    startLoading() {
      this.$nuxt.$loading.start()
    },
  },
}
</script>
