<template>
  <div style="margin-top:10px">
    <div class="h2 ml-5 pl-5">
      <ccte-help-text
        data-cy="PPRTV-Header"
        label-type="span"
        :heading-text="`Literature - Provisional Peer Reviewed Toxicity Values`"
        help-key="PPRTV-Header"
      />
    </div>

    <div class="row pr-4">
      <div class="col-sm-12">
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
          <iframe class="embed-responsive-item" :src="pprtvUrl" frameborder="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  name: 'PprtvView',
  data() {
    return {
      active: 'literature-pprtv',
    };
  },
  computed: {
    pprtvUrl() {
      if (this.linksData) {
        let pprtvLink = null;
        const baseUrl = 'https://cfpub.epa.gov/ncea/pprtv/documents/';
        this.linksData.Publications.map((item) => {
          if (item.paramType === 'pprtvweb_id') {
            const urlArr = item.url.split('/');
            const arrLength = urlArr.length - 1;
            pprtvLink = `${baseUrl}${urlArr[arrLength]}`;
          }
        });
        return pprtvLink;
      }
      return null;
    },
  },
  async asyncData(context) {
    try {
      const chemical = await context.app.store.state.results.activeChemical;
      const linksData = await context.app.$repositories.links.show(context.params.id);
      return {
        chemical,
        linksData,
      };
    } catch (err) {
      console.error(` ${err}`);
      return {chemical: null};
    }
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Provisional Peer Reviewed Toxicity Values`,
      meta: [],
    };
  },

};
</script>
