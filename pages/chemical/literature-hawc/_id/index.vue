<template>
  <div>
    <div class="row pr-4">
      <div class="col-sm-12 h2">
        <ccte-help-text
          data-cy="HAWC-Header"
          label-type="span"
          :heading-text="`HAWC Assessment`"
          help-key="HAWC-Header"
        />
      </div>
    </div>
    <div class="row pr-4">
      <div class="col-sm-12">
        <h3 class="text-bold">
          EPA Health Assessment Workspace Collaborative (HAWC)
        </h3>
        <p>
          Researchers and regulatory agencies around the world conduct assessments to determine the potential for chemicals and other pollutants to pose a risk to human health and the environment. These assessments typically consist of a critical review of available studies, identification of health and environmental effects, and characterization of exposure-response relationships and uncertainties in the data. EPA HAWC aims to facilitate team collaboration by scientists who develop these assessments and enhance transparency of the assessment process by providing online access to the data and expert decisions used to evaluate the potential health and environmental hazard and risk of chemical exposures.
        </p>
        <p>
          EPA HAWC is an interactive, expert-driven, content management system for EPA health and environmental risk assessment programs that is intended to promote transparency, data usability, and understanding of the data and decisions supporting health and environmental assessments. Specifically, EPA HAWC is an application that allows the data and decisions supporting an assessment to be evaluated and managed in modules (e.g., study evaluation, summary study data) that can then be publicly accessed online.
        </p>
        <div v-for="item in hawcUrls" :key="item.paramType" class="external-link">
          <a
            :href="item.url"
            :alt="`external link to HAWC ${item.description}`"
            :title="`external link to HAWC ${item.description}`"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ item.name }}
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
  name: 'HawcView',
  components: {
    mdbIcon,
  },
  data() {
    return {
      active: 'literature',
    };
  },
  computed: {
    hawcUrls() {
      const hawcLinks = [];
      if (this.linksData) {
        this.linksData.Publications.forEach((item) => {
          if (item.paramType.includes('hawc_id') && item.visible) {
            hawcLinks.push(item);
          }
        });
      }
      if (hawcLinks.length > 0) {
        return hawcLinks;
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
      title: `${this.activeChemical.preferredName} - Publications -  HAWC`,
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
