const parseArticleXML = (el) => {
  let temp,
    title,
    journal,
    authors,
    volume,
    pmid,
    issue,
    pages,
    doi,
    label,
    review,
    selected,
    year,
    abstract;
  try {
    if (el.querySelector('ArticleTitle')) {
      pmid = parseInt(el.querySelector('PMID').textContent, 10);
      volume = (el.querySelector('Volume')) ? el.querySelector('Volume').textContent : '-';
      issue = (el.querySelector('Issue')) ? el.querySelector('Issue').textContent : '-';
      pages = (el.querySelector('Pagination')) ? el.querySelector('Pagination MedlinePgn').textContent : '-';
      doi = (el.querySelector("ArticleId[IdType='doi']")) ? el.querySelector("ArticleId[IdType='doi']").textContent : '-';

      if (el.querySelector('PubMedPubDate[PubStatus="pubmed"] Year')) {
        year = parseInt(el.querySelector('PubMedPubDate[PubStatus="pubmed"] Year').textContent, 10);
      } else { year = ''; }
      temp = el.querySelector('ArticleTitle');
      if (temp) {
        title = temp.textContent;
      }
      abstract = Array.prototype.slice.call(el.querySelectorAll('AbstractText')).map((a) => {
        label = a.attributes.length ? a.attributes.getNamedItem('Label').value : null;
        return label ? `<strong>${label}:</strong> ${a.textContent}` : a.textContent;
      }).join('<br/>') || 'No abstract available';
      temp = el.querySelector('Journal Title');
      if (temp) {
        journal = temp.textContent;
      } else {
        journal = `[Book] ${el.querySelector('BookTitle').textContent}`;
      }
      authors = Array.prototype.slice.call(el.querySelectorAll('Author LastName')).map(a => a.textContent).join('; ');
      review = el.querySelector('PublicationType[UI="D016454"]') !== null;
      selected = false;

      return {
        pmid,
        year,
        title,
        abstract,
        journal,
        authors,
        review,
        selected,
        doi,
        volume,
        issue,
        pages,
      };
    }
    if (el.querySelector('BookTitle')) {
      pmid = parseInt(el.querySelector('PMID').textContent, 10);
      volume = (el.querySelector('Volume')) ? el.querySelector('Volume').textContent : '-';
      issue = (el.querySelector('Issue')) ? el.querySelector('Issue').textContent : '-';
      pages = (el.querySelector('Pagination')) ? el.querySelector('Pagination MedlinePgn').textContent : '-';
      doi = (el.querySelector("ArticleId[IdType='doi']")) ? el.querySelector("ArticleId[IdType='doi']").textContent : '-';

      temp = el.querySelector('PubMedPubDate[PubStatus="pubmed"] Year');
      if (temp) {
        year = parseInt(el.querySelector('PubMedPubDate[PubStatus="pubmed"] Year').textContent, 10);
      } else { year = ''; }
      temp = el.querySelector('Year');
      if (temp) {
        year = parseInt(temp.textContent, 10);
      } else { year = ''; }
      temp = el.querySelector('ArticleTitle');
      if (temp) {
        title = temp.textContent;
      } else {
        title = `[Book] ${el.querySelector('BookTitle').textContent}`;
      }
      abstract = Array.prototype.slice.call(el.querySelectorAll('AbstractText')).map((a) => {
        label = a.attributes.length ? a.attributes.getNamedItem('Label').value : null;
        return label ? `<strong>${label}:</strong> ${a.textContent}` : a.textContent;
      }).join('<br/>') || 'No abstract available';
      temp = el.querySelector('Journal Title');
      if (temp) {
        journal = temp.textContent;
      } else {
        journal = `[Book] ${el.querySelector('BookTitle').textContent}`;
      }
      temp = el.querySelector('CollectiveName');
      if (temp) {
        authors = temp.textContent;
      } else {
        authors = Array.prototype.slice.call(el.querySelectorAll('Author LastName')).map(a => a.textContent).join('; ');
      }
      review = el.querySelector('PublicationType[UI="D016454"]') !== null;
      selected = false;

      return {
        pmid,
        year,
        title,
        abstract,
        journal,
        authors,
        review,
        selected,
        doi,
        volume,
        issue,
        pages,
      };
    }
  } catch (e) {
    console.error('error in parseArticleXML: ', e);
    return {
      pmid,
      year,
      title,
      abstract,
      journal,
      authors,
      review,
      selected,
      doi,
      volume,
      issue,
      pages,
    };
  }
};

export default {
  async getArticleCount(vuexContext, queryPhrase) {
    let errorObj = {};
    try {
      const params = `?retmode=json&db=pubmed&term=${queryPhrase}&usehistory=y`;
      const q = encodeURI(params);
      const response = await this.$repositories.pubmedSearch.index(q);

      if (response.esearchresult.count == 0) {
        vuexContext.commit('setError', true);
      }
      vuexContext.commit('setWebenv', response.esearchresult.webenv);
      vuexContext.commit('setQuerykey', response.esearchresult.querykey);
      vuexContext.commit('setArticleCount', response.esearchresult.count);
      vuexContext.dispatch('getArticles');
      return 1;
    } catch (e) {
      console.error(e);
      if (e.response && (e.response.status !== 404)) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },

  async getArticles(vuexContext) {
    let errorObj = {};
    const chunks = Math.ceil(parseInt(vuexContext.state.articleCount, 10) / parseInt(vuexContext.state.returnMax, 10));
    let start = 0;

    try {
      /* eslint-disable no-await-in-loop */
      vuexContext.commit('setLoading', true);
      for (let index = 0; index < chunks; index++) {
        if (vuexContext.state.cancel) { break; }
        if (start < 9801) {
          const params = `?db=pubmed&WebEnv=${vuexContext.state.webEnv}&query_key=${vuexContext.state.queryKey}&rettype=xml&retmode=datamode&retstart=${start}&retmax=${vuexContext.state.returnMax}`;
          const q = encodeURI(params);
          const response = await this.$repositories.pubmedFetch.index(q);

          const articleData = (new window.DOMParser()).parseFromString(response, 'text/xml');
          const articlesXML = Array.prototype.slice.call(articleData.querySelectorAll('PubmedArticleSet > *'));
          const articleChunk = articlesXML.map(parseArticleXML);
          start += vuexContext.state.returnMax;

          vuexContext.commit('setArticleChunk', articleChunk);
          vuexContext.commit('addArticleList', articleChunk);
        }
      }
      vuexContext.commit('setLoading', false);
      vuexContext.commit('setCancel', false);
    } catch (e) {
      console.error(e);
      if (e.response && (e.response.status !== 404)) {
        errorObj = {
          status: e.response,
        };
      } else {
        errorObj = e;
      }
    }
  },


};
