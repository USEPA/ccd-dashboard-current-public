<template>
  <client-only>
    <div class="input-group home-search-input-group">
      <v-select
        :ref="'searchField'"
        :filterable="false"
        :append-to-body="true"
        :options="options"
        label="searchWord"
        :select-on-key-codes="[13, 9]"
        :map-keydown="handlers"
        data-cy="search-input"
        class="form-control home-search-input px-0 py-0"
        :placeholder="placeholder"
        @search="onSearch"
        @input="selectOption"
        @search:blur="onSearchBlur"
      >
        <template slot="no-options">
          <span> {{ noResultsMessage }} {{ searchMessage }}</span>
        </template>

        <template slot="option" slot-scope="option">
          <div class="font-weight-normal">
            <chemical-icon :width="'45'" height="'45'" :data="option" />
            <div>
              <span class="h6">{{ option.searchWord }}</span>
              <br>
              <span v-if="option.dtxsid" class="font-italic font-weight-lighter h6">{{
                option.dtxsid
              }}</span>
              <span v-else class="font-italic font-weight-lighter h6">{{
                option.dtxcid
              }}</span>
            </div>
          </div>
        </template>
        <template v-if="!caffeine" slot="option" slot-scope="option">
          <div class="font-weight-normal">
            <chemical-icon :width="'45'" height="'45'" :data="option" />
            <div>
              <span class="h6">{{ option.searchWord }}</span>
              <br>
              <span v-if="option.dtxsid" class="font-italic font-weight-lighter h6">{{
                option.dtxsid
              }}</span>
              <span v-else class="font-italic font-weight-lighter h6">{{
                option.dtxcid
              }}</span>
            </div>
          </div>
        </template>
        <template v-else slot="option" slot-scope="option">
          <div class="font-weight-normal">
            <chemical-icon :width="'45'" height="'45'" :data="option" />
            <div>
              <span class="h6">{{ option.searchWord }}</span>
              <br>
              <span v-if="option.dtxsid" class="font-italic font-weight-lighter h6">{{
                option.dtxsid
              }}</span>
              <span v-else class="font-italic font-weight-lighter h6">{{
                option.dtxcid
              }}</span>
            </div>
          </div>
        </template>
        <template v-if="!caffeine" slot="selected-option" slot-scope="option">
          <div class="font-weight-normal">
            <span class="h6">{{ option.searchWord }}</span>
            <span v-if="option.dtxsid" class="font-italic font-weight-lighter h6">{{
              option.dtxsid
            }}</span>
            <span v-else class="font-italic font-weight-lighter h6">{{
              option.dtxcid
            }}</span>
          </div>
        </template>
      </v-select>
      <div class="input-group-append">
        <span class="input-group-text blue pt-1 pb-1">
          <mdb-icon
            ref="searchButton"
            icon="search"
            class="text-white"
            size="md"
          />
        </span>
      </div>
      <!-- caffeine-fix display -->
      <div v-if="caffeine" data-cy="caffeine-hints" class="container-fluid text-left">
        <div data-cy="caffeine-message">
          {{ caffeine }} <span
            v-for="word in caffeineArray"
            :key="word"
            class="hint"
          >
            <a alt="search using auto suggested value" class="suggestions text-white text-decoration-underline font-weight-bolder ml-2" @click="updateSearch(word)"><u> {{ word }} </u></a>
          </span>
        </div>
      </div>
      <!-- end caffeine-fix display -->
    </div>
  </client-only>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import {mdbIcon} from 'mdbvue';

import {debounce} from 'debounce';
import ChemicalIcon from '~/components/homepageSearch/ChemicalImageIcon.vue';

