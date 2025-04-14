<template>
  <div style="margin-top:10px">
    <div class="ml-1">
      <ccte-help-text
        data-cy="ExecutiveSummaryHeader"
        label-type="h2"
        :heading-text="`Executive Summary`"
        help-key=""
      />
      <mdb-container fluid>
        <mdb-row>
          <mdb-col md="6">
            <Links :chemical-dtxsid="chemicalDtxsid" />
          </mdb-col>
          <mdb-col md="6">
            <section v-if="regionalScreeningData" title="Regional Screening" class="regionalScreening">
              <ccte-help-text
                data-cy="regionalScreening"
                label-type="h2"
                :heading-text="'Regional Screening'"
                help-key="EXEC Regional Screening"
              />
              <regional-screening />
            </section>
            <section v-if="physChemData" title="PhysChem Parameters" class="physChem">
              <ccte-help-text
                data-cy="physChem"
                label-type="h2"
                :heading-text="'PhysChem Parameters'"
                help-key="EXEC PhysChem Parameters"
              />
              <phys-chem />
            </section>
            <section v-if="showPodsSection" title="Dose Response Summary Value Plots" class="pt-4 mt-4">
              <ccte-help-text
                data-cy="doseResponsePlots"
                label-type="h2"
                :heading-text="'Dose Response Summary Value Plots'"
                help-key="EXEC Dose Response"
              />
              <Pods
                :width="width"
                :height="height"
                @onShowPods="showPods"
              />
              <graph-modal
                :graph="modalGraph"
                :visibility="showGraph"
                @toggleVisibility="showHideGraph"
              />
            </section>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col>
            <section v-if="bioactivityCount > 0" id="exec-summary-toxcast-plot" title="Toxcast Data">
              <ccte-help-text
                data-cy="TOXCAST-Header"
                label-type="h2"
                :heading-text="`Bioactivity - TOXCAST Summary`"
                help-key="SR ToxCast Graph"
              />
              <div class="embed-responsive embed-responsive-16by9 z-depth-1-half leftmargin">
                <div v-if="showPlotLoading" class="d-flex justify-content-center mt-5 loading-spinner">
                  <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
                <iframe
                  ref="plotlyPlot"
                  class="embed-responsive-item plotly-iframe"
                  :src="plotUrl"
                  frameborder="0"
                />
              </div>
            </section>
          </mdb-col>
        </mdb-row>
      </mdb-container>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import {
  mdbContainer, mdbCol, mdbRow,
} from 'mdbvue';
import RegionalScreening from '~/components/executiveSummary/RegionalScreening.vue';
import Links from '~/components/executiveSummary/Links.vue';
import PhysChem from '~/components/executiveSummary/PhysChem.vue';
import Pods from '~/components/executiveSummary/Pods.vue';
import GraphModal from '~/components/executiveSummary/GraphModal.vue';

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
  name: 'ExecutiveSummaryView',
  components: {
    PhysChem,
    RegionalScreening,
    Pods,
    GraphModal,
    Links,
    mdbContainer,
    mdbCol,
    mdbRow,
  },
  data() {
    return {
      active: 'executive-summary',
      width: 740,
      height: 560,
      modalGraph: 'plot',
      showGraph: false,
      showPodsSection: true,
      showToxcastPlot: true,
      showPlotLoading: false,
    };
  },
  computed: {
    ...mapState({
      activeChemical: state => state.results.activeChemical,
      physChemData: state => state.executiveSummary.physChemData,
      regionalScreeningData: state => state.executiveSummary.regionalScreeningData,
    }),
    ...mapGetters({
      toxcastShow: 'executiveSummary/getToxcastVisibility',
    }),
    plotUrl() {
      return `${process.env.APPLICATION_BIOACTIVITY_PLOT_URL}/plotSummary?dsstox_id=${this.activeChemical.dsstoxSubstanceId}&url_env=${process.env.APPLICATION_BASE_API}`;
    },
  },
  async asyncData(context) {
    try {
      await context.app.store.dispatch('executiveSummary/asyncRegionalScreening', context);
      await context.app.store.dispatch('executiveSummary/asyncExecSumLinks', context);
      await context.app.store.dispatch('executiveSummary/asyncPhysChem', context);
      await context.app.store.dispatch('executiveSummary/asyncOralPod', context);
      try {
        const bioactivityCount = await context.app.$repositories.bioactivity.count(context.params.id);
        return {chemicalDtxsid: context.params.id, bioactivityCount};
      } catch (err) {
        const bioactivityCount = 0;
        console.error(`ERROR-bioactivityCount ${err}`);
        return {chemicalDtxsid: context.params.id, bioactivityCount};
      }
    } catch (err) {
      console.error(`ERROR ${err}`);
    }
  },
  head() {
    return {
      title: `${this.activeChemical.preferredName} - Executive Summary`,
      meta: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      const iframe = this.$refs.plotlyPlot;
    });
  },
  methods: {
    showPods(val) {
      this.showPodsSection = val;
    },
    showHideGraph() {
      this.showGraph = this.showGraph === false;
    },
  },
};
</script>
<style lang="scss" scoped>
.regionalScreening {
  height: 500px;
}
.mainContainer {
  margin-bottom: -47rem;
}
</style>
