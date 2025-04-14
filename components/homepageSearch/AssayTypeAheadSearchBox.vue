<template>
  <client-only>
    <div class="input-group home-search-input-group">
      <v-select
        :filterable="false"
        :append-to-body="true"
        :clear-search-on-blur="({ clearSearchOnSelect, multiple }) => {
          _options = []
          return true
        }"
        :options="options"
        label="modifiedValue"
        :select-on-key-codes="[9, 13]"
        :map-keydown="handlers"
        data-cy="search-input"
        class="form-control home-search-input px-0 py-0"
        :placeholder="placeholder"
        @search="onSearch"
        @input="selectOption"
      >
        <template slot="no-options">
          <span>Start typing to search.</span>
        </template>
        <template slot="option" slot-scope="option">
          <div class="font-weight-normal">
            <div>
              <span class="h6">{{ option.searchMatch.toUpperCase() }}: {{ option.searchWord }}</span>
              <br> <span class="font-italic font-weight-lighter h6">{{ option.searchValueDesc.substring(0, 75) }}...</span>
            </div>
          </div>
        </template>
      </v-select>
      <div class="input-group-append">
        <span class="input-group-text blue home-search-icon">
          <mdbIcon
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
import {
  mdbIcon,
} from 'mdbvue';

import {debounce} from 'debounce';

export default {
  name: 'AssayTypeAheadSearchBox',
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
      default: '',
    },
  },
  data() {
    return {
      errorMessage: '',
      noError: false,
      options: [],
    };
  },
  methods: {
    selectOption(assayList) {
      if (assayList.searchMatch === 'gene') {
        this.$router.push({path: `/assay-endpoints?search=${assayList.searchWord}`});
      } else {
        this.$router.push({path: `/assay-endpoints/${assayList.searchWord}`});
      }
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

      try {
        vm.$repositories.assay.assayGeneSearch(search)
          .then((results) => {
            vm.options = results;
            loading(false);
          });
      } catch (err) {
        let errObj = err;
        if (err.response) {
          errObj = err.response;
        } else if (err.request) {
          errObj = err.request;
        } else {
          errObj = err.message;
        }
        vm.errorMsg = `${errObj.message} - ${errObj.statusText} - ${errObj.request} Assay search failed.`;
        vm.$notify.error({
          message: `${err.message} - ${err.statusText} - ${errObj} Assay search failed.`, position: 'top right', timeOut: 5000,
        });
        loading(false);
      } finally {
        vm.options = [];
        loading(false);
      }
    }, 500),
    handlers: (map, vm) => ({
      ...map,
      13: (e) => {
        e.preventDefault();
        vm.$repositories.assay.assayGeneSearch(vm.search)
          .then((results) => {
            if (results.length === 1) {
              const chemical = results[0];
              vm.$router.push({path: `/assay-endpoints?filtered=&search=${chemical.searchWord}`});
            } else if (results.length > 1) {
              vm.$parent.options = results;
            }
          });
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
