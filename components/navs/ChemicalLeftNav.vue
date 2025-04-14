<template>
  <mdb-navbar
    v-if="getUiReady()"
    id="comptox-details-nav-bar"
    :data-cy="dataCy"
    tag="div"
    expand="medium"
    toggler-icon=""
    animated
    animation="1"
    color="primary-color"
    class="lighten-2 py-0 px-0 mt-2 mr-rm"
    style="width: 120px;"
  >
    <mdb-navbar-toggler>
      <mdb-navbar-nav v-show="tabsComputed" nav vertical class="grey-text font-weight-bolder w-100 pl-2">
        <client-only>
          <template v-for="tab in tabsComputed">
            <nuxt-link
              v-if="tab.url && (!tab.disable) && tab.labelDisplay !== 'GenRA'"
              :key="tab.id"
              :to="buildUrl(tab.url)"
              class="nuxt-nav dropdown"
            >
              <mdb-nav-item class="leftNav" role="menuitem" data-cy="nav-dropdown-item">
                {{ tab.labelDisplay }}
              </mdb-nav-item>
            </nuxt-link>
            <a
              v-else-if="tab.url && (!tab.disable) && tab.labelDisplay === 'GenRA'"
              :key="tab.id"
              :href="buildUrl(tab.url)"
              target="_blank"
              class="nuxt-nav dropdown"
            >
              <mdb-nav-item class="leftNav" role="menuitem" data-cy="nav-dropdown-item">
                {{ tab.labelDisplay }}
              </mdb-nav-item>
            </a>
            <nuxt-link
              v-else-if="tab.url && (tab.disable)"
              :key="tab.key"
              :to="buildUrl(tab.url)"
              class="nuxt-nav dropdown tl-disabled"
            >
              <mdb-nav-item class="leftNav tl-disabled" role="menuitem" data-cy="nav-dropdown-item">
                {{ tab.labelDisplay }}
              </mdb-nav-item>
            </nuxt-link>
            <mdb-dropdown
              v-else-if="(tab.disable)"
              :key="tab.id"
              tag="li"
              :aria-label="tab.labelDisplay + '_'"
              class="nav-item tl-disabled"
            >
              <mdb-dropdown-toggle slot="toggle" tag="div" waves-fixed nav-link class="tl-disabled">
                {{ tab.labelDisplay }}
              </mdb-dropdown-toggle>
              <mdb-dropdown-menu>
                <mdb-dropdown-item
                  v-for="child in tab.subTabs"
                  :key="child.id"
                  :aria-label="child.labelDisplay"
                  role="menuitem"
                >
                  <nuxt-link
                    v-if="child.disable == 'f' || !child.disable"
                    :key="child.id"
                    :to="buildUrl(child.url)"
                    class="nuxt-nav dropdown"
                  >
                    <span class="navlinktext"> {{ child.labelDisplay }} </span>
                  </nuxt-link>
                  <nuxt-link
                    v-else-if="child.disable"
                    :key="child.id"
                    :to="buildUrl(child.url)"
                    class="nuxt-nav dropdown disabled2"
                  >
                    <span class="navlinktext"> {{ child.labelDisplay }} </span>
                  </nuxt-link>
                  <a v-else :href="buildUrl(child.url)" target="blank">
                    <span class="navlinktext"> {{ child.labelDisplay }} </span>
                  </a>
                </mdb-dropdown-item>
              </mdb-dropdown-menu>
            </mdb-dropdown>
            <mdb-dropdown v-else :key="tab.id" tag="li" :aria-label="tab.labelDisplay + '_'" class="nav-item">
              <mdb-dropdown-toggle slot="toggle" tag="a" waves-fixed nav-link>
                {{ tab.displayLabel || tab.labelDisplay }}
              </mdb-dropdown-toggle>
              <mdb-dropdown-menu>
                <template v-for="child in tab.subTabs">
                  <mdb-dropdown-item
                    v-if="child.disable == 'f' || !child.disable"
                    :key="child.id"
                    :aria-label="child.labelDisplay"
                    role="menuitem"
                    data-cy="nav-dropdown-item"
                  >
                    <nuxt-link :key="child.id" :to="buildUrl(child.url)" class="nuxt-nav dropdown">
                      <span class="navlinktext"> {{ child.labelDisplay }} </span>
                    </nuxt-link>
                  </mdb-dropdown-item>
                  <mdb-dropdown-item
                    v-else-if="child.disable"
                    :key="child.id || child.labelDisplay"
                    :aria-label="child.labelDisplay"
                    role="menuitem"
                    data-cy="nav-dropdown-item"
                    class="disabled"
                  >
                    <nuxt-link :key="child.labelDisplay" :to="buildUrl(child.url)" class="nuxt-nav dropdown disabled2">
                      <span class="navlinktext"> {{ child.labelDisplay }} </span>
                    </nuxt-link>
                  </mdb-dropdown-item>
                  <mdb-dropdown-item v-else :key="child.id" :aria-label="child.labelDisplay" role="menuitem" data-cy="nav-dropdown-item">
                    <a :href="buildUrl(child.url)" target="blank">
                      <span class="navlinktext"> {{ child.labelDisplay }} </span>
                    </a>
                  </mdb-dropdown-item>
                </template>
              </mdb-dropdown-menu>
            </mdb-dropdown>
          </template>
        </client-only>
      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
</template>

<script>
import {
  mapGetters, mapActions,
} from 'vuex';
import {
  mdbNavbar,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbNavItem,
  mdbDropdown,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbDropdownItem,
  waves,
} from 'mdbvue';

