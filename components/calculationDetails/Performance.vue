<template>
  <div class="card">
    <div class="card-header bg-dark text-white font-weight-bolder p-1 pl-2">
      Model Performance
    </div>
    <div class="card-body font-weight-normal">
      <div class="imageContainer">
        <div class="image" @click="showHideImageModal(histUrl)">
          <div class="magnify">
            <i class="fas fa-search-plus fa-2x" style="z-index:0" @click.stop="showHideImageModal(histUrl)" />
          </div>
          <img :src="histUrl">
        </div>
        <div class="image" @click="showHideImageModal(splatterUrl)">
          <div class="magnify">
            <i class="fas fa-search-plus fa-2x" style="z-index:990" @click="showHideImageModal(splatterUrl)" />
          </div>
          <img :src="splatterUrl">
        </div>
      </div>
      <a
        v-if="operaData.modelDetails.qmrfReportUrl"
        :href="qmrfDownloadUrl"
        class="btn btn-sm btn-outline-info mt-1 px-2 py-1"
        target="_blank"
        title="Download QMRF PDF"
        role="button"
      >
        <span class="icon">
          <i class="fa fa-download" />
        </span>
        <span>QMRF</span>
      </a>
      <h4 class="text-center w-100">
        Weighted KNN model
      </h4>
      <div class="tableContainer">
        <table border="1" class="modelTable">
          <thead>
            <tr>
              <th colspan="2" scope="col">
                5-fold CV (75%)
              </th>
              <th colspan="2" scope="col">
                Training (75%)
              </th>
              <th colspan="2" scope="col">
                Test (25%)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ operaData.modelResults.performance.fivefoldicv[0][0] }}</td>
              <td>{{ operaData.modelResults.performance.fivefoldicv[1][0] }}</td>
              <td>{{ operaData.modelResults.performance.train[0][0] }}</td>
              <td>{{ operaData.modelResults.performance.train[1][0] }}</td>
              <td>{{ operaData.modelResults.performance.external[0][0] }}</td>
              <td>{{ operaData.modelResults.performance.external[1][0] }}</td>
            </tr>
            <tr>
              <td>{{ ncctRound(operaData.modelResults.performance.fivefoldicv[0][1]) }}</td>
              <td>{{ ncctRound(operaData.modelResults.performance.fivefoldicv[1][1]) }}</td>
              <td>{{ ncctRound(operaData.modelResults.performance.train[0][1]) }}</td>
              <td>{{ ncctRound(operaData.modelResults.performance.train[1][1]) }}</td>
              <td>{{ ncctRound(operaData.modelResults.performance.external[0][1]) }}</td>
              <td>{{ ncctRound(operaData.modelResults.performance.external[1][1]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters,
} from 'vuex';


export default {
  name: 'OperaPerformance',
  setup() {


  },
  props: {
    operaData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      title: '',
    };
  },
  computed: {
    ...mapGetters({
      getActive: 'results/getActive',
      getUiReady: 'results/getUiReady',
    }),
    histUrl() {
      return `${process.env.APPLICATION_BASE_API}${this.apiSettings().OPERA_HISTOGRAPH_API}${this.operaData.dtxsid}/${this.operaData.modelId}`;
    },
    splatterUrl() {
      return `${process.env.APPLICATION_BASE_API}${this.apiSettings().OPERA_SCATTERGRAPH_API}${this.operaData.dtxsid}/${this.operaData.modelId}`;
    },
    qmrfDownloadUrl() {
      return `${process.env.APPLICATION_BASE_API}${this.apiSettings().DOWNLOAD_QMRF_API}${this.operaData.modelId}`;
    },
  },
  created() {
    this.$nuxt.$on('zoomImage', (data) => {
      this.imagePath = data.image;
      this.showImageZoom = true;
    });
  },
  methods: {
    showHideImageModal(imagePath) {
      this.$nuxt.$emit('zoomImage', {image: imagePath, show: true});
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
    font-size: .85rem !important;
  }

  .info {
    font-size: .85rem !important;
    border-bottom: 1px dashed;
    cursor: help;
  }
  .magnify{
    position: relative;
    width: 35px;
    bottom: -35px;
    left: 87%;
    align-content: flex-start;
    color:#bbb;
    font-size:16px;
    cursor: pointer;
    z-index: 900;
  }
  .imageContainer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    > * {
      max-width: 600px;
    }
  }

  .modelTable {
    width: 100%;
    tbody > tr:nth-child(odd) {
      background: white;
    }
    * {
      padding: 2px;
      text-align: center;
    }
  }
  @media print {
  .imageContainer {
    display: flex;
    flex-flow: column;
    justify-content:flex-start;
    > * {
      max-width: 100%;
    }
  }
  .image {
        margin-top: 50px !important;
  }
  img {
  width: 100% !important;
  height: 100% !important;
  }
  .magnify, .btn {
    display: none !important;
  }
  .tableContainer {
   width: 100%;
  }
 /* styles here */
}
</style>
