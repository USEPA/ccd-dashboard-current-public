<template>
  <div>
    <div class="row pr-4">
      <div class="col-sm-12 h2 pl-4">
        <ccte-help-text
          data-cy="ToxicsReleaseInventory"
          label-type="span"
          :heading-text="`Exposure - Toxics Release Inventory`"
          help-key="ToxicsReleaseInventoryHeader"
        />
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-sm-12 h2">
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
          <iframe class="embed-responsive-item" :src="triUrl" frameborder="0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

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
  name: 'ToxicsReleaseInventoryView',
  data() {
    return {
      active: 'toxics-release-inventory',
      html: '',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    triUrl() {
      let id = this.chemical.trireleaseIdentifier || 1;
      id = id.padStart(10, '0');

      return `${process.env.TOXICS_RELEASE_INVENTORY_BASE_URL}/triexplorer/chemical.html?pLoc=${id}&pYear=2019&pParent=TRI&pDataSet=TRIQ1&pPrint=1`;
    },
  },
  created() {
  //   fetch(this.triUrl).then(response =>
  //   // The API call was successful!
  //  response.text()).then((html) => {
  //     // This is the HTML from our response as a text string
  //     this.html = html
  //     console.log(html)
  //   }).catch((err) => {
  //     // There was an error
  //     console.warn('Something went wrong.', err)
  //   })
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Toxics Release Inventory`,
      meta: [],
    };
  },

};
</script>
