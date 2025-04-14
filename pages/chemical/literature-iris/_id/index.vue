<template>
  <div>
    <div class="row pr-4">
      <div class="col-sm-12 h2">
        <ccte-help-text
          data-cy="IRIS-Header"
          label-type="span"
          :heading-text="`Literature - IRIS`"
          help-key="IRIS-Header"
        />
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-sm-12">
        <h3>
          Integrated Risk Information System (IRIS):
        </h3>
        <p>
          EPA's mission is to protect human health and the environment. EPA's IRIS Program supports this mission by identifying and characterizing the health hazards of chemicals found in the environment. Each IRIS assessment can cover a chemical, a group of related chemicals, or a complex mixture. IRIS assessments are an important source of toxicity information used by EPA, state and local health agencies, other federal agencies, and international health organizations.
        </p>
        <div class="external-link">
          <a
            :href="irisUrl"
            aria-labelledby="external link to IRIS data"
            title="external link to IRIS data"
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit iris.epa.gov
            <mdb-icon size="sm" class="pl-1 super" icon="external-link-alt" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mdbIcon,
} from 'mdbvue';
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
  name: 'IrisView',
  components: {
    mdbIcon,
  },
  data() {
    return {
      active: 'literature',
    };
  },
  computed: {
    irisUrl() {
      let url = null;
      if (this.linksData) {
        this.linksData.Publications.forEach((item) => {
          if (item.paramType === 'iris_id') {
            url = item.url;
          }
        });
      }
      if (url) {
        return url;
      }
      return false;
    },
    ...mapState({
      activeChemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
    try {
      const linksData = await context.app.$repositories.links.show(context.params.id);
      return {linksData};
    } catch (err) {
      console.error(` ${err}`);
    }
    return false;
  },
  head() {
    return {
      title: `${this.activeChemical.preferredName} - Publications -  Iris`,
      meta: [],
    };
  },

};
</script>

<style type="text/css">
.external-link {
  margin-left: 5rem;
}
</style>
