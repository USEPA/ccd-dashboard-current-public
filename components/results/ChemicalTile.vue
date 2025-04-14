<template>
  <div
    :id="chemical.gsid"
    :class="{ selected: chemical.selected }"
    class="chemicalTile"
    data-cy="ChemTile"
  >
    <div class="chemicalTileClick" @click="selectTile" />
    <mdb-tooltip trigger="hover" :options="{placement: 'bottom'}">
      <span slot="tip">
        {{ chemical.relationship == 'Searched Chemical' ? 'The original chemical searched' : chemical.relatedHover }}
      </span>
      <div slot="reference" class="relationship">
        {{ chemical.relationship }}
      </div>
    </mdb-tooltip>

    <ChemicalImage
      :data="chemical"
      :small="true"
      :class="{related: chemical.relationship }"
    />

    <div class="name">
      <a :href="detailLink" @click="startLoading"><span v-html="formatPreferredName(chemical.preferredName)" /></a><br>
    </div>
    <div class="chemical-data">
      <dl>
        <dt v-show="tileInfo.includes('dtxsid')">
          DTXSID
        </dt>
        <dd v-show="tileInfo.includes('dtxsid')">
          {{ chemical.dtxsid }}
        </dd>
        <dt v-show="tileInfo.includes('casrn')">
          CASRN
        </dt>
        <dd v-show="tileInfo.includes('casrn')">
          {{ chemical.casrn }}
        </dd>
        <dt v-show="tileInfo.includes('toxcast')">
          TOXCAST
        </dt>
        <dd v-show="tileInfo.includes('toxcast')">
          <span v-if="chemical.activeAssays">
            {{ chemical.activeAssays }}/{{ chemical.totalAssays }}
          </span>
        </dd>
        <dt v-if="tileInfo.includes('monoisotopicMass')">
          Mono. Mass
        </dt>
        <dd v-if="tileInfo.includes('monoisotopicMass')">
          {{ (chemical.monoisotopicMass && chemical.monoisotopicMass !== 'undefined') ?
            chemical.monoisotopicMass.toFixed(6) : '-' }}
        </dd>
        <dt v-if="tileInfo.includes('molFormula')">
          Mol. Form.
        </dt>
        <dd v-if="tileInfo.includes('molFormula')">
          {{ chemical.molFormula }}
        </dd>
        <dt v-if="tileInfo.includes('massDiff')">
          Mass Diff.
        </dt>
        <dd v-if="tileInfo.includes('massDiff')">
          {{ chemical.massDiff.toFixed(6) }}
        </dd>
        <dt v-if="tileInfo.includes('similarity') && chemical.similarity">
          Similarity
        </dt>
        <dd v-if="tileInfo.includes('similarity') && chemical.similarity">
          {{ (chemical.similarity && chemical.similarity !== 'undefined') ? chemical.similarity.toFixed(2) : '-' }}
        </dd>
        <dt v-if="tileInfo.includes('toxval') && chemical.toxvalData">
          Toxval Data
        </dt>
        <dd v-if="tileInfo.includes('toxval') && chemical.toxvalData">
          <a :href="toxvalLink" target="_blank" rel="no"> Available </a><br>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex';
import {mdbTooltip, mdbBadge} from 'mdbvue';
import ChemicalImage from '~/components/results/ChemicalImage.vue';

