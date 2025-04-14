export default {
  setWebenv(state, properties) {
    state.webEnv = properties;
  },
  setLoading(state, properties) {
    state.loading = properties;
  },
  setError(state, properties) {
    state.error = properties;
  },

  setQuerykey(state, properties) {
    state.queryKey = properties;
  },
  setArticleCount(state, properties) {
    state.articleCount = properties;
  },
  resetArticleList(state, properties) {
    state.articleList = [];
  },
  addArticleList(state, chunk) {
    state.articleList.push(...chunk);
  },
  setArticleChunk(state, properties) {
    state.articleChunk = properties;
  },
  setCancel(state, properties) {
    state.cancel = properties;
  },
  addTerm(state, newTerm) {
    const termCount = state.terms.length;
    if (newTerm === ' ') { return; }
    if (state.terms[newTerm.inputIndex].text) {
      state.terms[newTerm.inputIndex].text = newTerm.term;
    } else {
      state.terms.splice((termCount - 1), 0, {text: newTerm.term});
    }
    state.lastTermAdded = {term: newTerm.term, index: newTerm.inputIndex};
  },
  removeTerm(state, index) {
    const removed = state.terms.splice(index, 1);
  },
  clearTerms(state) {
    state.terms = [{text: ''}];
  },

};
