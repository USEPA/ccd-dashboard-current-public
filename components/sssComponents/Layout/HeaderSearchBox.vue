<template>
  <client-only>
    <div class="input-group nav-search-input-group" style="minwidth: 645px">
      <v-select
        v-model="selected"
        :filterable="false"
        :clear-search-on-blur="
          ({ clearSearchOnSelect, multiple }) => {
            options = [];
            return true;
          }
        "
        :options="options"
        :map-keydown="handlers"
        data-cy="chemical-search-input"
        label="searchWord"
        :select-on-key-codes="[13, 9]"
        class="form-control nav-search-input px-0 py-0"
        :placeholder="placeholder"
        :tabindex="tabIndex"
        @search="onSearch"
        @input="selectOption"
      >
        <template slot="no-options">
          <span>
            {{ noResultsMessage }}
            <b-spinner v-if="searching" class="spinner" label="Loading..." /><template
              v-else
            >{{ searchMessage }}</template>
          </span>
        </template>
        <template slot="option" slot-scope="option">
          <div class="d-flex flex-row">
            <div>
              <b-img
                v-if="option.hasStructureImage"
                height="40"
                width="40"
                :src="imageUrl(option.dtxcid)"
              />
            </div>
            <div class="font-weight-normal ml-2">
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
        <template slot="selected-option" slot-scope="option">
          <div class="font-weight-normal">
            <span class="h6">{{ option.searchWord }}</span>
            <span class="font-italic font-weight-lighter h6">{{ option.dtxsid }}</span>
          </div>
        </template>
      </v-select>
      <div class="input-group-append">
        <span class="input-group-text blue nav-search-icon">
          <b-icon-search />
        </span>
      </div>
    </div>
  </client-only>
</template>

<script>
/* eslint-disable no-else-return */
import {debounce} from 'debounce';

export default {
  name: 'HomepageSearchBox',
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
  },
  data() {
    return {
      errorMessage: '',
      noError: false,
      searchMessage: 'Start typing to search.',
      noResultsMessage: null,
      options: [],
      searching: false,
      selected: '',
      tabIndex: -1,
    };
  },
  created() {
    this.$nuxt.$on('clear', () => {
      this.selectOption(null, true);
    });
  },
  methods: {
    imageUrl(dtxcid) {
      return `${process.env.APPLICATION_BASE_API}${
        this.apiSettings().CHEMICAL_IMAGE_API
      }by-dtxcid/${dtxcid}`;
    },
    onSearchBlur(e) {
      this.options = [];
      this.noResultsMessage = null;
    },
    selectOption(chemical, fromEvent = false) {
      // SET VUEX DATA? const setString = this.loadSearchedOn(chemical.searchMatch)
      if (chemical) {
        this.$store.dispatch('setChemical', chemical);
      }
      if (chemical === null) {
        this.selected = null;
      }
      if (chemical === null && !fromEvent) {
        this.$store.dispatch('setStep', 0);
      }
    },
    onSearch(search, loading) {
      this.searchMessage = 'Start typing to search.';
      this.noResultsMessage = null;
      if (search.length > 2) {
        loading(true);
        this.search(loading, search, this);
      }
    },
    search: debounce((loading, search, vm) => {
      if (search.length <= '2') {
        vm.options = [];
        loading(false);
        return;
        // eslint-disable-next-line unicorn/prefer-includes
      } else if (
        search.length > 2 &&
        ((search.trim().toUpperCase().includes('DTXSID') && search.trim().length <= 8) ||
          (search.trim().toUpperCase().includes('DTXCID') && search.trim().length <= 11))
      ) {
        vm.options = [];
        loading(false);
        return;
      }
      try {
        vm.searching = true;
        vm.$repositories.chemicalSearch
          .startsWith(search)
          .then((results) => {
            if (results.length === 0) {
              vm.noResultsMessage = 'No results found. Please try again.';
            }
            vm.options = results;
            vm.searching = false;
            loading(false);
          })
          .catch(() => {
            vm.searching = false;
            vm.$nuxt.$emit('chemicalSelectErr');
          });
      } catch (err) {
        console.error('err');
      } finally {
        vm.options = [];
        loading(false);
      }
    }, 500),
    handlers: (map, vm) => ({
      ...map,
      13: (e) => {
        e.preventDefault();
        if (e.key === 'Enter' && vm.search.length > 1) {
          vm.$parent.searching = true;
          vm.$repositories.chemicalSearch
            .matchesExactly(vm.search)
            .then((results) => {
              vm.$parent.searching = false;
              if (results.length === 0) {
                vm.$parent.options = [];
                vm.$parent.noResultsMessage = 'No results found. Please try again.';
              }
              if (results.length >= 1) {
                vm.$parent.options = results;
              }
            })
            .catch(() => {
              vm.$parent.searching = false;
            });
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
  padding-right: 0.5em;
}

.nav-search-input-group ::v-deep .vs__search,
.vs__search:focus {
  font-size: 0.87em;
}

.nav-search-icon {
  height: 2em;
}

.nav-search-input {
  height: 2em;
}

.spinner {
  color: #6c757d;
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
