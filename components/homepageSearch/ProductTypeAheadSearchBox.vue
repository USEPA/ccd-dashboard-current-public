<template>
  <client-only>
    <div class="input-group home-search-input-group product-search">
      <v-select
        :ref="'searchField'"
        :filterable="false"
        :append-to-body="true"
        :options="options"
        label="searchValue"
        :select-on-key-codes="[13]"
        :map-keydown="handlers"
        class="form-control home-search-input px-0 py-0"
        data-cy="search-input"
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
            <div>
              <span class="h6">{{ option.searchName }}: {{ option.searchValue }}</span>
              <br> <span class="font-italic font-weight-lighter h6">{{ option.searchValueDesc }}</span>
            </div>
          </div>
        </template>
        <template slot="selected-option" slot-scope="option">
          <div class="font-weight-normal">
            <span class="h6">{{ option.searchName }}: {{ option.searchValue }}</span>
            <span class="font-italic font-weight-lighter h6">{{ option.searchValueDesc }}</span>
          </div>
        </template>
      </v-select>
      <div class="input-group-append">
        <span class="input-group-text blue home-search-icon">
          <mdb-icon
            icon="search"
            class="text-white"
            size="lg"
          />
        </span>
      </div>
    </div>
  </client-only>
</template>

<script>
import {mapActions} from 'vuex';

import {
  mdbIcon,
} from 'mdbvue';

import {debounce} from 'debounce';

export default {
  name: 'ProductTypeAheadSearchBox',
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
      default: 'Search for chemicals based on product or use category',
    },
    substringSearch: {
      type: Boolean,
      default: false,
    },
    overrideEnter: {
      type: Boolean,
      default: false,
    },
    searchWithinProductList: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      searchMessage: 'Start typing to search.',
      noResultsMessage: null,
      options: [],
    };
  },
  watch: {
    substringSearch(n, o) {
      if (n) {
        this.searchMessage = 'Press ENTER to search';
        this.options = [];
      } else {
        this.searchMessage = 'Start typing to search.';
      }
    },
  },
  mounted() {
    this.focusInput();
  },
  methods: {
    focusInput() {
      this.$nextTick(() => {
        this.$refs.searchField.$refs.search.focus();
      });
    },
    onSearchBlur(e) {
      this.options = [];
      this.noResultsMessage = null;
    },
    ...mapActions({
      loadSearchedOn: 'searchedOn/loadSearchedOn',
    }),
    selectOption(product) {
      const productCat = product.searchName;
      const productSubCat = product.searchValue;
      this.$router.push({path: `/search-results?input_type=puc&inputs=${productSubCat}`});
    },
    onSearch(search, loading) {
      if (search.length > 2) {
        loading(true);
        this.search(loading, search, this);
      }
      if (search.length === 0) {
        loading(false);
        this.options = [];
      }
    },
    search: debounce((loading, search, vm) => {
      if (search.length <= '2') {
        vm.options = [];
        loading(false);
        return;
      }

      if (!vm.substringSearch) {
        vm.options = [];
        vm.$repositories.productSearch.productsStartWith(search)
          .then((results) => {
            if (results.length === 0) {
              vm.noResultsMessage = 'No results, please try again.';
            }
            vm.options = results;
          });
      }
      loading(false);
    }, 500),
    handlers: (map, vm) => ({
      ...map,
      13: (e) => {
        e.preventDefault();
        if (vm.$parent.overrideEnter) {
          vm.$parent.$emit('enter', {
            isSubstringSearch: vm.$parent.substringSearch,
            searchTerm: vm.search,
          });
          return;
        }
        if (vm.search.length > 1 && vm.search.length < 3 && !vm.$parent.substringSearch) {
          vm.options = [];
          vm.$repositories.productSearch.chemicalsByProduct(vm.search, vm.searchWithinProductList)
            .then((results) => {
              if (results.length === 1) {
                const product = results[0];
                const setString = vm.$parent.loadSearchedOn(product.searchWord);
                this.$router.push({path: `/search-results?input_type=puc&inputs=${product.searchValue}`});
              } else {
                vm.$parent.options = vm.options.concat(results);
              }

              if (results.length === 0) {
                vm.$parent.noResultsMessage = 'No results, please try again.';
              }
            });
        } else if (vm.search.length >= 3) {
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
