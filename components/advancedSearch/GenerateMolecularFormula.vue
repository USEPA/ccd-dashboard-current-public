<template>
  <mdb-container class="advanced-search-tab">
    <ccte-help-text
      data-cy="GenerateMolFormulaSearchHeader"
      label-type="h5"
      heading-text="Generate Molecular Formula(e)"
      help-key="AS Generate Mol Formula(e)"
    />
    <adduct-select
      :label-options="adductOptions"
      @onSelect="onAdductSelect"
    />
    <option-group
      :options="formulaReqOptions"
      @onChange="onFormulaReqChange"
    />
    <range-search
      :cname="cname"
      :placeholder="inputPlaceholders[searchType]"
      :label="rangeLabels[searchType]"
      :search-type="searchType"
      :search-unit="searchUnit"
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
import OptionGroup from '~/components/advancedSearch/OptionGroup.vue';

export default {
  name: 'GenerateMolecularFormula',
  components: {
    mdbContainer,
    AdductSelect,
    RangeSearch,
    TwoRadioBtn,
    OptionGroup,
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
      searchUnit: '',
      formulaReqStr: '',
      input1: '',
      input2: '',
      radioLabels: ['Mass ± Error', 'Min/ Max'],
      rangeLabels: ['±', 'to'],
      inputPlaceholders: [['mass', 'error'], ['min', 'max']],
      formulaReqOptions: [
        [
          {
            id: 0,
            name: 'C',
            min: 1,
            max: 50,
            defaultMin: 1,
            defaultMax: 50,
          },
          {
            id: 1,
            name: 'H',
            min: 0,
            max: 100,
            defaultMin: 0,
            defaultMax: 100,
          },
          {
            id: 2,
            name: 'O',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 3,
            name: 'N',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 4,
            name: 'P',
            min: 0,
            max: 10,
            defaultMin: 0,
            defaultMax: 10,
          },
          {
            id: 5,
            name: 'S',
            min: 0,
            max: 10,
            defaultMin: 0,
            defaultMax: 10,
          },
        ],
        [
          {
            id: 0,
            name: 'C',
            min: 1,
            max: 50,
            defaultMin: 1,
            defaultMax: 50,
          },
          {
            id: 1,
            name: 'H',
            min: 0,
            max: 100,
            defaultMin: 0,
            defaultMax: 100,
          },
          {
            id: 2,
            name: 'O',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 3,
            name: 'N',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 4,
            name: 'P',
            min: 0,
            max: 10,
            defaultMin: 0,
            defaultMax: 10,
          },
          {
            id: 5,
            name: 'S',
            min: 0,
            max: 10,
            defaultMin: 0,
            defaultMax: 10,
          },
          {
            id: 6,
            name: 'F',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 7,
            name: 'CI',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 8,
            name: 'Br',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
          {
            id: 9,
            name: 'I',
            min: 0,
            max: 20,
            defaultMin: 0,
            defaultMax: 20,
          },
        ],
      ],
      adductOptions: [

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
      const strippedFormulaReqStr = this.formulaReqStr.replace(/\s/g, '');

      return this.searchType === 0 ?
        `search-results/molecular_formulas?adduct=${this.adduct}&reqStr=${strippedFormulaReqStr}&mass=${this.input1}&${unit}=${this.input2}` :
        `search-results/molecular_formulas?adduct=${this.adduct}&reqStr=${strippedFormulaReqStr}&min=${this.input1}&max=${this.input2}`;
    },
  },
  methods: {

    onAdductSelect(value) {
      this.adduct = value;
    },
    onSearchTypeChange(type) {
      this.searchType = type;
    },
    onFormulaReqChange(str) {
      this.formulaReqStr = str;
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

