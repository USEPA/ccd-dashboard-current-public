<template>
  <div>
    <div class="row pr-4">
      <div class="col-sm-12 h2 pl-4">
        <ccte-help-text
          data-cy="PubChemArticlesHeader"
          label-type="span"
          heading-text="Literature - PubChem Articles"
          help-key="PubChemArticlesHeader"
        />
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-sm-12 h2">
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
          <iframe class="embed-responsive-item" :src="pubchemArticleUrl" frameborder="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

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
  name: 'PubChemArticlesView',
  data() {
    return {
      active: 'details',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    pubchemArticleUrl() {
      return `https://pubchem.ncbi.nlm.nih.gov/compound/${this.chemical.dtxsid}#section=Consolidated-References&embed=true`;
    },

  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Publications - PubChem Articles`,
      meta: [],
    };
  },
};
</script>
