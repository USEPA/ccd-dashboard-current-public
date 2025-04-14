<template>
  <client-only>
    <div class="input-group nav-search-input-group" style="minWidth: 300px;">
      <v-select
        :ref="'searchField'"
        :filterable="false"
        :append-to-body="true"
        :clear-search-on-blur="({ clearSearchOnSelect, multiple }) => {
          _options = []
          return true
        }"
        :options="options"
        label="searchWord"
        :select-on-key-codes="[13, 9]"
        :map-keydown="handlers"
        data-cy="header-nav-search-input"
        class="form-control nav-search-input px-0 py-0"
        :placeholder="placeholder"
        :tabindex="searchIndex"
        @search="onSearch"
        @input="selectOption"
      >
        <template slot="no-options">
          <span> {{ noResultsMessage }} {{ searchMessage }}</span>
        </template>
        <template slot="option" slot-scope="option">
          <div class="font-weight-normal">
            <span class="h6">{{ option.searchWord }}</span>
            <br> <span v-if="option.dtxsid" class="font-italic font-weight-lighter h6">{{ option.dtxsid }}</span>
            <span v-else class="font-italic font-weight-lighter h6">{{ option.dtxcid }}</span>
          </div>
        </template>
        <template slot="selected-option" slot-scope="option">
          <div class="font-weight-normal">
            <span class="h6">{{ option.searchWord }}</span>
            <span class="font-italic font-weight-lighter h6">{{ option.dtxsid }}</span>
          </div>
        </template>
      </v-select>
      <div class="input-group-append">
        <span class="input-group-text blue nav-search-icon">
          <mdbIcon
            icon="search"
            class="text-white"
            size="md"
          />
        </span>
      </div>
      <div v-if="caffeine" class="container-fluid text-left">
        <div
          class="alert primary-color text-white"
          style="position:absolute;
        padding: 10px 10px 10px;
        top:40px;"
        >
          {{ caffeine }} <span
            v-for="word in caffeineArray"
            :key="word"
            :append-to-body="true"
            size="sm"
            trigger="hover"
            :options="{ placement: 'bottom' }"
          >
            <span>
              <a alt="search using auto suggested value" class="suggestions text-white text-decoration-underline font-weight-bolder ml-2" @click="updateSearch(word)"><u> {{ word }} </u></a>
            </span>
          </span>
        </div>
      </div>
      <!-- end caffeine-fix display -->
    </div>
  </client-only>
</template>

<script>
/* eslint-disable no-else-return */
import {mapActions} from 'vuex';

import {
  mdbIcon,
} from 'mdbvue';

import {debounce} from 'debounce';

