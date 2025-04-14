<template>
  <div v-if="getUiReady()" class="header mb-0">
    <chem-img-modal />
    <div v-if="chemical.compoundId && !hideImage" id="thumbnailImg" class="headerThumbnail pl-1 pr-1">
      <ChemicalImage :thumbnail="true" :border="true" :data="chemical" />
    </div>
    <div v-if="errorMsg.length <= 0">
      <h2 class="mb-0 mt-0">
        <div
          v-if="chemical.preferredName"
          class="mt-0 mb-0 p-0  preferred_name"
          :title="subSuperScriptReplace(chemical.preferredName)"
          v-html="subSuperScriptReplace(chemical.preferredName)"
        />
      </h2>
      <h3 class="subtitle mb-0">
        <span v-if="chemical.casrn" class="p-0 m-0">
          {{ chemical.casrn }} |
        </span>
        <span v-if="chemical.dtxsid">
          {{ chemical.dtxsid }}
        </span>
        <span v-else>
          {{ chemical.dtxcid }}
        </span>
      </h3>
      <div v-if="chemical.searchedOnStr && !hideSearchedby" class="searchedBy mt-0 pt-0">
        Searched by {{ chemical.searchedOnStr }}.
      </div>
      <div v-if="!chemical.searchedOnStr && !hideSearchedby" class="searchedBy mt-0 pt-0">
        {{ defaultSearchedBy }}
      </div>
    </div>
    <div v-if="errorMsg.length > 0" class="h3 red-text mt-2 pl-5 ml-5">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script>
import {
  mapMutations, mapGetters, mapActions, mapState,
} from 'vuex';
import ChemicalImage from '~/components/results/ChemicalImage.vue';
import ChemImgModal from '~/components/modals/ChemImgModal.vue';

export default {
  name: 'ChemicalHeader',
  components: {
    ChemicalImage,
    ChemImgModal,
  },
  props: {
    hideImage: {
      type: Boolean,
      default: false,
    },
    hideSearchedby: {
      type: Boolean,
      default: false,
    },
    // chemical: {
    //   type: Object,
    //   default: null,
    // },
    errorMsg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchedBy: '',
    };
  },
  computed: {
    imageApi() {
      const path = this.apiSettings().CHEMICAL_IMAGE_API;
      // console.log(path)
      return path;
    },
    imageUrl() {
      return 'imageUrl';
    },
    ...mapGetters('results', ['getModalInfo', 'getChemicals', 'getUiReady']),
    modalImageURL() {
      const {gsid} = this.getModalInfo();
      const url = `${process.env.APPLICATION_BASE_API}${this.imageApi}by-dtxcid/${gsid}`;
      return url;
    },
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
    searchedOn() {
      return this.$store.state.searchedOn.chemicalSearchedOnStr;
    },
    defaultSearchedBy() {
      const preStr = 'Searched by';
      if (this.searchedOn !== '') {
        return `${preStr} ${this.searchedOn}`;
      }
      if (this.$route.params.id && this.$route.params.id.toUpperCase().includes('DTXSID')) {
        return `${preStr} DTXSID`;
      }
      return `${preStr} DTXCID`;
    },
  },
  created() {
    this.loadSearchedOn(this.searchedOn);
  },
  mounted() {
    if (this.chemical.preferredName) {
      this.actHeaderReady(true);
    }
    this.$nextTick(() => {
      window.scroll(0, 100);
    });
  },
  methods: {
    ...mapMutations({
      setChemicalImage: 'results/setChemicalImage',
      setModalVisibility: 'results/setModalVisibility',
    }),
    ...mapActions({
      actHeaderReady: 'results/actHeaderReady',
      loadSearchedOn: 'searchedOn/loadSearchedOn',
    }),
    imageClicked() {
      const chemicalInfo = {
        name: this.chemical.preferredName,
        gsid: this.chemical.dtxcid,
        visible: true,
      };
      this.setChemicalImage(chemicalInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: auto;

.header {
  height: $header-height;
  font-size: 2em;
  display: flex;
  flex-flow: row nowrap;
  max-width:90%;

  .h2 {
    font-size: 1.25em;
  }

  .headerThumbnail {
    padding: 0;
    width: $header-height;
    height: $header-height;
    margin: 4px;
  }
  h2 {
    margin: 0;
    line-height: 1.15;
    font-size: 1.1em;
    .preferred_name {
      max-width: calc(100vw - 460px);
      text-overflow: ellipsis !important;
      overflow: hidden !important;
      white-space: nowrap !important;
    }
  }
  .searchedBy {
    font-size: 1.3rem;
  }
}
</style>
