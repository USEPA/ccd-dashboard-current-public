<template>
  <div />
</template>

<script>

export default {
  name: 'ContactUsRedirect',
  data() {
    return {
      id: '',
    }
  },
  created() {
    this.$router.push({path: this.createRedirectUrl()})
  },
  methods: {
    createRedirectUrl()  {
      return '/feedback'
    },
  },
}
</script>
