<template>
  <mdb-container>
    <ccte-help-text
      data-cy="MolFormulaSearchHeader"
      label-type="h5"
      heading-text="Molecular Formula Search"
      help-key="AS Mol Formula Search"
    />
    <molecular-search-box
      :cname="cname"
      :placeholder="placeholderText"
      @onSearch="onSearchUrlChange"
    />
    <div class="d-flex flex-row mt-4">
      <div v-for="(option, idx) in headingTexts" :key="option" class="custom-control custom-radio mr-4">
        <input
          :id="`option${idx}-${cname}`"
          type="radio"
          class="custom-control-input"
          :name="`searchTypeRadios-${cname}`"
          :radio-value="`option${idx}-${cname}`"
          :checked="idx === searchType"
          @input="onSearchTypeChange(idx)"
        >
        <label class="custom-control-label" :for="`option${idx}-${cname}`" />
        <ccte-help-text
          data-cy="ExactFormulaSearchHeader"
          label-type="span"
          :heading-text="headingTexts[idx]"
          :help-key="helpKeys[idx]"
        />
      </div>
    </div>
  </mdb-container>
</template>

<script>
import {mdbContainer} from 'mdbvue';
import MolecularSearchBox from '~/components/advancedSearch/MolecularSearchBox.vue';

export default {
  name: 'MolecularFormulaSearch',
  components: {
    mdbContainer,
    MolecularSearchBox,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Please use the format of the following examples: C6H8O2 or C6H(8-10)O(0-2)',
    },
  },
  data() {
    return {
      input: '',
      searchType: 2,
      headingTexts: ['MS Ready Formula', 'Exact Formula', 'Formula Contains'],
      helpKeys: ['BATCH MS Ready Formula Search', 'BATCH Exact Formula Search', 'BATCH Molecular Formula Search'],
    };
  },
  computed: {
    placeholderText() {
      return this.searchType === 2 ? 'Please use the format of the following example: C6H8O2' : this.placeholder;
    },
    inputType() {
      if (this.searchType === 0) {
        return 'ms_ready_formula';
      }

      if (this.searchType === 1) {
        return 'exact_formula';
      }

      return 'contains_formula';
    },
    searchUrl() {
      return `search-results?inputs=${encodeURIComponent(this.input)}&input_type=${this.inputType}`;
    },
  },
  methods: {
    emitUpdatedInput() {
      this.$emit('onFilter', this.input);
    },
    onSearchTypeChange(type) {
      this.searchType = type;
    },
    onSearchUrlChange(input) {
      this.input = input;
      window.open(`${this.searchUrl}`, '_blank');
    },
  },
};
</script>

<style scoped>
:deep(.custom-control) {
  display: inline-flex !important;
}
</style>

