export default {

  getGridDefs: state => () => state.gridDefs,
  getExportColDefs: state => () => state.exportColDefs,
  getAllArticles: state => () => state.articleList,
  getArticleChunk: state => () => state.articleChunk,
  getReturnedCount: state => () => state.articleList.length,
  getTerms: state => () => state.terms,
  getMaxReturned: state => () => state.articleList.length > 9998,
}

