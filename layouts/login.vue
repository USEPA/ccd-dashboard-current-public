<template>
  <div>
    <main class="template-container">
      <nuxt />
    </main>
  </div>
</template>

<script>
import {polyfill} from 'es6-promise'
import 'es6-promise/auto'
import Vue from 'vue'
import {Notify} from 'mdbvue'


polyfill()
Vue.use(Notify)

export default {
  name: 'LoginLayout',
  components: {

  },
}
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
</style>
