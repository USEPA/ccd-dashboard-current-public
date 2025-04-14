<template>
  <client-only>
    <div class="input-group nav-search-input-group search-box" style="min-width: 300px;">
      <v-select
        :filterable="false"
        :append-to-body="true"
        :clear-search-on-blur="({ clearSearchOnSelect, multiple }) => {
          _options = []
          return true
        }"
        :options="options"
        label="searchWord"
        :select-on-key-codes="[13, 9]"
        class="form-control nav-search-input px-0 py-0"
        :placeholder="placeholder"
        :tabindex="tabIndex"
        data-cy="chemicalSearch"
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
    </div>
  </client-only>
</template>

<script>
/* eslint-disable no-else-return */
import {mapActions} from 'vuex';
import {debounce} from 'debounce';

export default {
  name: 'HomepageSearchBox',
  components: {

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
  },
  data() {
    return {
      errorMessage: '',
      noError: false,
      searchMessage: 'Start typing to search.',
      noResultsMessage: null,
      options: [],
      tabIndex: -1,
    };
  },
  methods: {
    onSearchBlur(e) {
      this.options = [];
      this.noResultsMessage = null;
    },
    ...mapActions({
      loadSearchedOn: 'searchedOn/loadSearchedOn',
    }),
    selectOption(chemical) {
      const dtxid = chemical.dtxsid ? chemical.dtxsid : chemical.dtxcid;
      this.$store.dispatch('predictions/getStructure', dtxid);
    },
    onSearch(search, loading) {
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
      } else if ((search.length > 2) &&
          ((search.trim().toUpperCase().includes('DTXSID') && search.trim().length <= 8) ||
          (search.trim().toUpperCase().includes('DTXCID') && search.trim().length <= 11))) {
        vm.options = [];
        loading(false);
        return;
      }
      try {
        vm.$repositories.chemicalSearch.startsWith(search)
          .then((results) => {
            vm.options = results;
            loading(false);
          });
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else if (err.request) {
          console.log(err.request);
        } else {
        // Something happened in setting up the request and triggered an Error
          console.log('Error', err.message);
        }
        loading(false);
      } finally {
        vm.options = [];
        loading(false);
      }
    }, 500),
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
.search-box {
    margin-bottom: 2rem;
}
</style>
