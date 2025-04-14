<template>
  <div class="container-fluid pl-0 pr-0" style="margin-top: 2px">
    <div class="row h2 ml-0">
      <div class="col-sm-11">
        <ccte-help-text
          helptext-id="ChemicalDetailsHeader"
          cy-data=" ChemicalDetailsHeader"
          label-type="span"
          heading-text=" Chemical Details"
          help-key="ChemicalDetailsHeader"
        />
      </div>
    </div>
    <div class="row ml-1 p-0 justify-content-lg-start justify-content-xl-start">
      <div
        v-if="chemical.compoundId"
        class="m-0 pl-2 pr-2 gt-lrg-rm mr-3"
        style="margin-top: -30px"
      >
        <ChemicalImage
          :height="'400'"
          :large="true"
          :fluid="false"
          :border="true"
          :data="chemical"
        />
      </div>
      <div class="m-0 pl-0 gt-lrg" :style="containerStyle">
        <template>
          <div class="container-fluid content fullwidth-container pl-0 pr-3">
            <client-only>
              <mdb-accordion class="pr-1 mr-1" style="min-width: 98% !important" table>
                <mdb-accordion-pane
                  v-show="chemical.wikipediaName"
                  title="Wikipedia"
                  class="scalable"
                  type="table"
                  :is-open="wikiOpen"
                  @pane-clicked="togglePane('wikiOpen')"
                >
                  <div class="card-body">
                    <p
                      v-if="wikiComputed.summary.length > 0"
                      class="card-text ml-3 wiki"
                      data-cy="wikiText"
                      v-html="wikiComputed.summary"
                    />
                    <p
                      v-else
                      class="card-text ml-3"
                      data-cy="wikiText"
                      v-html="'No information found on Wikipedia'"
                    />
                  </div>
                </mdb-accordion-pane>
                <mdb-accordion-pane
                  title="Quality Control Notes"
                  class="scalable"
                  type="table"
                  data-cy="qcTabPane"
                  :is-open="qcOpen"
                  @pane-clicked="togglePane('qcOpen')"
                >
                  <div class="card-body pl-2">
                    <quality-control-notes :qc-notes="qcNotesComputed" />
                  </div>
                </mdb-accordion-pane>
                <mdb-accordion-pane
                  v-if="chemical.compoundId"
                  title="Intrinsic Properties"
                  class="scalable"
                  type="table"
                  :is-open="intPropsOpen"
                  @pane-clicked="togglePane('intPropsOpen')"
                >
                  <intrinsic-properties
                    class="animated fadeIn"
                    :is-markush="chemical.isMarkush"
                    :auto-open="true"
                    :mol_formula="chemical.molFormula"
                    :mol_weight="chemical.molWeight"
                    :monoisotopic_mass="chemical.monoisotopicMass"
                    :cid="chemical.compoundId"
                    :dtxsid="chemical.dtxsid"
                  />
                </mdb-accordion-pane>
                <mdb-accordion-pane
                  v-if="!chemical.isMarkush && chemical.compoundId"
                  class="scalable"
                  title="Structural Identifiers"
                  type="table"
                  :is-open="structIdOpen"
                  @pane-clicked="togglePane('structIdOpen')"
                >
                  <structural-identifiers
                    class="animated fadeIn"
                    :acd-iupac-name="chemical.acdIupacName"
                    :smiles="chemical.smiles"
                    :inchi="chemical.inchiString"
                    :inchi-key="chemical.inchiKey"
                    :inchi-key-skeleton="chemical.inchiKeySkeleton"
                  />
                </mdb-accordion-pane>

                <mdb-accordion-pane
                  v-if="!chemical.isMarkush && chemical.compoundId"
                  class="scalable"
                  title="Linked Substances"
                  type="table"
                  :is-open="linkedSubsOpen"
                  @pane-clicked="togglePane('linkedSubsOpen')"
                >
                  <linked-substances
                    :name="chemical.preferredName"
                    :inchi-key="chemical.inchiKey"
                    :gsid="chemical.genericSubstanceId"
                    :compound-id="chemical.compoundId"
                    :mol-formula="chemical.molFormula"
                    :smiles="chemical.smiles"
                    :chemical="chemical"
                    :ms-ready-mappings="chemical.msReadyMappings"
                    :similar-data="chemical.similarData"
                  />
                </mdb-accordion-pane>

                <mdb-accordion-pane
                  class=""
                  title="Presence in Lists"
                  type="table"
                  :is-open="listPresOpen"
                  @pane-clicked="togglePane('listPresOpen')"
                >
                  <list-presence :list-types="chemical.presenceInLists" />
                </mdb-accordion-pane>
                <mdb-accordion-pane
                  class=""
                  title="Record Information"
                  type="table"
                  :is-open="recordInfOpen"
                  @pane-clicked="togglePane('recordInfOpen')"
                >
                  <record-info
                    :dtxsid="chemical.dtxsid"
                    :description="chemical.qcLevelDesc"
                    :name="chemical.preferredName"
                  />
                </mdb-accordion-pane>
              </mdb-accordion>
            </client-only>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-else-return */
