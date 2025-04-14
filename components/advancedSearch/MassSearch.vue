<template>
  <mdb-container class="advanced-search-tab">
    <ccte-help-text
      data-cy="MassSearchHeader"
      label-type="h5"
      heading-text="Mass Search"
      help-key="AS Mass Search"
    />
    <adduct-select
      :label-options="adductOptions"
      @onSelect="onAdductSelect"
    />

    <range-search
      :cname="cname"
      :placeholder="inputPlaceholders[searchType]"
      :label="rangeLabels[searchType]"
      :search-type="searchType"
      @onSearch="onSearchUrlChange"
    />
    <two-radio-btn
      :cname="cname"
      :labels="radioLabels"
      @onChange="onSearchTypeChange"
    />
  </mdb-container>
</template>

<script>
import {mdbContainer} from 'mdbvue';
import AdductSelect from '~/components/advancedSearch/AdductSelect.vue';
import RangeSearch from '~/components/advancedSearch/RangeSearch.vue';
import TwoRadioBtn from '~/components/advancedSearch/TwoRadioBtn.vue';

export default {
  name: 'MassSearch',
  components: {
    mdbContainer,
    AdductSelect,
    RangeSearch,
    TwoRadioBtn,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      adduct: '',
      searchType: 0,
      massCheck: 'massCheck',
      radioLabels: ['Mass ± Error', 'Min/ Max'],
      rangeLabels: ['±', 'to'],
      inputPlaceholders: [['mass', 'error'], ['min', 'max']],
      searchUnit: '',
      input1: 0,
      input2: 0,
      adductOptions: [
        {text: 'All adducts', value: 'all'},
        {text: 'Neutral', value: '0'},
        {text: 'M+', value: '0.00054'},
        {text: '[M+H]+', value: '-1.007285'},
        {text: '[M+NH4]+', value: '-18.033834'},
        {text: '[M+Na]+', value: '-22.989229'},
        {text: '[M+K]', value: '-38.963167'},
        {text: 'M-', value: '-0.00054'},
        {text: '[M-H]-', value: '1.007285'},
        {text: '[M+Cl]-', value: '-34.969393'},
        {text: '[M+HCOO]-', value: '-44.998194'},
        {text: '[M+CH3COO]-', value: '-59.013844'},
      ],


    };
  },
  computed: {
    searchUrl() {
      const unit = this.searchUnit === 'Da' ? 'error_da' : 'error_ppm';
      let destination = 'search-results';
      if (this.adduct === 'all') {
        destination = 'search-results/all_adducts';
      }

      return this.searchType === 0 ?
        `${destination}?input_type=ms_ready_monoisotopic_mass&mass_adducts=${encodeURIComponent(this.adduct)}&mass=${this.input1}&${unit}=${this.input2}` :
        `${destination}?input_type=ms_ready_monoisotopic_mass&mass_adducts=${encodeURIComponent(this.adduct)}&min=${this.input1}&max=${this.input2}`;
    },
  },
  methods: {
    onAdductSelect(value) {
      this.adduct = value;
    },
    onSearchTypeChange(type) {
      this.searchType = type;
    },
    onSearchUrlChange(input1, input2, unit) {
      this.searchUnit = unit;
      this.input1 = input1;
      this.input2 = input2;
      window.open(`${this.searchUrl}`, '_blank');
    },
  },
};
</script>

<style lang="scss">
.advanced-search-tab {
    text-align: left;
    .select-outer {
        margin-top:  2em;
        width: 25%;
    }
}
</style>
