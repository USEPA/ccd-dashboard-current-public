<template>
  <client-only>
    <div class="mr-4" style="margin-top:10px">
      <div class="h2">
        <ccte-help-text
          data-cy="abstractSifterHeader"
          label-type="span"
          heading-text="Literature - PubMed Abstract Sifter"
          help-key="PubMed Abstract Sifter"
        />
      </div>
      <mdb-accordion
        class="assayAccordion mr-3 mb-3"
        data-cy="accordion"
        table
        closed
      >
        <mdb-accordion-pane
          title="Abstract Sifter Instructions"
          class=" py-0 px-0 m-0"
          data-cy="accordionTitle"
          type="table"
          :is-open="detailsOpen"
          @pane-clicked="togglePane('detailsOpen')"
        >
          <div data-cy="accordionBody" style="font-size:12px;padding:10px">
            <p>The Abstract Sifter is an alternative front-end to PubMed.</p>

            <p>
              All you need to do is enter a query and click Retrieve Articles.
              (The query box is the white one under step 2.)
            </p>

            <p>
              To make things easier, we've put together some basic query language in advance.
              Take a look at the blue pull-down box to the left (labeled Choose Query Term) and browse the selections there.
              If you're coming to the Abstract Sifter via a chemical, we've supplied the chemical name,
              CASRN, and maybe a synonym in the query box.
              Selecting subject query terms in the pull-down will append that text to your chemical terms.
              Make any changes in the query box you need to before you submit by clicking on the
              blue button labeled Retrieve Articles.
            </p>

            <p>
              Once you click submit, the resulting citations from PubMed will
              be retrieved and inserted into the table below.  Now you can sift.
            </p>

            <p>
              Here's how to use the power of the Abstract Sifter by sifting:  enter a term or
              part of a term into the first sifter box.  The Sifter will automatically count the
              occurrences of that term in the title and abstract of the returned records and add a
              column to the table showing you that count.  Use the built-in column header sorting
              functionality to sort the records.  You can enter many sifter terms and change them
              as you explore the returned results.  Sifting is a fast way to find an
              article of interest.
            </p>

            <p>
              To read an abstract, click on a row. The abstract along with
              the title will be displayed in the space below the table.
              If the citation has sifter terms, they will be colorized for your reading enjoyment.
            </p>
            <p>
              Clicking on the hyperlink to PubMed will take you to the article there.
              Similarly, the DOI hyperlink will take you to the article at the journal site.
            </p>

            <p>
              If you would like to download a selection of citations, click on the button to the right labeled Send To.
              Choose a download format option or choose to send the PubMed IDs to PubMed
              to take advantage of their download options.
            </p>

            <p>
              If you like this sifting approach to document retrieval but want to spend more time working with the results,
              try the Excel version of the Abstract Sifter.
              You can download it by clicking on About at the top of your screen, then on Downloads,
              then Abstract Sifter. The Sifter download file comes with a very detailed User Guide and
              the ReadMe sheet in the Sifter has links to videos and publications.
              There's also information on how to contact us with questions or feedback.
            </p>
          </div>
        </mdb-accordion-pane>
      </mdb-accordion>

      <div class="toolbar mr-3 mb-1" data-cy="toolbarQuery">
        <div class="d-flex flex-row ">
          <div class="col-3 ">
            <span class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow" data-cy="icon1">
                1
              </strong>
            </span>
            <span style="font-size:12px" data-cy="instructionalText1">Select PubMed starting point query</span>
          </div>
          <div class="col-4">
            <span class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow" data-cy="icon2">
                2
              </strong>
            </span>
            <span style="font-size:12px" data-cy="instructionalText2">Optionally, enter any PubMed query or edit the query from step 1</span>
          </div>
          <div class="col-3">
            <span class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow" data-cy="icon3">
                3
              </strong>
            </span>
            <span style="font-size:12px" data-cy="instructionalText3">Click Retrieve Articles to begin download.</span>
          </div>
          <div class="col-2">
            <span class="fa-stack" style="font-size:10px">
              <span class="fa fa-circle fa-stack-2x" style="color:forestgreen" />
              <strong class="fa-stack-1x" style="color:snow" data-cy="icon4">
                4
              </strong>
            </span>
            <span style="font-size:12px" data-cy="instructionalText4">Optionally, export articles</span>
          </div>
        </div>
        <div class="d-flex flex-row ">
          <div class="col-3 ">
            <select id="m1" v-model="s1" class="form-control" data-cy="dropdownQueryTerms" @change="buildPhrase">
              <option
                v-for="option in m1Items"
                :key="option.id"
                data-cy="dropdownMenuItem"
                :selected="option.id === 0"
                :value=" option.id "
              >
                {{ option.label }}
              </option>
            </select>
            <QueryTermsList
              data-cy="selectedTermsList"
              :text-area-id="'userInput'"
              :selected-query-terms="selectedTerms"
              @removeTerm="removeTerm"
            />
          </div>
          <div class="col-4">
            <textarea
              id="userInput"
              data-cy="inputQueryText"
              placeholder="Some examples are: Fauci AS[au]
