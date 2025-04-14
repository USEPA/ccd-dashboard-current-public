<template>
  <div>
    <div class="row pr-4">
      <div class="col-sm-12 h2 pl-4">
        <ccte-help-text
          data-cy="GHSDataHeader"
          label-type="span"
          :heading-text="`Safety - GHS Data`"
          help-key="GHSDataHeader"
        />
        <a :href="ghsDataUrl" target="_blank">
          <mdb-btn outline="info" size="sm" role="button">
            Print Page
          </mdb-btn>
        </a>
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-sm-12 h2">
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
          <iframe class="embed-responsive-item" :src="ghsDataUrl" frameborder="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
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
  name: 'GhsDataView',
  components: {
    mdbBtn,
  },
  data() {
    return {
      active: 'toxicity-values',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    ghsDataUrl() {
      return `https://pubchem.ncbi.nlm.nih.gov/compound/${this.chemical.inchiKey}#section=GHS-Classification&fullscreen=true`;
    },
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - GHS Data`,
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
