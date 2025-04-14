<template>
  <mdb-navbar-nav data-cy="navBar" class="navbarLinks" role="navigation" tabindex="0">
    <client-only>
      <template v-for="link in navLinks">
        <nuxt-link
          v-if="!link.hasDropdown && link.name !== 'Home'"
          :key="link.id"
          :to="link.url"
          :title="link.desc || link.name"
          :tabindex="link.tab_index"
          item-loc="!link.hasDropdown && link.name !"
          class="nuxt-nav default-color"
        >
          <mdb-nav-item class="mainNav" role="menuitem">
            {{ link.name }}
          </mdb-nav-item>
        </nuxt-link>
        <mdb-nav-item
          v-else-if="link.name == 'Home'"
          :key="`_${link.id}`"
          :title="link.desc"
          class="default-color white-text mainNav nuxt-nav"
        >
          <a
            data-cy="homeLink"
            :href="link.url"
            :title="link.desc"
            :tabindex="link.tab_index"
          >
            <span class="navlinktext white-text"> {{ link.name }} </span>
          </a>
        </mdb-nav-item>
        <mdb-dropdown
          v-else
          :key="link.name"
          :title="link.desc || link.name"
          tag="li"
          :aria-label="link.name + '_'"
          class="nav-item"
          data-cy="navDropdown"
          item-loc="dropdown"
        >
          <mdb-dropdown-toggle
            slot="toggle"
            tag="div"
            color="primary"
            :title="link.desc"
            :tabindex="link.tab_index"
            item-loc="mdb-dropdown-toggle"
            waves-fixed
            nav-link
            data-cy="navDropdownLink"
          >
            {{ link.name }}
          </mdb-dropdown-toggle>
          <mdb-dropdown-menu>
            <mdb-dropdown-item
              v-for="child in link.children"
              :key="child.name"
              tag="div"
              :title="child.desc || child.name"
              class="nav-item-wrapper"
              data-cy="menuItem"
              :aria-label="child.name"
              role="menuitem"
              item-loc="mdb-dropdown-item"
            >
              <nuxt-link
                v-if="! child.external"
                :key="child.url"
                :title="child.desc"
                :to="child.url"
                class="navlink"
                data-cy="navLink"
                :tabindex="child.tab_index + 1"
                item-loc="nuxt link inmdb-dropdown-item"
              >
                <span class="navlinktext"> {{ child.name }} </span>
              </nuxt-link>
              <a
                v-else
                class="navlink"
                data-cy="navLink"
                :href="child.url"
                :tabindex="child.tab_index + 1"
                :title="child.desc"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span class="navlinktext"> {{ child.name }} </span> <mdb-icon size="sm" class="pl-1 super" icon="external-link-alt" />
              </a>
            </mdb-dropdown-item>
          </mdb-dropdown-menu>
        </mdb-dropdown>
      </template>
    </client-only>
  </mdb-navbar-nav>
</template>

<script>
import {
  mdbIcon,
  mdbNavItem,
  mdbNavbarNav,
  mdbDropdown,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbDropdownItem,
} from 'mdbvue';

export default {
  name: 'NavLinks',
  components: {
    mdbIcon,
    mdbNavItem,
    mdbNavbarNav,
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbDropdownItem,
  },
  data() {
    return {
      test: 0,
      navLinks: [
        {
          name: 'Home',
          desc: 'Comptox Chemicals Dashboard home page',
          url: './',
          hasDropdown: false,
          tab_index: 0,
        },
        {
          name: 'Search',
          desc: 'Various types searches for chemicals',
          url: '',
          hasDropdown: true,
          tab_index: 1,
          children: [
            {
              name: 'Advanced Search',
              url: '/advanced-search',
              tab_index: 2,
            },
            {
              name: 'Batch Search',
              url: '/batch-search',
              tab_index: 3,
            },
            {
              name: 'Structure Search (BETA)',
              url: '/sss',
              tab_index: 4,
            },
          ],
        },
        {
          name: 'Lists',
          url: '',
          desc: 'Lists of chemicals and assays',
          hasDropdown: true,
          tab_index: 5,
          children: [
            {
              name: 'Lists of Chemicals',
              url: '/chemical-lists',
              tab_index: 6,
            },
            {
              name: 'List of Assays',
              url: '/assay-endpoints',
              tab_index: 7,
            },
          ],
        },
        {
          name: 'About',
          desc: 'Various Comptox Chemicals Dashboard resources',
          url: '',
          hasDropdown: true,
          tab_index: 8,
          children: [
            {
              external: true,
              name: 'About',
              desc: 'Information about the Comptox Dashboard (Opens in a new window)',
              url: 'https://www.epa.gov/comptox-tools/comptox-chemicals-dashboard-about',
              tab_index: 9,
            },
            {
              external: true,
              desc: 'See the latest Comptox Dashboard news (Opens in a new window )',
              name: 'News',
              url: 'https://www.epa.gov/comptox-tools/comptox-chemicals-dashboard-latest-news',
              tab_index: 10,
            },
            {
              external: true,
              desc: 'Comptox Dashboard help (Opens in a new window)',
              name: 'Help',
              url: 'https://www.epa.gov/comptox-tools/comptox-chemicals-dashboard-help',
              tab_index: 11,
            },
            {
              external: true,
              desc: 'Downloadable Computational Toxicology Data (Opens in a new window)',
              name: 'Downloads',
              url: 'https://www.epa.gov/comptox-tools/downloadable-computational-toxicology-data',
              tab_index: 12,
            },
            {
              name: 'Comments',
              url: '/comments',
              tab_index: 13,
            },
            {
              external: true,
              name: 'Release Notes',
              desc: 'Comptox Dashboard release notes (Opens in a new window)',
              url: 'https://www.epa.gov/comptox-tools/comptox-chemicals-dashboard-release-notes',
              tab_index: 14,
            },
          ],
        },
        {
          name: 'Tools',
          desc: 'Various chemistry-related applications',
          url: '',
          hasDropdown: true,
          tab_index: 15,
          children: [
            {
              name: 'GenRA',
              desc: 'The CCTE Generalized Read-Across tool',
              external: true,
              url: process.env.APPLICATION_GENRA_URL,
              tab_index: 16,
            },
            {
              name: 'Predictions',
              url: '/predictions',
              tab_index: 17,
            },
            {
              name: 'Abstract Sifter',
              desc: 'The online version of the Pubmed Abstract Sifter',
              url: '/chemical/pubmed-abstract-sifter/',
              tab_index: 18,
            },
          ],
        },
      ],
    };
  },
};
</script>
<style lang="scss">
.navbarLinks {
  a.nuxt-nav:hover a.nuxt-nav:focus {
    background-color: #1079A8 !important;
  }
  li.nav-item {
    @media (min-width: 992px) {
      margin-left: 1.9rem;
    }
    @media (min-width: 1200px) {
      margin-left: 2.9rem;
    }
  }
  .navbar .dropdown-menu .nav-item-wrapper {
    :focus {
      background-color: #1079A8 !important;
    }
    padding: 0;
  }
  .navbar .dropdown-menu .navlink {
    :focus {
      background-color: #1079A8 !important;
    }
    display: block;
    height: 3em;
    margin: 5px !important;
  }
  .navlinktext {
    margin-bottom: 10px;
  }
  .dropdown-item:focus
  {
  background: #0e6993 !important;
  }
}
.super {
vertical-align: super;
font-size: smaller;
}
</style>