import {mapGetters, mapMutations} from 'vuex';
import {mdbAccordion, mdbAccordionPane} from 'mdbvue';
import ChemicalImage from '~/components/results/ChemicalImage.vue';
import QualityControlNotes from '~/components/chemical/details/QualityControlNotes.vue';
import IntrinsicProperties from '~/components/chemical/details/IntrinsicProperties.vue';
import StructuralIdentifiers from '~/components/chemical/details/StructuralIdentifiers.vue';
import LinkedSubstances from '~/components/chemical/details/LinkedSubstances.vue';
import ListPresence from '~/components/chemical/details/ListPresence.vue';
import RecordInfo from '~/components/chemical/details/RecordInfo.vue';

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (
        currentChem.dtxsid === data.params.id ||
        currentChem.dtxcid === data.params.id
      ) {
        return true;
      }
      const chem = await data.app.store.dispatch('results/asyncActiveChemical', data, data);
      if (!Array.isArray(chem)) {
        return true;
      }
      return false;
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'SelectedChemicalDetailsView',
  components: {
    ChemicalImage,
    mdbAccordion,
    mdbAccordionPane,
    QualityControlNotes,
    IntrinsicProperties,
    StructuralIdentifiers,
    LinkedSubstances,
    ListPresence,
    RecordInfo,
  },
  data() {
    return {
      chemical: {},
      wiki: {
        summary: '',
        loading: true,
        header: '',
      },
      wikiShow: false,
      wikiOpen: false,
      qcOpen: false,
      intPropsOpen: true,
      structIdOpen: false,
      linkedSubsOpen: false,
      listPresOpen: false,
      recordInfOpen: false,
      similarData: null,
      now: '',
      containerStyle: 'min-width: 70% !important',
    };
  },
  computed: {
    ...mapGetters({
      getChemicals: 'results/getChemicals',
      getSingle: 'results/getSingle',
      getActive: 'results/getActive',
    }),
    computedChemical() {
      return this.getActive();
    },
    getSimilarData() {
      return this.chemical.similarData || 'no';
    },
    isMarkush() {
      return this.chemical.isMarkush;
    },
    qcNotesComputed() {
      if (this.chemical.qcNotes) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.qcOpen = true;
        return this.chemical.qcNotes;
      }
      return '';
    },
    level() {
      return `Level ${this.chemical.qc}: ${this.chemical.qcDesc}`;
    },
    wikiComputed() {
      return this.wiki;
    },
    getWikiLink() {
      return `<a href='https://en.wikipedia.org/wiki/${this.chemical.wikipediaName}' target='_blank'>Read more</a>`;
    },
  },
  head(context) {
    if (!this.chemical) {
      return {
        title: 'Data Exception - Chemical Details',
        meta: [
          {
            hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Details`,
            name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} Chemical Details`,
            content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  Chemical Details`,
          },
        ],
      };
    }
    return {
      title: `${this.chemical.preferredName} - Chemical Details`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} ${this.chemical.preferredName} Chemical Details`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName} Chemical Details`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}  ${this.chemical.preferredName} Chemical Details - ${this.wikiComputed.header}`,
        },
      ],
      script: [
        {
          src: '/dashboard/scripts/dygraph.min.js',
        },
      ],
    };
  },
  created() {
    try {
      const soStr = this.$store.state.searchedOn.chemicalSearchedOnStr;
      this.chemical = this.$store.state.results.activeChemical;
      if (soStr.length > 5) {
        this.chemical.searchedOnStr = soStr;
      }
    } catch (err) {
      console.error(`ERROR CALLING chemical-details ${err}`);
    }
  },
  mounted() {
    this.listPresOpen = !this.chemical.compoundId;
    this.containerStyle = !this.chemical.compoundId ?
      'min-width: 98% !important' :
      'min-width: 70% !important';
    if (!this.chemical.wikipediaName) {
      this.wiki.loading = false;
    } else {
      const params = {
        action: 'query',
        prop: 'extracts',
        format: 'json',
        exintro: '',
        titles: this.chemical.wikipediaName,
        indexpageids: '',
        exchars: 500,
        redirects: 'resolve',
        origin: '*',
      };
      const paramString = this.makeUrlParams(params);

      fetch(`https://en.wikipedia.org/w/api.php?${paramString}`, {
        method: 'POST',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          this.wiki.loading = false;
          return null;
        })
        .then((result) => {
          if (result) {
            try {
              const pageId = result.query.pageids[0];
              const page = result.query.pages[pageId];
              const searchTerm = '...';
              const endSubStr =
                page.extract.lastIndexOf(searchTerm) > 50 ?
                  page.extract.lastIndexOf(searchTerm) :
                  page.extract.length + 1;
              this.wiki.header = `${page.extract
                .substring(0, endSubStr)
                .replace(/(<([^>]+)>)/gi, '')}`;
              this.wiki.summary = `${page.extract
                .substring(0, endSubStr)
                .replaceAll('<br />', '')
                .replaceAll('<br>', '')} ${this.getWikiLink}`;

              this.wikiOpen = true;
              this.wikiShow = true;
            } catch (error) {
              this.wiki.loading = false;
              console.error('error in wiki call');
            }
          }
        });
    }
  },
  methods: {
    ...mapMutations({
      setActiveChemical: 'results/setActiveChemical',
    }),
    togglePane(paneName) {
      if (this[paneName]) {
        this[paneName] = false;
      } else {
        this[paneName] = true;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

.md-accordion {
  margin-top: 0.1rem;
  .card {
    position: inherit !important;
    margin-top: 0px;
    margin-bottom: 5px !important;
    min-width: 70%;
    .card-header {
      border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
      background-color: $blue-lighten-3 !important;
      padding: 0.5rem 1.5rem !important;
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      h5 {
        background-color: $blue-lighten-3 !important;
        color: white !important;
        font-size: 1rem;
        font-weight: 400;
      }
    }
    .collapse-item.card-body {
      margin-bottom: 0.2rem;
      padding: 0.3rem !important;
      min-width: 70%;
      .row {
        height: 40px !important;
      }
      .ml-3 {
        margin-bottom: 0.2rem !important;
        height: fit-content;
      }
      .wiki {
        min-height: 5rem;
        height: max-content !important;
        overflow-y: visible !important;
        overflow: visible !important;
      }
    }
  }
  .scalable {
    margin-top: 0px;
    margin-bottom: 5px !important;
    .card-header {
      border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
      background-color: $blue-lighten-3 !important;
      padding: 0.5rem 1.5rem !important;
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      h5 {
        background-color: $blue-lighten-3 !important;
        color: white !important;
        font-size: 1rem;
        font-weight: 400;
      }
    }
    .collapse-item.card-body {
      margin-bottom: 0.2rem;
      padding: 0.3rem !important;
      height: max-content !important;
      overflow-y: visible !important;
      .row {
        height: 40px !important;
      }
      .ml-3 {
        margin-bottom: 0.2rem !important;
        height: fit-content;
      }
    }
  }
}
.col-lg-12 {
  flex: 0 0 100%;
  max-width: 100%;
}
.col-sm-10 {
  flex: 0 0 85% !important;
  max-width: 89% !important;
}
@media (min-width: 1551px) {
  .gt-lrg {
    display: block;
    max-width: 100% !important;
  }
}
@media (max-width: 1250px) {
  .gt-lrg {
    display: block;
    max-width: 90% !important;
  }

  .gt-lrg-rm {
    display: none;
  }
}

@media (max-width: 980px) {
  .gt-lrg-rm {
    display: block;
  }
}
</style>
