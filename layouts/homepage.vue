<template>
  <mdb-container class="ml-0 mr-0 pr-0 pl-0" fluid>
    <back-to-top />
    <epa-header />
    <comptox-header :home-page="homePage" />
    <main class="template-container">
      <nuxt />
    </main>
    <epa-footer />
  </mdb-container>
</template>

<script>
import {polyfill} from 'es6-promise'
import 'es6-promise/auto'
import Vue from 'vue'
import {
  Notify, mdbContainer, mdbRow, mdbCol,
} from 'mdbvue'
import ComptoxHeader from '@/components/headers/ComptoxHeader.vue'
import EpaHeader from '@/components/headers/EpaHeader.vue'
import EpaFooter from '@/components/footers/EpaFooter.vue'
import BackToTop from '@/components/BackToTop.vue'

polyfill()
Vue.use(Notify)

export default {
  name: 'DefaultLayout',
  components: {
    mdbContainer,
    ComptoxHeader,
    EpaHeader,
    EpaFooter,
    BackToTop,
  },
  data() {
    return {
      homePage: true,
    }
  },
}
</script>

<style lang="scss">

</style>