export default {
  name: 'ChemLeftNav',
  components: {
    mdbNavbar,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbDropdownItem,
    mdbNavItem,
  },
  mixins: [waves],
  props: {
    disabledTabData: {
      type: Object,
      default() {
        return {
          similarCount: {
            similarCompounds: null,
            tanimoto: 0.8,
          },
          connectivity: [],
          relatedCount: 0,
        };
      },
    },
  },
  data() {
    return {
      collapsed: false,
      dataCy: 'comptox-details-nav-bar',
      listId: 'default',
      qs: '',
      useFixture: false,
      uiControlled: ['similar-molecules', 'genra'],
    };
  },
  computed: {
    ...mapGetters({
      getTabs: 'tabs/getTabs',
      getError: 'tabs/getError',
      getChemical: 'results/getActive',
      getUiReady: 'results/getUiReady',
    }),
    tabsComputed() {
      const displayTabs = this.getTabs;
      if (!this.useFixture) {
        displayTabs.forEach((item) => {
          if (item.hasOwnProperty('subTabs')) {
            const totalSubTabs = item.subTabs.length;
            let disabledSubtabs = 0;
            item.subTabs.forEach((el, idx) => {
              if (el.disable === true) {
                disabledSubtabs += 1;
                item.disable = disabledSubtabs === totalSubTabs;
              }
              if (el.labelDisplay === 'ToxCast: Summary' && el.disable === true) {
                this.$store.dispatch('executiveSummary/actToxcastVisibility', false);
              }
              if (el.labelDisplay === 'ToxCast/Tox21') {
                item.subTabs.splice(idx, 1);
              }
              if (el.labelDisplay === 'EDSP21') {
                el.labelDisplay = 'Conc. Response Data';
                el.url = 'chemical/concentration-response-data';
              }
              if (this.uiControlled.includes(el.label) && this.disabledTabData.similarCount === 0) {
                el.disable = true;
              } else if (this.uiControlled.includes(el.label) && this.disabledTabData.similarCount > 0) {
                el.disable = false;
              }
            });
          } else if (this.uiControlled.includes(item.label) && this.disabledTabData.similarCount === 0) {
            item.disable = true;
          } else if (this.uiControlled.includes(item.label) && this.disabledTabData.similarCount > 0) {
            item.disable = false;
          }
        });
        this.actLeftNavReady(true);
        return displayTabs;
      }
      return [];
    },
  },
  mounted() {
    const tabsLoaded = this.tabsComputed;
    if (this.getError) {
      this.dataCy = 'comptox-details-nav-bar-error';
      this.$notify.error({
        message: this.getError,
        position: 'top right',
        timeOut: 20000,
      });
    }
  },
  methods: {
    ...mapActions({
      actLeftNavReady: 'results/actLeftNavReady',
    }),
    toggleSlim() {
      this.collapsed = !this.collapsed;
    },
    buildUrl(path) {
      if (path === 'chemical/genra') {
        const chemical = this.getChemical();
        return `${process.env.APPLICATION_GENRA_URL}/${chemical.dtxcid}`;
      }
      if (this.$route.query.list) {
        return `/${path}/${this.$route.params.id}?list=${this.$route.query.list}`;
      }
      return `/${path}/${this.$route.params.id}`;
    },
  },
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

nav {
  z-index: 60;
  .animated-icon1 {
    span {
      background: #ffffff !important;
    }
  }
  a {
    white-space: nowrap !important;
  }
}
li.nav-item {
  margin-left: 0rem !important;
}
.nuxt-link-active {
  background-color: $blue-darken-4 !important;

  li {
    background-color: $blue-darken-4 !important;
  }
  span.navlinktext {
    color: white !important;

  }
}
.disabled2 {
  color: lightgrey !important;
  pointer-events: none !important;
  background-color: $gray-400 !important;
  cursor: none !important;
}
.tl-disabled,
.tl-disabled:hover,
.tl-disabled:active {
  color: lightgrey !important;
  pointer-events: none !important;
  background-color: $gray-400 !important;
  cursor: none !important;
}
div.dropdown-menu.show {
  padding: 0px !important;
  width: 13rem;
  border: thin double #0e6993 !important;
}
.dropdown .dropdown-menu .dropdown-item:active,
.dropdown .dropdown-menu .dropdown-item:hover {
  background-color: $blue-lighten-4 !important;
}
.dropdown-item .dropdown-form:active,
.dropdown-item .dropdown-form:hover {
  background-color: #fff !important;
  border: thin double #0e6993 !important;
}
.leftNav,
.nav-item {
  background-color: $blue-lighten-2;
}
.nav-item:hover {
  background-color: $blue-lighten-3 !important;
}
.md-tabs .nav-link,
.navbar .dropdown-menu a {
  color: #000 !important;
  display: block;
  width: 100% !important;
  padding: 3px !important;
}
a {
  color: #0e6993 !important;
}
.nav-link,
.menu-item a,
footer.main-footer a {
  color: #fff !important;
}
.navbar-collapse {
  margin-right: -16px;
}
dropdown-toggle:hover {
  background-color: $blue-lighten-3 !important;
}
a a.close:not([href]):not([tabindex]),
a.close:not([href]):not([tabindex]):focus,
a.close:not([href]):not([tabindex]):hover {
  display: block;
  width: 190px !important;
  color: snow !important;
}
a.nuxt-nav .dropdown .disabled:hover,
a.nuxt-nav .dropdown .disabled:focus,
a.nuxt-nav .dropdown .disabled:active {
  background-color: $gray-500;
  cursor: none;
}
.dropdown-toggle::after {
  display: inline-block;
  margin-left: .255em;
  vertical-align: middle !important;
  padding-top: .5em !important;
  float: right !important;
}
.close {
  color: snow !important;
}
.comptox-side-nav {
  position: absolute;
  right: 0px;
  top: 150px;
  background-color: $blue-darken-4 !important;
  color: #fff;
}
</style>
