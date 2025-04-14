<template>
  <div class="container-fluid ml-0 mr-0 pr-0 pl-0 content-chemical">
    <back-to-top />
    <epa-header />
    <comptox-header />
    <div v-if="chemComputed.preferredName || !chemComputed.preferredName" class="row content-chemical mr-0">
      <div class="col-sm-2 pr-0 pl-1" style="max-width: 230px;">
        <chemical-navbar-header />
      </div>
      <div class="col-sm-10 pl-1 pr-2">
        <chemical-header :error-msg="errorMsg" />
      </div>
    </div>
    <div v-if="chemComputed" class="row content-chemical mr-0">
      <div class="col-sm-2 pr-0 pt-2 pl-1 left-nav-wrapper" style="min-width: 175; max-width: 180px;">
        <client-only>
          <chem-left-nav v-if="chemComputed" :disabled-tab-data="chemComputed.similarData" />
        </client-only>
      </div>
      <div v-if="getUiReady()" class="col-sm-10 pt-0 mt-0 pl-0 ml-3 mr-1 main">
        <main class="template-container mt-0 content-chemical container-fluid">
          <nuxt />
        </main>
      </div>
      <div v-else class="d-flex justify-content-center mt-5 loading-spinner">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <epa-footer v-if="getUiReady()" />
  </div>
</template>
<script>
import Vue from 'vue'
import {
  mapGetters, mapMutations, mapState, mapActions,
} from 'vuex'
import {
  mdbIcon,
  waves,
  Notify,
} from 'mdbvue'
import ChemLeftNav from '@/components/navs/ChemicalLeftNav.vue'
import ChemicalHeader from '@/components/headers/ChemicalDetailsHeader.vue'
import ChemicalNavbarHeader from '@/components/headers/ChemicalLeftNavHeader.vue'
import ComptoxHeader from '@/components/headers/ComptoxHeader.vue'
import EpaHeader from '@/components/headers/EpaHeader.vue'
import EpaFooter from '@/components/footers/EpaFooter.vue'
import BackToTop from '@/components/BackToTop.vue'

Vue.use(Notify)

export default {
  name: 'ChemicalDetailsLayout',
  components: {
    ChemLeftNav,
    ChemicalHeader,
    ChemicalNavbarHeader,
    ComptoxHeader,
    EpaHeader,
    EpaFooter,
    BackToTop,
  },
  mixins: [waves],
  data() {
    return {
      toggle: false,
      chemical: false,
      errorMsg: '',
    }
  },
  computed: {
    ...mapGetters({
      getSingle: 'results/getSingle',
      getActive: 'results/getActive',
      getUiReady: 'results/getUiReady',
      getSearchedOn: 'searchedOn/getChemicalSearchedOn',
    }),
    chemAltComputed() {
      const chem = this.getFiltered(this.$route.params.id)
      return chem[0]
    },
    chemComputed() {
      return this.getActive()
    },
    searchedOn() {
      return this.$store.state.searchedOn.chemicalSearchedOnStr || this.$route.params.id
    },
    errorComputed() {
      return this.errorMsg
    },
  },
  created() {
    if (this.searchedOn.length > 5) {
      this.loadSearchedOn(this.searchedOn)
    }
    const str = this.$store.state.searchedOn.chemicalSearchedOnStr || this.$route.params.id
    this.actHeaderReady(true)
  },
  methods: {
    ...mapMutations({
      setChemicalImage: 'results/setChemicalImage',
      setModalVisibility: 'results/setModalVisibility',
    }),
    ...mapActions({
      actLeftNavReady: 'results/actLeftNavReady',
      loadSearchedOn: 'searchedOn/loadSearchedOn',
      actHeaderReady: 'results/actHeaderReady',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
  body {
     overflow-x: hidden;
  }
  .comptox-header{
      background-color: $blue-base;
      color:#fff;
    }
   .loading-spinner {
     position: absolute;
     top: 300px;
     width: 90%;
     height: 300px;
   } 
  .comptox-side-nav{
    position: absolute;
    right: 0px;
    top:150px;
      background-color:  $blue-darken-4 !important;
      color:#fff;
    }
    .navbar i {
      cursor: pointer;
      color: white;
    }
    .row {
      flex-wrap: nowrap;
      .content-chemical {
      margin-right: 0px !important;
      }
    }
    .content-chemical {
     // max-width: 98% !important;
      background-color: #fffafa;
      border: solid #fffafa;
      }
    .main {
      flex-wrap: nowrap;
      // max-width: 89% !important;
    }
    .col-10 {
      flex: 0 0 89% ;
     // max-width: 80% !important;
    }
    .flexible-content,
    .flexible-content .navbar {
      transition: margin-left 0.5s;
    }
    

  @media (min-width: 1600px) {
    .col-sm-10 {
      flex: 0 0 87.333333%;
      max-width: 90.333333%;
      }
  }
    @media (min-width: 900px) {
      .flexible-content {
        margin-left: 240px;
      }
      .flexible-content .navbar {
        margin-left: 240px;
        padding-left: 20px;
      }
    }
      @media (max-width: 1000px) {
      .left-nav-wrapper {
        display: none;
      }
    }
</style>