covid-19 spike protein
OECD AND qsar
migraine AND 2020[dp]
fipronil or 120068-37-3"
              class="form-control rounded-0"
              rows="4"
              :value="completedPhrase"
              @input="userInput($event.target.value)"
            />
            <div style="margin-top: 10px;">
              <button
                class="reset-query-btn btn btn-sm btn-primary mt-0"
                data-cy="buttonQueryReset"
                style="color:white!important"
                @click="resetPhrase"
              >
                Reset Query
              </button>
            </div>
          </div>

          <div class="col-3">
            <div>
              <button
                v-if="!loading"
                class="btn btn-sm btn-primary mt-0 "
                data-cy="buttonRetrieveArticles"
                style="color:white!important"
                @click="searchPubmed"
              >
                Retrieve Articles
              </button>
            </div>
            <div v-if=" articleCount > 0" class="ml-2" style="font-size:12px">
              <button
                v-if="loading"
                class="btn btn-sm btn-warning"
                data-cy="buttonCancel"
                @click="doCancelDownloads"
              >
                Cancel
              </button><br v-if="loading">
              <span v-if="!getMaxReturned()">
                <i v-if="loading" class="fas fa-cog fa-spin" />
                {{ getReturnedCount() }} of {{ articleCount }} articles loaded
              </span>
            </div>
          </div>
          <div class="col-2">
            <mdb-dropdown
              id="export-detail-btn"
              data-cy="buttonExport"
            >
              <mdb-dropdown-toggle
                slot="toggle"
                style="padding: 7px 12px !important;"
                class="btn-primary text-white"
                size="sm"
              >
                <mdb-icon icon="download" />  Send To
              </mdb-dropdown-toggle>
              <mdb-dropdown-menu>
                <h6 class="dropdown-header">
                  Export
                </h6>
                <mdb-dropdown-item
                  @click="onExportData('csv')"
                >
                  CSV (.csv)
                </mdb-dropdown-item>
                <mdb-dropdown-item
                  @click="onExportData('xlsx')"
                >
                  Excel (.xlsx)
                </mdb-dropdown-item>
                <div class="dropdown-divider" />
                <h6 class="dropdown-header">
                  Send To
                </h6>
                <mdb-dropdown-item
                  @click="sendToPubmed()"
                >
                  Send selected to PubMed
                </mdb-dropdown-item>
              </mdb-dropdown-menu>
            </mdb-dropdown>
          </div>
        </div>
      </div>

      <div v-if="needsSelection" class="mr-3 mb-1 alert alert-danger" role="alert">
        Please select articles to send to PubMed.
      </div>

      <div class="d-flex flex-row mt-0 mr-3">
        <div v-show="articleCount > 0" class="col-12 toolbar ">
          <div style="font-size:12px" class="mb-1">
            To find articles quickly, enter terms and press [RETURN] to sift abstracts.
          </div>
          <SiftTerms
            v-if="articleCount > 0"
          />
        </div>
      </div>

      <div class="mr-3">
        <abstract-grid
          v-show="articleCount > 0"
          data-cy="resultsGrid"
          :cname="cname"
          grid-reference="summary"
          :grid-heading="tableHeader"
          :grid-size="gridSize"
          :config-obj="gridConfigurationObj"
          @cellClicked="onGridClick"
          @gridRef="onGridRef"
        />
      </div>
      <div v-if="loadError" class="mr-3" data-cy="noRecordsMessage">
        No records found matching this criteria.
      </div>
      <div class="mr-3 mt-1">
        <Abstract
          data-cy="abstract"
          :article="currentArticle"
        />
      </div>
    </div>
  </client-only>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import escapeString from 'escape-string-regexp';
