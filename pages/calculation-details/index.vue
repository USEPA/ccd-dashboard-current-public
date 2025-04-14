<template>
  <div v-if="chemical">
    <client-only>
      <div class="container-fluid left-fullwidth-container content pt-3">
        <image-zoom-modal />
        <h2 class="ml-2 text-center w-100">
          OPERA Model Calculation Details: {{ operaData.modelTitle }}
        </h2>
        <div v-if="chemical.dtxsid" class="row content-chemical mr-0  pb-0 mb-0">
          <div class="col-sm-12 pl-1 pr-2">
            <chemical-header
              :chemical="chemical"
              :error-msg="errorMsg"
              :hide-image="true"
              :hide-searchedby="true"
            />
          </div>
        </div>
        <div class="row content-chemical mr-0 pb-0 mb-0">
          <div class="col-sm-12 pl-0 pr-0 d-flex justify-content-center">
            <button class="btn btn-sm btn-outline-info mt-1 px-2 py-1" @click="print">
              <span class="icon"><i class="fa fa-file-pdf-o" /></span>
              <span>Print PDF</span>
            </button>
          </div>
        </div>
        <div class="row content-chemical mr-0 pb-0 mb-0">
          <div class="col pl-0 pr-0" style="min-width: 216px; max-width: 216px;">
            <div v-if="chemical.dtxsid" id="thumbnailImg" class="headerThumbnail pl-3 pr-1" style="float: left;">
              <ChemicalImage :height="'200'" :small="true" :border="true" :data="chemical" />
            </div>
          </div>
          <div class="col pl-1 pr-0" style="height: 100%; width: 100%;">
            <div class="row mr-1">
              <div class="col-6 pl-2 pr-0">
                <div class="card" style="height: 195px;">
                  <div class="card-header bg-dark text-white font-weight-bolder p-1 pl-2">
                    Chemical Identifiers
                  </div>
                  <div class="card-body font-weight-normal">
                    <div>
                      <span class="font-weight-bold">Preferred Name:</span>
                      <span>{{ operaData.preferredName }} </span>
                    </div>
                    <div>
                      <span class="font-weight-bold">DTXSID:</span>
                      <span>{{ operaData.dtxsid }} </span>
                    </div>
                    <div>
                      <span class="font-weight-bold">DTXCID:</span>
                      <span>{{ operaData.dtxcid }} </span>
                    </div>
                    <div>
                      <span class="font-weight-bold">CASRN:</span>
                      <span>{{ operaData.casrn }} </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col pl-2 pr-0">
                <div class="card" style="height: 195px;">
                  <div class="card-header bg-dark text-white font-weight-bolder p-1 pl-2">
                    Model Results
                  </div>
                  <div class="card-body font-weight-normal">
                    <div>
                      <span>Predicted value:</span>
                      <span>{{ ncctRound(operaData.modelResults.predicted) }} </span>   <span class="pl-1">{{ operaData.modelResults.standardUnit }}</span>
                    </div>
                    <div v-if="operaData.modelResults.experimental">
                      <span>Experimental value:</span>
                      <span>{{ ncctRound(parseFloat(operaData.modelResults.experimental)) }} </span>   <span class="pl-1">{{ operaData.modelResults.standardUnit }}</span>
                    </div>
                    <div>
                      <span class="info" :title="operaData.modelResults.msgs.globalTitle">Global applicability domain:</span>
                      <span class="globalApplicability" :class="{inside: operaData.modelResults.global}">
                        {{ operaData.modelResults.global ? 'Inside' : 'Outside' }}
                      </span>
                    </div>
                    <div>
                      <span class="info" :title="operaData.modelResults.msgs.localTitle">Local applicability domain index:</span>
                      {{ ncctRound(operaData.modelResults.local) }}
                    </div>
                    <div>
                      <span class="info" :title="operaData.modelResults.msgs.confidenceTitle">Confidence level:</span>
                      {{ ncctRound(operaData.modelResults.confidence) }}
                    </div>
                    <div>
                      <span class="info">Opera Version:</span>
                      {{ operaData.modelDetails.source }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <opera-performance :opera-data="operaData" />
          </div>
        </div>
        <opera-neighbors :opera-data="operaData.nearestNeighbors" />
      </div>
    </client-only>
  </div>
</template>

<script>
import {
  mapGetters, mapActions,
} from 'vuex';

import ChemicalHeader from '~/components/headers/ChemicalDetailsHeader.vue';
import OperaPerformance from '~/components/calculationDetails/Performance.vue';
import ImageZoomModal from '~/components/modals/ImageZoomModal.vue';
import ChemicalImage from '~/components/results/ChemicalImage.vue';
import OperaNeighbors from '~/components/calculationDetails/Neighbors.vue';

export default {
  validate(data) {
    if (data.route.query.search && data.route.query.model_id) {
      return true;
    }
    return false;
  },
  name: 'CalculationDetails',
  components: {
    ChemicalHeader,
    ChemicalImage,
    ImageZoomModal,
    OperaPerformance,
    OperaNeighbors,
  },
  data() {
    return {
      showImageModal: false,
      errorMsg: '',
      loading: true,
      operaData: null,
      chemical: null,
    };
  },
  head() {
    return {
      title: `${process.env.APPLICATION_TITLE} OPERA Model Calculation Details`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} OPERA Model Calculation Details`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} OPERA Model Calculation Details`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} OPERA Model Calculation Details`,
        },
      ],
    };
  },
  mounted() {
    this.getOpera(this);
  },
  methods: {
    ...mapActions({
      actLeftNavReady: 'results/actLeftNavReady',
      actHeaderReady: 'results/actHeaderReady',
      loadSearchedOn: 'searchedOn/loadSearchedOn',
    }),
    showHideImageModal(imagePath) {
      this.$nuxt.$emit('zoomImage', {image: imagePath, show: true});
    },
    print() { window.print(); },
    async getOpera(context) {
      this.$nextTick(() => {
        this.$nuxt.$loading.start();
      });
      const {query} = context.$store.$router.history.current;
      const dtxsid = context.id2dtxid('S', query.search);
      const dtxcidSearch = await this.$store.$repositories.chemicalSearch.matchesExactly(query.search);
      const {dtxcid} = dtxcidSearch[0];
      const searchParams = `?dtxsid=${dtxsid}&modelid=${query.model_id}`;
      const operaD = await this.$store.$repositories.opera.search(searchParams);
      operaD.dtxcid = dtxcid;
      operaD.dtxsid = dtxsid;
      operaD.genericSubstanceId = query.search;
      operaD.relatedStructureCount = 0;
      const chemical = {
        dtxsid: operaD.dtxsid,
        dtxcid: dtxcid,
        casrn: operaD.casrn,
        gsid: operaD.genericSubstanceId,
        relatedStructureCount: 0,
        hasStructureImage: true,
        preferredName: operaD.preferredName,
      };
      this.operaData = operaD;
      this.chemical = chemical;
      if (this.operaData.preferredName) {
        this.actHeaderReady(true);
      }
      this.actLeftNavReady(true);
      this.$nuxt.$loading.finish();
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen {
  .image{
     cursor: pointer;
  }
  .printButton {
    margin: 0.5rem;
    text-align: center;
  }
  .image.target {
    outline: 2px solid black;
  }

  .globalApplicability {
    border: 2px solid red;
    padding: 1px 2px;
    &.inside {
      border-color: green;
    }
  }

  .card-body {
    font-size: .85rem !important;
  }

  .info {
    font-size: .85rem !important;
    border-bottom: 1px dashed;
    cursor: help;
  }

  .neighbors {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    .chemicalWidth {
      width: 250px;
      &.chemicalTile {
        margin: 0.2rem;
        height: 270px;
        background: white;
        border: 1px solid lightgrey;
        border-radius: 3%;
        .chemicalImage {
          height:          170px;
          width:          170px;
          user-select: none;
          font-size:       2em;
          align-items:     center;
          justify-content: center;
          display: flex;
          margin: 10px auto;
          :deep(figure) {
            width: 100%;
            img {
              height: 100%;
            }
          }
        }
        .name {
          text-align: center;
        }
        .chemical-data {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
        }
      }
    }
  }
}
@media print {
   .row .results {
    height:300px;
  }
 .btn {
    display: none !important;
  }
 /* styles here */
}
</style>
