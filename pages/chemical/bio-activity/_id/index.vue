<template>
  <div>
    <div class="row pr-4">
      <div class="col-sm-12 h2 pl-4">
        <ccte-help-text
          data-cy="BioactivityPubChemBiologicalActivities"
          label-type="span"
          :heading-text="`Bioactivity - PubChem Biological Activities`"
          help-key="Bioactivity PubChem Biological Activities Header"
        />
        <a :href="pubchemDataUrl" target="_blank">
          <mdb-btn outline="info" size="sm" role="button">
            Print Page
          </mdb-btn>
        </a>
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-sm-12 h2">
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
          <iframe
            class="embed-responsive-item"
            :src="pubchemDataUrl"
            frameborder="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mdbBtn} from 'mdbvue';

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
  name: 'ToxcastSummaryView',
  components: {
    mdbBtn,
  },
  data() {
    return {
      active: 'invitrodb',
    };
  },
  computed: {
    pubchemDataUrl() {
      return `https://pubchem.ncbi.nlm.nih.gov/compound/${this.chemical.pubchemCid}#section=BioAssay-Results&embed=true&hide_title=true`;
    },
  },
  async asyncData(context) {
    try {
      const chemical = await context.app.store.state.results.activeChemical;
      return {chemical};
    } catch (err) {
      console.error(`${err}`);
    }
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Chemical Activity Summary`,
      meta: [],
    };
  },

};
</script>
<style lang="scss">
.leftmargin {
  margin-left: .5rem;

}
</style>