export default {
  name: 'HomepageSearchBox',
  components: {
    mdbIcon,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search for chemical by systematic name, synonym, CAS number, DTXSID or InChIKey',
    },
    searchIndex: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      errorMessage: '',
      noError: false,
      searchMessage: 'Start typing to search.',
      noResultsMessage: null,
      caffeine: false,
      caffeineArray: [],
      typeAheadResult: false,
      options: [],
      tabIndex: -1,
    };
  },
  methods: {
    updateSearch(word) {
      this.$refs.searchField.$refs.search.focus();
      this.$nextTick(() => {
        this.$refs.searchField.$refs.search.value = word;
        this.$refs.searchField.search = word;
      });
    },
    onSearchBlur(e) {
      this.options = [];
      this.noResultsMessage = null;
    },
    ...mapActions({
      loadSearchedOn: 'searchedOn/loadSearchedOn',
    }),
    selectOption(chemical) {
      this.setSearchOnAndRoute(chemical, this);
    },
    onSearch(search, loading) {
      if (search.length > 2) {
        this.typeAheadResult = false;
        this.options = [];
        this.caffeine = false;
        this.caffeineArray = [];
        loading(true);
        this.search(loading, search, this);
      }
    },
    setSearchOnAndRoute(chemical, vm) {
      if (!chemical) { return; }
      const dtxid = chemical.dtxsid ? chemical.dtxsid : chemical.dtxcid;
      this.loadSearchedOn(chemical.searchMatch);
      vm.$router.push(`/chemical/details/${dtxid}`);
    },
    search: debounce((loading, search, vm) => {
      if (search.length < '2') {
        vm.typeAheadResult = false;
        vm.caffeine = false;
        vm.caffeineArray = [];
        loading(false);
        vm.options = [];
        // eslint-disable-next-line unicorn/prefer-includes
      } else if ((search.length > 2) && ((search.trim().toUpperCase().includes('DTXSID') && search.trim().length <= 8) || (search.trim().toUpperCase().includes('DTXCID') && search.trim().length <= 8))) {
        vm.options = [];
        loading(false);
      } else {
        vm.$repositories.chemicalSearch
          .startsWith(search, vm.searchWithinChemicalList, vm.$sentry)
          .then((results) => {
            if (!Array.isArray(results)) {
              results = JSON.parse(results);
              vm.caffeineArray = results.data.suggestions;
              vm.caffeine = `${results.data.detail} You might want to try ${
                vm.caffeineArray.length > 1 ? 'one of the following:' : ''
              } `;
              loading(false);
              vm.$refs.searchField.$refs.search.blur();
              return;
            }
            if (Array.isArray(results)) {
              vm.caffiene = false;
              vm.caffieneArray = [];
            }

            let orderedResult = results;
            if (results.length === 0) {
              vm.noResultsMessage = 'No results, please try again.';
            }
            vm.options = orderedResult;
            vm.typeAheadResult = true;
            loading(false);
          });
      }
    }, 3000),
    handlers: (map, vm) => ({
      ...map,
      13: (e) => {
        if (!vm.$parent.typeAheadResult) {
          e.preventDefault();
        }

        if (vm.$parent.overrideEnter) {
          vm.$parent.$emit('enter', {
            isSubstringSearch: vm.$parent.substringSearch,
            searchTerm: encodeURI(vm.search),
          });
          return;
        }
        if (vm.search.length === 2 && !vm.$parent.substringSearch) {
          vm.$repositories.chemicalSearch.matchesExactly(vm.search, vm.$sentry)
            .then((results) => {
              if (results.length === 1) {
                const chemical = results[0];
                vm.$parent.loadSearchedOn(chemical.searchMatch);
                vm.$router.push({path: `chemical/details/${chemical.dtxsid}`});
              } else {
                vm.$parent.options = results;
              }

              if (results.length === 0) {
                vm.$parent.noResultsMessage = 'No results, please try again.';
              }
            });
        } else if (vm.search.length >= 2 && vm.$parent.substringSearch) {
          vm.$router.push({path: `search-results?input_type=synonym_substring&inputs=${vm.search}`});
        } else if (vm.search.length >= 3 && vm.$parent.isEqualsSearch) {
          if (vm.$parent.isSingleResult) {
            vm.$parent.loadSearchedOn(vm.$parent.isSingleResult.searchMatch);
            vm.$router.push({path: `/chemical/details/${vm.$parent.isSingleResult.dtxsid}`});
          }
          if (!vm.$parent.isSingleResult) {
            vm.$router.push({path: `/dsstoxdb/multiple_results?input_type=equalsDetails&inputs=${vm.search}`});
          }
        } else if (vm.search.length >= 3 && vm.$parent.typeAheadResult) {
          vm.$parent.typeAheadResult = false;
          vm.typeAheadSelect();
        }
      },
    }),
  },
};
</script>

<style lang="scss" scoped>
.blue-grey-text {
    opacity: 50;
}

.nav-search-input-group {
  margin-top: 0em;
  padding-right: .5em;
}

.nav-search-icon {
  height: 2em;
}

.nav-search-input {
  height: 2em;
}
</style>
