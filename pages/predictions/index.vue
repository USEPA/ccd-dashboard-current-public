<template>
  <div class="container-fluid left-fullwidth-container content pt-1">
    <ccte-help-text
      data-cy="predictionsHeader"
      label-type="h1"
      :heading-text="`Predictions`"
      help-key="Predictions"
    />
    <client-only>
      <div class="mainContainer">
        <div class="row">
          <div class="col-9">
            <PredictionSearchBox />
            <div class="ketcherBlock">
              <Ketcher />
            </div>
          </div>
          <div class="col-3">
            <div class="selectPropBlock">
              <Provider :provider="providerData" />
              <button class="calculate btn btn-primary btn-sm" data-cy="calculateButton" @click="predict">
                Calculate
              </button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div v-if="predictionVisible" class="container-fluid left-fullwidth-container content">
              <Prediction />
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>
<script>
import {
  mapMutations,
} from 'vuex';
import Ketcher from '@/components/predictions/Ketcher.vue';
import PredictionSearchBox from '@/components/predictions/PredictionSearchBox.vue';
import Provider from '@/components/predictions/Provider.vue';
import Prediction from '@/components/predictions/Prediction.vue';

const appName = 'TESTPredictions';
function getModule() { return {module: appName + this._uid}; }

export default {
  name: 'PredictionsPage',
  components: {
    Ketcher,
    PredictionSearchBox,
    Provider,
    Prediction,
  },
  data() {
    return {
      prediction: [],
      predictionData: [],
      makePredictionVisible: false,
    };
  },
  computed: {
    predictionVisible() {
      return this.makePredictionVisible;
    },
  },
  methods: {
    ...mapMutations({
      setLoading: 'predictions/setLoading',
    }),
    predict(e) {
      this.setLoading(true);
      e.preventDefault();
      this.$store.dispatch('predictions/predict');
      this.makePredictionVisible = true;
    },
  },
  async asyncData(context) {
    const providerData = {
      categories: {
        Toxicological_properties: [],
        Physical_properties: [],
      },
    };
    try {
      const response = await fetch(`${process.env.APPLICATION_BASE_API}ccdapp1/webtest/metadata`);
      const selectPropertiesResult = await response.json();
      selectPropertiesResult[0].endpoints.forEach((item) => {
        if (item.category === 'Toxicological properties') {
          providerData.categories.Toxicological_properties.push(Object.assign(item, {selected: true}));
        } else {
          providerData.categories.Physical_properties.push(Object.assign(item, {selected: true}));
        }
      });
      providerData.name = selectPropertiesResult[0].name;
      providerData.code = selectPropertiesResult[0].code;
      return {providerData};
    } catch (err) {
      console.error(err);
    }
  },
  head() {
    return {
      title: 'Predictions',
      meta: [],
    };
  },
};
</script>
<style scoped lang="scss">
.mainContainer {
  padding: .1rem .1rem;
  margin: 0;
  .ketcherBlock {
    width: 99% !important;
    display: inline-block;
    padding-right: 1rem;
  }
  .selectPropBlock {
    width: 95% !important;
    display: inline-block;
   margin-top: 6rem !important;
  }
}
</style>