import {
  mapGetters, mapMutations, mapState,
} from 'vuex';
import {
  mdbContainer,
  mdbAccordion,
  mdbAccordionPane,
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbIcon,
} from 'mdbvue';
import AbstractGrid from '~/components/grids/AbstractSifterGrid.vue';
import Abstract from '~/components/abstractSifter/Abstract.vue';
import SiftTerms from '~/components/abstractSifter/SiftTerms.vue';
import sifterData from '~/assets/fixtures/abstractSifter.json';
import QueryTermsList from '~/components/abstractSifter/QueryTermsList.vue';


export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (currentChem.dtxsid === data.params.id || currentChem.dtxcid === data.params.id) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical', data, data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'AbstractSifter',
  components: {
    AbstractGrid,
    Abstract,
    QueryTermsList,
    SiftTerms,
    mdbAccordion,
    mdbAccordionPane,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbIcon,
  },

  data() {
    return {
      active: 'literature',
      s1: 0,
      sendToOption: 0,
      currentArticle: null,
      detailsOpen: false,
      chemicalPhrase: '',
      categoryPhrase: '',
      userPhrase: '',
      completedPhrase: '',
      completedPhraseOnLoad: '',
      cname: {
        camelName: 'sifter',
        hyphenName: 'sifter',
        baseName: 'Sifter',
      },
      gridConfigurationObj: {},
      tableHeader: '',
      gridSize: 'height:400px;width:100%; overflow:auto',
      gridApi: null,
      columnApi: null,
      termCols: [],
      selectedTerms: [],
      exportColDefs: [],
      sqlOperators: [
        'ALL', 'AND', 'ANY', 'BETWEEN', 'EXISTS', 'IN',
        'LIKE', 'NOT', 'OR', 'SOME', '+', '-', '*', '/',
        '%', '&', '|', '^', '=', '>', '<', '>=', '<>', '+=',
        '-=', '*=', '/=', '%=', '&=', '^-=', '|*=',
      ],
      needsSelection: false,
    };
  },

  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
      articleCount: state => state.abstractSifter.articleCount,
      loadError: state => state.abstractSifter.error,
      articleList: state => state.abstractSifter.articleList,
      articleChunk: state => state.abstractSifter.articleChunk,
      terms: state => state.abstractSifter.terms,
      colors: state => state.abstractSifter.colors,
      lastTermAdded: state => state.abstractSifter.lastTermAdded,
      loading: state => state.abstractSifter.loading,
    }),
    ...mapGetters({
      getActiveChemical: 'results/getActive',
      getGridDefs: 'abstractSifter/getGridDefs',
      getExportColDefs: 'abstractSifter/getExportColDefs',
      getAllArticles: 'abstractSifter/getAllArticles',
      getArticleChunk: 'abstractSifter/getArticleChunk',
      getReturnedCount: 'abstractSifter/getReturnedCount',
      getMaxReturned: 'abstractSifter/getMaxReturned',
    }),
    m1Items() {
      const m1 = sifterData.filter(obj => obj.parent_id === 0);
      m1.unshift({id: 0, label: 'Choose Query Term'});
      return m1;
    },
    currenRowCount() {
      if (this.gridApi) {
        return this.gridApi.getDisplayedRowCount();
      }
      return 0;
    },
  },
  watch: {
    articleChunk(n, o) {
      this.gridApi.applyTransaction({add: this.getArticleChunk()});
    },
    terms(n) {
      if (this.terms.length <= 2) {
        this.columnApi.setColumnVisible('totalCol', false);
      }
      for (let c = 0; c < 10; c += 1) {
        const tc = `term_${c}`;
        if (this.terms[c] && this.terms[c].text !== '') {
          this.columnApi.setColumnVisible(tc, true);
        } else {
          this.columnApi.setColumnVisible(tc, false);
        }
      }
      this.gridApi.refreshHeader();
    },
    completedPhrase(newVal, oldVal) {
      // Remove terms from list if modified
      this.selectedTerms = this.selectedTerms.filter(term => newVal.includes(this.getPhraseText(term.id)));

      // Change selected option if removed on user input
      if (!this.selectedTerms.some(term => term.id === this.s1)) {
        this.s1 = 0;
      }

      // This will trim and show placeholder text if the text area is empty but contains only spaces
      if (!newVal?.trim()) {
        this.completedPhrase = this.completedPhrase.trim();
      }
    },
    lastTermAdded: {

      handler(newTerm) {
        if (this.terms.length === 0) { return; }

        if (this.terms.length > 2) {
          this.columnApi.setColumnVisible('totalCol', true);
        } else {
          this.columnApi.setColumnVisible('totalCol', false);
        }

        const termSet = `term_${newTerm.index}`;
        this.gridApi.getColumnDef(termSet).headerName = newTerm.term;
        this.gridApi.getColumnDef(termSet).cellStyle = {'background-color': this.colors[newTerm.index]};

        this.columnApi.setColumnVisible(termSet, true);
        this.columnApi.setColumnWidth(termSet, (newTerm.term.length * 8) + 30);
        this.gridApi.refreshHeader();
        const terms = this.terms.slice(0, this.terms.length - 1).map(t => t.text);
        const joinTerms = terms.map(t => escapeString(t)).reduce((acc, term) => `${acc}|${term}`);

        this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
          const text = `${rowNode.data.title} ${rowNode.data.abstract}`;
          const matches = text.match(RegExp(joinTerms, 'gi'));
          const total = matches ? matches.length : 0;
          const termsCount = terms.map(term => (matches ?
            matches
              .filter(match => match.toLowerCase() === term.toLowerCase()).length :
            0));
          const n = {...rowNode.data};
          for (let t = 0; t < this.terms.length - 1; t += 1) {
            n[termSet] = termsCount[t];
          }
          n.totalCol = total;
          rowNode.setData(n);
        });
        if (this.terms.length === 2) {
          this.columnApi.applyColumnState({state: [{colId: 'term_0', sort: ''}]});
          this.columnApi.applyColumnState({state: [{colId: 'term_0', sort: 'desc'}]});
        }
      },
      deep: true,
    },

  },
  beforeMount() {
    this.exportColDefs = this.getExportColDefs();
    this.setArticleCount(0);
    this.gridConfigurationObj = {
      gridColumnDefs: this.getGridDefs(),
      gridData: [],
      defaultColDef: {
        filter: 'agTextColumnFilter',
        resizable: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        sortable: true,
        floatingFilter: true,
      },
      gridOptions: {
        components: {
          revCheck: this.revCheck,
          pubMedLink: this.pubMedLink,
          doiLink: this.doiLink,
        },
        suppressContextMenu: true,
        unSortIcon: true,
        rowHeight: 50,
        rowSelection: 'multiple',
        rowStyle: {fontSize: '11px', color: '#444'},

      },
    };
  },
  head() {
    return {
      title: `${this.getActiveChemical().preferredName}  - Publications -  Abstract Sifter`,
      meta: [],
    };
  },
  created() {
    this.completedPhrase = `"${this.chemical.casrn}" OR "${this.chemical.preferredName}"`;
    if (this.getActiveChemical().meshName) {
      this.completedPhrase = `("${this.getActiveChemical().casrn}" OR "${this.getActiveChemical().preferredName}" OR "${this.getActiveChemical().meshName}")`;
    }
    this.completedPhraseOnLoad = this.completedPhrase;
  },
  methods: {
    ...mapMutations({
      setCancel: 'abstractSifter/setCancel',
      setArticleCount: 'abstractSifter/setArticleCount',
      resetArticleList: 'abstractSifter/resetArticleList',
      clearTerms: 'abstractSifter/clearTerms',
      setError: 'abstractSifter/setError',
    }),
    togglePane(paneName) {
      this[paneName] = !this[paneName];
    },
    async searchPubmed() {
      this.gridApi.setRowData([]);
      this.resetArticleList();
      this.clearTerms();
      this.currentArticle = null;
      this.setError(false);
      await this.$store.dispatch('abstractSifter/getArticleCount', this.completedPhrase);
    },
    resetPhrase() {
      this.completedPhrase = this.completedPhraseOnLoad;
      this.selectedTerms = [];
      this.s1 = 0;
    },
    removeTerm(term) {
      this.selectedTerms = this.selectedTerms.filter(option => option.id !== term.id);
      this.sqlOperators.forEach((operator) => {
        const phraseTextToRemove = `${operator} ${this.getPhraseText(term.id)}`;
        // use lowercase incase user created case insensitive modifications
        const startingIdxOfPhraseToRemove = this.completedPhrase.toLowerCase().indexOf(phraseTextToRemove.toLowerCase());
        // use substring instead of replace to accomodate case insensitivity
        if (startingIdxOfPhraseToRemove !== -1) {
          this.completedPhrase = this.completedPhrase
            .substring(0, startingIdxOfPhraseToRemove - 1) +
            this.completedPhrase
              .substring(phraseTextToRemove.length + startingIdxOfPhraseToRemove);
        }
      });
      if (term.id === this.s1) {
        this.s1 = 0;
      }
    },
    onExportData(format) {
      const timeStamp = this.dateFormat();
      const fileName = `${this.cname.hyphenName}-${timeStamp}`;
      const params = {
        fileType: format,
        fileName: fileName,
        onlySelected: true,
      };
      if (params.fileType === 'csv') {
        this.gridApi.exportDataAsCsv(params);
      } else if (params.fileType === 'xlsx') {
        const exportConfig = {
          gridApi: this.gridApi, columns: this.exportColDefs, fileName: fileName, splitSheet: {xSplit: 1, ySplit: 1},
        };
        this.exportData(exportConfig);
      }
    },
    revCheck(params) {
      if (params.value) {
        return '✓';
      }
      return '';
    },
    pubMedLink(params) {
      return `<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/${params.value}">${params.value}</a>`;
    },

    doiLink(params) {
      return `<a target="_blank" href="https://doi.org/${params.value}">${params.value}</a>`;
    },

    doCancelDownloads() {
      this.setCancel(true);
    },

    sendToPubmed() {
      const selected = this.gridApi.getSelectedRows();
      if (selected.length < 1) {
        this.needsSelection = true;
        return;
      }
      this.needsSelection = false;

      const pmids = selected.reduce((acc, article) => `${acc} ${article.pmid}`, '');
      const encIds = encodeURIComponent(pmids);
      const pubMedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encIds}`;

      window.open(pubMedUrl, '_blank');
    },

    getPhraseText(id) {
      const foundObj = sifterData.find(obj => obj.id === id);
      return foundObj?.content?.trim();
    },
    buildPhrase(e) {
      if (Number.parseInt(e.target.value, 10) === 0) {
        return;
      }
      const item = this.m1Items
        .filter(option => option.id > 0)
        .find(option => option.id === Number.parseInt(e.target.value, 10));
      const isTermSelected = this.selectedTerms.some(term => term.id === item.id);
      if (!isTermSelected) {
        this.selectedTerms.push(item);
      }

      this.chemicalPhrase = `("${this.getActiveChemical().casrn}" OR "${this.getActiveChemical().preferredName}")`;
      if (this.getActiveChemical().meshName) {
        this.chemicalPhrase = `("${this.getActiveChemical().casrn}" OR "${this.getActiveChemical().preferredName}" OR "${this.getActiveChemical().meshName}")`;
      }

      this.categoryPhrase = !isTermSelected && Number.parseInt(this.s1, 10) !== 0 ?
        this.selectedTerms
          .map(term => `AND ${this.getPhraseText(term.id)}`)
          .join(' ') :
        this.categoryPhrase;
      this.completedPhrase = !isTermSelected ? `${this.chemicalPhrase} ${this.categoryPhrase}`.trim() : this.completedPhrase.trim();
    },
    userInput(textAreaValue) {
      this.completedPhrase = textAreaValue;
    },
    onGridClick(params) {
      this.currentArticle = params.data;
    },
    onGridRef(params) {
      this.gridApi = params.gridApi;
      this.columnApi = params.columnApi;
    },
  },

};
</script>
<style scoped>
#m1 {
      font-size:12px;
      padding:2px;
      background-color:#0e6993;
      color:white;
      font-family: "Roboto", sans-serif;
      outline:none;
    }

#m1 option{
  background-color:whitesmoke;
  color:#444;
}

#userInput{
  font-size:12px;
}

.totalYellow{
  background-color:yellow!important
}
.reset-query-btn {
  float: right;
}
:deep(.btn-primary.dropdown-toggle:hover), :deep(.btn-primary.dropdown-toggle:focus) {
  background-color: #0e6993 !important;
}
</style>
