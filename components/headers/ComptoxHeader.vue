<template>
  <mdb-container ref="comptoxHeader" class="pl-0 pr-0" :tabindex="0" fluid>
    <mdb-navbar
      id="comptox-nav-bar"
      data-cy="comptox-nav-bar"
      class="primary-color"
      toggler-icon=""
      animated
      animation="1"
      dark
    >
      <mdb-navbar-brand ref="navbar" data-cy="navbar-brand" class="pageTitle med-width white-text mr-4 gt-lrg">
        <nuxt-link
          data-cy="brand-link"
          to="/"
          title="Home Page Link"
          class="text-white"
        >
          {{ applicationTitle }}
        </nuxt-link>
        <a
          data-cy="brand-version-link"
          class="white-text"
          title="link to Comptox Dashboard release notes"
          href="https://www.epa.gov/chemical-research/comptox-chemicals-dashboard-release-notes"
          alt="link to Comptox Dashboard release notes"
          target="_blank"
        >
          <span class="h5 text-white">{{ version }}</span>
        </a>
      </mdb-navbar-brand>
      <mdb-navbar-toggler>
        <NavLinks />
        <mdb-navbar-nav class="default-color pr-5" right>
          <button
            data-cy="feedbackButton"
            class="commentsBtn mr-5 default-color white-text mainNav submitCommentsBtn nuxt-nav"
            :selected="selected"
            @click="showHideFeedback"
          >
            Submit Comments
          </button>
        </mdb-navbar-nav>
        <share-links />
        <mdb-navbar-nav right>
          <header-search-box
            v-if="!homePage"
            ref="headerSearchBox"
            :cname="headerSearchCname"
            :placeholder="searchPlaceholder"
            data-cy="header-search-input"
            :search-index="30"
          />
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>

    <div class="row" style="background-color:#f5f5f5; width: 100%;margin:0">
      <div class="col-12 text-center" style="padding-top:5px;margin-bottom:0px; display: none;">
        <!-- <header-headline /> -->
      </div>
    </div>

    <comments
      :visibility="showFeedback"
      :selected="selected"
      @toggleVisibility="showHideFeedback"
    />
  </mdb-container>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';

import {
  mdbNavbar,
  mdbNavbarBrand,
  mdbNavbarToggler,
  mdbNavbarNav,
  mdbContainer,
} from 'mdbvue';

import NavLinks from '@/components/headers/NavLinks.vue';
import ShareLinks from '@/components/headers/ShareLinks.vue';
import HeaderSearchBox from '~/components/homepageSearch/HeaderSearchBox.vue';
import comments from '../comments.vue';

export default {
  name: 'ComptoxHeader',
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarToggler,
    mdbNavbarNav,
    NavLinks,
    mdbContainer,
    HeaderSearchBox,
    ShareLinks,
    comments,
  },
  props: {
    homePage: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      applicationTitle: process.env.APPLICATION_TITLE,
      headerSearchCname: 'globalSearch',
      searchPlaceholder: 'Search all data',
      verifiedMessage: null,
      showFeedback: false,
      headerNews: false,
      selected: {},
      version: '',
    };
  },
  async created() {
    try {
      const versionInfo = await this.$store.$repositories.totalChemicalCount.getVersion();
      this.version = `v${versionInfo._embedded.ReleaseInfo[0].releaseVersion}`;
    } catch (e) {
      this.$sentry.captureMessage(`Couldn't get version info from this.$store.$repositories.totalChemicalCount.getVersion(): error :  ${e}`);
      this.version = 'v2.4';
    }
  },
  mounted() {
    this.applicationTitle = process.env.APPLICATION_TITLE;
    this.focusNav();
  },
  methods: {
    focusNav() {
      this.$refs.navbar.$el.focus();
    },
    togglePane(paneName) {
      this[paneName] = !this[paneName];
    },
    findElemPos(obj) {
      let curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while (obj == obj.offsetParent);
        return [curtop];
      }
      return true;
    },
    showHideFeedback() {
      this.selected.text = window.getSelection().toString();
      if (this.showFeedback === false) {
        this.showFeedback = true;
      } else {
        this.showFeedback = false;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@media (min-width: 1280px) {
    .gt-lrg {
        display: block;
        margin-right: 5px;
    }
}
@media (max-width: 1279px) {
    .gt-lrg {
         display: none;
    }

    .gt-lrg-rm {
         display: none;
    }
}
a.nuxt-nav:hover {
  background-color: #1079A8 !important;
}
.nuxt-nav:hover {
  background-color: #1079A8 !important;
}
a.nuxt-link-active {
  border: none;
  color: transparent;
  border-color: transparent;
}
.navbar {
  margin-top: 0px;
  height: 3em !important;
}
.navbar-main {
  margin-top: 0px;
  height: 3em !important;
}
.navbar-nav {
  margin-left: -18px !important;
}
// a:hover {
//   background-color: #1079A8 !important;
// }
button.mainNav {
  border: none !important;
}
button.mainNav:hover {
  border: none !important;
  background-color: #1079A8 !important;
}
.commentsBtn{
  font-weight: 100 !important;
  // padding: 10px 8px;
}
.submitCommentsBtn {
  font-size: 16px;
  line-height: 24px;
  text-wrap: none;
  margin-left: 10px !important;
  margin-right: 10px !important;
}
</style>
