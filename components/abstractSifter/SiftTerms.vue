<template>
  <div class="d-flex" data-cy="toolbarSifter">
    <input
      v-for="(term, i) in terms"
      id="searchTermField"
      :key="i"
      :ref="'t'+ i"
      data-cy="sifterTerm"
      class="searchTerm form-control"
      type="text"
      :data-index="i"
      :style="{ borderColor: colors[i % colors.length] }"
      :value="term.text"
      @keyup.enter="addTermEnter"
    >
    <button
      v-if="terms.length > 1"
      class="btn btn-sm btn-warning mt-1 px-2 py-1"
      data-cy="buttonClearTerms"
      @click="clearAllTerms"
    >
      Clear Terms
    </button>
  </div>
</template>

<script>
import {
  mapMutations, mapState,
} from 'vuex';

export default {
  name: 'SiftTerms',

  computed: {
    ...mapState({
      terms: state => state.abstractSifter.terms,
      colors: state => state.abstractSifter.colors,

    }),
  },
  methods: {
    ...mapMutations({
      addTerm: 'abstractSifter/addTerm',
      removeTerm: 'abstractSifter/removeTerm',
      clearTerms: 'abstractSifter/clearTerms',
    }),

    clearAllTerms() {
      const termItems = document.querySelectorAll('#searchTermField');
      termItems.forEach((item) => {
        if (item.disabled) {
          item.disabled = !item.disabled;
        }
      });
      this.clearTerms();
    },
    async addTermEnter(e) {
      e.target.disabled = true;
      const inputIndex = e.target.getAttribute('data-index');
      const termValue = e.target.value;
      const newTerm = {term: termValue, inputIndex: inputIndex};
      this.addTerm(newTerm);
      await this.$nextTick();
      const nextFld = `t${parseInt(inputIndex, 10) + 1}`;
      this.$refs[nextFld][0].focus();
    },
  },
};
</script>

<style scoped>


.searchTerm {
    width: 10em;
    font-size:10px;
    margin-right: 0.3em;
}
</style>