export default {
  name: 'ChemicalTypeAheadSearchBox',
  components: {
    mdbIcon,
    ChemicalIcon,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default:
        'Search for chemical by systematic name, synonym, CAS number, DTXSID or InChIKey',
    },
    substringSearch: {
      type: Boolean,
      default: false,
    },
    overrideEnter: {
      type: Boolean,
      default: false,
    },
    searchWithinChemicalList: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      searchMessage: 'Start typing or paste text to search.',
      searchElement: null,
      caffeine: false,
      caffeineArray: [],
      typeAheadResult: false,
      noResultsMessage: null,
      isEqualsSearch: false,
      isSingleResult: false,
      options: [],
    };
  },
  computed: {
    ...mapGetters({
      getFilteredChems: 'results/getFilteredChems',
    }),
  },
  watch: {
    substringSearch(n, o) {
      if (n) {
        this.searchMessage = 'Press ENTER to search';
        this.options = [];
      } else {
        this.searchMessage = 'Start typing or paste text to search.';
      }
    },
  },
  beforeMount() {
    // onNuxtReady is called _after_ the Nuxt.js app is fully mounted,
    // so Sentry is not yet loaded when beforeMount is called
    // But when you set injectMock: true this call will be captured
    // and executed after Sentry has loaded
    // this.$sentry.captureMessage('Hello!')
  },
  mounted() {
    this.focusInput();
    this.$nextTick(() => {
      this.searchElement = this.$refs.searchField.$refs.search;
    });
  },
  methods: {
    async chemListFiltered(ids) {
      const chems = await this.getFilteredChems(ids);
      if (chems.length > 0) {
        return chems;
      }
      return [];
    },
    caffeineSearchHandler(results, vm, loading) {
      if (!Array.isArray(results)) {
        results = JSON.parse(results);
        vm.caffeineArray = results.data.suggestions;
        vm.caffeine = `${results.data.detail}  ${
          vm.caffeineArray.length > 1 ? 'You might want to try one of the following: ' : ''
        } `;
        loading(false);
        this.$refs.searchField.$refs.search.blur();
      }
      if (Array.isArray(results)) {
        vm.caffeine = false;
        vm.caffeineArray = [];
      }
    },
    updateSearch(word) {
      this.$refs.searchField.$refs.search.focus();
      this.$nextTick(() => {
        this.$refs.searchField.$refs.search.value = word;
        this.$refs.searchField.search = word;
      });
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.searchField.$refs.search.focus();
      });
    },
    onSearchBlur(e) {
      this.options = [];
      this.isEqualsSearch = false;
      this.isSingleResult = false;
      this.typeAheadResult = false;
      this.noResultsMessage = null;
    },
    ...mapActions({
      loadSearchedOn: 'searchedOn/loadSearchedOn',
    }),
    selectOption(chemical) {
      this.loadSearchedOn(chemical.searchMatch);
      const dtxid = chemical.dtxsid ? chemical.dtxsid : chemical.dtxcid;
      const list = !this.searchWithinChemicalList ?
        '' :
        `?list=${this.searchWithinChemicalList}`;
      const path = `/chemical/details/${dtxid}`;
      this.$router.push({path: `${path}${list}`});
    },
    onSearch(search, loading) {
      if (search.length > 1) {
        this.isEqualsSearch = false;
        this.isSingleResult = false;
        this.typeAheadResult = false;
        this.options = [];
        this.caffeine = false;
        this.caffeineArray = [];
        loading(true);
        this.search(loading, search, this);
      }
      if (search.length === 0) {
        loading(false);
        this.options = [];
      }
    },
    search: debounce((loading, search, vm) => {
      if (search.length < 2) {
        vm.isEqualsSearch = false;
        vm.isSingleResult = false;
        vm.typeAheadResult = false;
        vm.caffeine = false;
        vm.caffeineArray = [];
        loading(false);
        vm.options = [];
        return;
      }
      if (search.length <= '2') {
        vm.options = [];
        loading(false);
        return;
      }
      if (
        search.length > 2 &&
        ((search.trim().toUpperCase().includes('DTXSID') && search.trim().length <= 8) ||
          (search.trim().toUpperCase().includes('DTXCID') && search.trim().length <= 8))
      ) {
        vm.options = [];
        loading(false);
        return;
      }
      if (vm.searchWithinChemicalList && !vm.substringSearch) {
        vm.$repositories.chemicalSearch
          .chemListStartsWith(search, vm.searchWithinChemicalList, vm.$sentry)
          .then((results) => {
            let dtxsidList = results;
            let chemicalList = [];
            if (results.length > 0) {
              vm.chemListFiltered(dtxsidList).then((chems) => {
                chemicalList = chems;
                vm.options = chemicalList;
                vm.typeAheadResult = true;
                loading(false);
              });
            }
            if (results.length === 0) {
              vm.noResultsMessage = 'No results, please try again.';
              vm.typeAheadResult = true;
              loading(false);
            }
            vm.typeAheadResult = true;
            loading(false);
          });
      }
      if (!vm.substringSearch && !vm.searchWithinChemicalList) {
        if (vm.$parent.selectedSearchType === 'exactSearch') {
          vm.$repositories.chemicalSearch.equals(search, vm.$sentry).then((exactResults) => {
            if (exactResults.length === 1) {
              vm.options = [];
              // eslint-disable-next-line prefer-destructuring
              vm.isSingleResult = exactResults[0];
              vm.isEqualsSearch = true;
              vm.options = exactResults;
              loading(false);
              setTimeout(() => {
                exactResults = [];
              }, 3000);
            }
            if (exactResults.length > 1) {
              vm.isEqualsSearch = true;
              vm.isSingleResult = false;
              vm.options = exactResults;
              loading(false);
              setTimeout(() => {
                exactResults = [];
              }, 3000);
            }
            if (exactResults.length === 0) {
              vm.isSingleResult = false;
              vm.isEqualsSearch = false;
              loading(false);
            }
          });
        }
        if (vm.$parent.selectedSearchType === 'typeAheadSearch') {
          vm.$repositories.chemicalSearch
            .startsWith(search, vm.searchWithinChemicalList)
            .then((results) => {
              vm.caffeineSearchHandler(results, vm, loading);
              if (results.length === 0) {
                vm.noResultsMessage = 'No results, please try again.';
              }
              vm.options = results;
              vm.typeAheadResult = true;
              loading(false);
            });
        }
      }
      loading(false);
    }, 2000),
    handlers: (map, vm) => ({
      ...map,
      13: (e) => {
        e.preventDefault();
        if (!vm.$parent.typeAheadResult) {
          e.preventDefault();
        }
        if (vm.$parent.overrideEnter && vm.$parent.$parent.selectedSearchType === 'substringSearch') {
          vm.$parent.$emit('enter', {
            isSubstringSearch: vm.$parent.$parent.selectedSearchType === 'substringSearch',
            searchTerm: encodeURI(vm.search),
          });
          return;
        }
        if (vm.$parent.overrideEnter && vm.$parent.typeAheadResult) {
          vm.$parent.$emit('enter', {
            searchTerm: encodeURI(vm.search),
          });
          vm.$parent.typeAheadResult = false;
          vm.typeAheadSelect();
        }
        if (vm.search.length >= 2 && vm.$parent.substringSearch) {
          vm.$router.push({
            path: `search-results?input_type=synonym_substring&inputs=${vm.search}`,
          });
        } else if (vm.search.length >= 3 && vm.$parent.isEqualsSearch) {
          if (vm.$parent.isSingleResult) {
            vm.$parent.loadSearchedOn(vm.$parent.isSingleResult.searchMatch);
            vm.$router.push({
              path: `chemical/details/${vm.$parent.isSingleResult.dtxsid}`,
            });
          }
          if (!vm.$parent.isSingleResult) {
            vm.$router.push({
              path: `search-results?input_type=equalsDetails&inputs=${vm.search}`,
            });
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

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

.home-search-input-group {
  margin-top: 1.5em;
}

.vs__dropdown-toggle {
  height: 100% !important;
}

.home-search-icon {
  height: 3em;
  width: 3em;
}
</style>
