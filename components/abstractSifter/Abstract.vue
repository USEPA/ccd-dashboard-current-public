<template>
  <div
    v-if="article"
    class="abstract"
    data-cy="abstract"
  >
    <p v-html="abstractHTML" />
  </div>
</template>

<script>
import {
  mapGetters, mapMutations, mapState, mapActions,
} from 'vuex';
// eslint-disable-next-line import/no-extraneous-dependencies
import escapeString from 'escape-string-regexp';

export default {
  name: 'Abstract',

  props: {
    article: {
      type: Object,
      default: null,
    },
  },

  computed: {
    titleHTML() { return this.article.title; },
    abstractHTML() {
      const bothText = `<strong>${this.article.title}</strong><br>${this.article.abstract}`;
      return this.highlightText(bothText);
    },
    ...mapState({
      terms: state => state.abstractSifter.terms,
      colors: state => state.abstractSifter.colors,

    }),
    ...mapGetters({
      getTerms: 'abstractSifter/getTerms',
    }),

  },
  mounted() {

  },
  methods: {
    highlightText(baseText) {
      if (this.terms.length < 2) {
        return baseText;

      // eslint-disable-next-line no-else-return
      } else {
        // create map to hold the search term and color
        const termColorMap = this.terms.slice(0, this.terms.length - 1).reduce((acc, t, i) => {
          acc[escapeString(t.text).toLowerCase()] = this.colors[i % this.colors.length];
          return acc;
        }, {});
        // create a map like the termColorMap based on the trimmed value of the term to handle spaces in the term string ICD-4086
        const trimmedColorMap = this.terms.slice(0, this.terms.length - 1).reduce((acct, t, i) => {
          acct[escapeString(t.text.trim()).toLowerCase()] = this.colors[i % this.colors.length];
          return acct;
        }, {});
        const joinedTerms = Object.keys(termColorMap).join('|');
        const termRegExp = new RegExp(joinedTerms, 'gi');
        // create the new text string basing the color on the trimmed value of the term
        const newText = baseText.replace(termRegExp, (match) => {
          const trimmedMatch = match.trim();
          return `<span style="background-color:${trimmedColorMap[escape(trimmedMatch).toLowerCase().trim()]};">${match}</span>`;
        });
        return newText;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .abstract{
      border:1px solid gray;
      font-size:12px;
      width:100%;
      padding:10px;
      height:200px;
      overflow-y:scroll;
    }
</style>