export default {
  name: 'ChemicalTile',

  components: {
    ChemicalImage,
    mdbTooltip,
  },
  props: {
    chemical: {
      type: Object,
      default() {
        return { };
      },
    },
  },
  data() {
    return {
      selected: false,
    };
  },
  computed: {
    ...mapState('results', ['tileInfo']),
    ...mapGetters('results', ['getTileInfo']),
    similarityCheck() {
      if (this.chemical && this.chemical.similarity && (this.chemical.similarity !== 'undefined')) {
        return true;
      }
      return false;
    },
    detailLink() {
      const link = '/dashboard/chemical/details/';
      const linkId = this.chemical.dtxsid || this.chemical.dtxcid;
      let finalLink = `${link}${linkId}`;
      if (this.$route.name === 'chemical-lists-id') {
        finalLink = `${finalLink}?list=${this.$route.params.id}`;
      }
      return finalLink;
    },
    toxvalLink() {
      const link = `${process.env.APPLICATION_EXTERNAL_LINK_URL}/dashboard/chemical/hazard/`;
      const linkId = this.chemical.dtxsid || this.chemical.dtxcid;
      let finalLink = `${link}${linkId}`;
      if (this.$route.name === 'chemical-lists-id') {
        finalLink = `${finalLink}?list=${this.$route.params.id}`;
      }
      return finalLink;
    },
  },
  methods: {
    startLoading() {
      this.$nuxt.$loading.start();
    },
    ...mapMutations({
      setChemicalImage: 'results/setChemicalImage',
    }),
    infoVisible(i) {
      return true;
    },
    formatPreferredName(name) {
      if (name == null) { return '-'; }
      const formatted = name.replace(/~(\d+)~/g, '<sup>$1</sup>').replace(/_(\d+)_/g, '<sub>$1</sub>');
      return formatted;
    },
    listUrl(listName) {
      return `${process.env.APPLICATION_ROUTER_BASE}chemical-lists/${listName}`;
    },
    selectTile(params) {
      const pObj = {uuId: this.chemical.uuId, newState: !this.chemical.selected};
      this.$emit('selectTile', pObj);
    },
  },
};
</script>

<style scoped lang="scss">
.chemicalTile {
  height: 300px;
  padding: 0.1em .5em;
  border: 1px solid lightgrey;
  border-radius: 3%;
  background-color:white;

  &:after {
    content: "\2713";
    color: #dee1e6;
    border: solid 1px #949598;
    background-color: #dee1e6;
    border-radius: 6px;
    border-top:none;
    border-right:none;
    border-top-left-radius:0;
    border-bottom-right-radius:0;
    height: 1.5em;
    width: 1.5em;
    line-height: 1.5em;
    font-size: 1.4em;
    font-weight: 700;
    text-align: center;
    position: absolute;
    right: 0px;
    top: 0px;
  }

  &.selected {
    &:after {
      color: #eee;
      background-color: #0e6993;
    }
  }

  &.selected,
  &:hover,
  &:focus {
    border: 1px solid #525466;
    -webkit-box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.53);
    -moz-box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.53);
    box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.53);
  }

  .relationship {
    position: absolute;
    width:75%;
    z-index:10;
    left: 0;
    right: 0;
    padding: 0 3px;
    padding-bottom: 5px i !important;
  }

  .chemicalTileClick{
    position: absolute;
    width:97%;
    height:175px;
    z-index: 5;
  }
}

.name {
  color:#0e6993;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight:400;
  font-size:1.1em;
  text-align: center;
  margin-bottom: 3px;
  background-color:#efefef;
}

.chemicalImage {
  user-select: none;
  font-size: 2em;
  align-items: center;
  justify-content: center;
}

.chemical-data {
  font-size:11px;

  .sources{
    margin-top:5px;
    text-align:center;
  }

  .badge{
    font-size:11px;
    margin-right:4px;
    font-weight: 500;
    background-color:white!important;
    color:black;

    &.pink{
      border-left: 4px solid #ea5e7e;
    }
    &.indigo{
      border-left: 4px solid #6670ad!important;
    }
    &.orange{
      border-left: 4px solid #f7ac3f!important;
    }
    &.green{

      border-left: 4px solid #60cc77!important;
    }
  }

}

  dl {
    display: flex;
    flex-flow: row wrap;
    margin:0;
  }
  dt {
    flex-basis: 35%;
    font-weight:500;
    padding: 0px 2px;
    text-align: right;
      &:after {
          content: ":";
      }
  }
  dd {
    flex-basis: 65%;
    flex-grow: 1;
    margin: 0;
    padding: 0px 2px;
  }

  .magnify{
    position: absolute;
    top:130px !important;
    left:12px;
    color:#bbb;
    font-size:16px;
    cursor: pointer;
    z-index: 900;
  }

  .relationship{
    font-size:12px;
    cursor: help;
  }

</style>
