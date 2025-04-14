<template>
  <div>
    <chemical-type-ahead-search-box
      ref="chemicalTypeaheadSearchBox"
      :cname="cname"
      :placeholder="ph"
      :substring-search="selectedSearchType === 'substringSearch'"
      :override-enter="overrideEnter"
      :search-within-chemical-list="chemicalList"
      @enter="handleChemicalSearchOnEnter"
    />
    <div data-cy="searchtype-radio-buttons" class="homepage-check mb-2 mt-4">
      <client-only>
        <div class="btn-group btn-group-sm" role="group" size="sm">
          <label class="btn btn-info white-border form-check-label" :class="{active: selectedSearchType === 'typeAheadSearch'}">
            <input
              id="typeAheadSearch"
              v-model="selectedSearchType"
              data-cy="typeAheadSearchButton"
              type="radio"
              value="typeAheadSearch"
              name="selectSearch"
              autocomplete="off"
              checked="selectedSearchType === 'typeAheadSearch'"
              @change="updatePlaceHolder"
            >
            Type-ahead search
          </label>
          <label v-if="!chemicalList" class="btn btn-info white-border form-check-label" :class="{active: selectedSearchType === 'exactSearch'}">
            <input
              id="exactSearch"
              v-model="selectedSearchType"
              data-cy="exactSearchButton"
              type="radio"
              value="exactSearch"
              name="selectSearch"
              autocomplete="off"
              checked="selectedSearchType === 'exactSearch'"
              @change="updatePlaceHolder"
            >
            Exact search
          </label>
          <label class="btn btn-info white-border form-check-label" :class="{active: selectedSearchType === 'substringSearch'}">
            <input
              id="substringSearch"
              v-model="selectedSearchType"
              data-cy="substringSearchButton"
              type="radio"
              value="substringSearch"
              name="selectSearch"
              autocomplete="off"
              checked="selectedSearchType === 'substringSearch'"
              @change="updatePlaceHolder"
            >
            Identifier substring search
          </label>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import ChemicalTypeAheadSearchBox from '~/components/homepageSearch/ChemicalTypeAheadSearchBox.vue';

export default {
  name: 'ChemicalSearch',
  components: {
    ChemicalTypeAheadSearchBox,
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
    overrideEnter: {
      type: Boolean,
      default: false,
    },
    chemicalList: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      input: '',
      substringSearchChecked: false,
      selectedSearchType: 'typeAheadSearch',
      ph: this.placeholder,
    };
  },
  methods: {
    emitUpdatedInput() {
      this.$emit('onFilter', this.input);
    },
    updatePlaceHolder() {
      const phChemicalSearch = 'Search for chemical by systematic name, synonym, CAS number, DTXSID or InChIKey';
      const phExactSearch = 'Search for chemicals with an exact match to your search string by synonym, CAS number, DTXSID or InChIKey';
      const phIndentifierSearch = 'Search for a set of chemicals that match input on systematic name or synonyms';
      if (this.substringSearchChecked || this.selectedSearchType === 'substringSearch') {
        this.ph = phIndentifierSearch;
      }
      if (this.selectedSearchType === 'typeAheadSearch') {
        this.ph = phChemicalSearch;
      }
      if (this.selectedSearchType === 'exactSearch') {
        this.ph = phExactSearch;
      }
    },
    handleChemicalSearchOnEnter(searchParams) {
      this.$emit('chemical-search', searchParams);
    },
  },
};
</script>
<style>
.homepage-check {
  margin-top: 1em;
  text-align: left;
}
.white-border {
  border: whitesmoke solid 1px !important;
  padding: 6px !important;
  text-transform: none !important;
}
</style>
