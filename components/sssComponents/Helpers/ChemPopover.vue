<template>
  <b-popover
    :delay="delay"
    :target="target"
    custom-class="search-popover"
    triggers="hover"
  >
    <template v-slot:title>
      <div
        :title="chemical.name"
        class="text-truncate text-left"
      >
        {{ (chemical.casrn || 'N/A') + ' | ' + (chemical.name || 'N/A') }}
      </div>
    </template>
    <div>
      <img
        :src="structureImageUrl"
        alt=""
        class="t-img"
      >
    </div>
    <div v-if="chemical.sid">
      <b-link
        :href="`${dashboardUrl}#toxicity-values`"
        target="_blank"
      >
        ToxVal
      </b-link>
      |
      <b-link
        :href="`${dashboardUrl}#bioactivity`"
        target="_blank"
      >
        Bioactivity
      </b-link>
      |
      <b-link
        :href="`${dashboardUrl}#genra`"
        target="_blank"
      >
        GenRA
      </b-link>
      <template v-if="sid2hawc[chemical.sid]">
        |
        <b-link
          :href="hawcUrl"
          target="_blank"
        >
          HAWC
        </b-link>
      </template>
    </div>
  </b-popover>
</template>
<script>
import {
  getDashboardUrl, getStructureImageUrl, SEARCH_URL,
} from '~/assets/scripts/links.js'

export default {
  props: {
    chemical: {
      type: Object,
      required: true,
    },
    searchType: {
      type: String,
      default: null,
    },
    query: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      required: true,
    },
    delay: {
      type: Number,
      default: 1000,
    },
  },

  data() {
    return {
      sid2hawc: {
        DTXSID2041757: 100500223,
        DTXSID2041915: 100500222,
        DTXSID3037707: 100000037,
        DTXSID5030030: 100000037,
        DTXSID3031860: 100000039,
        DTXSID4027527: 100000039,
        DTXSID5020023: 100000047,
        DTXSID8020913: 100000053,
        DTXSID1021952: 100000054,
        DTXSID7023982: 100500006,
        DTXSID1037303: 100500020,
        DTXSID2021159: 100500037,
        DTXSID6021793: 100500049,
        DTXSID2021781: 100500095,
        DTXSID3020205: 100500096,
        DTXSID5020607: 100500097,
        DTXSID9022522: 100500098,
        DTXSID5025021: 100500099,
        DTXSID1026081: 100500100,
        DTXSID5021411: 100500101,
        DTXSID4022521: 100500107,
        DTXSID4025082: 100500108,
        DTXSID3020203: 100500143,
        DTXSID6020430: 100500155,
        DTXSID1020431: 100500158,
      },
    }
  },

  computed: {
    dashboardUrl() {
      return getDashboardUrl(this.chemical.sid)
    },
    structureImageUrl() {
      if (!this.searchType) { return getStructureImageUrl(this.chemical) }
      if (this.searchType === 'SUBSTRUCTURE' || this.searchType === 'SIMILAR' || this.searchType === 'ADVANCED') { return `${SEARCH_URL}api/search/render/svg?id=${this.chemical.id}&query=${encodeURIComponent(this.query)}` }
      return `${SEARCH_URL}api/search/render/svg?id=${this.chemical.id}`
    },
    hawcUrl() {
      return `https://hawcprd.epa.gov/lit/assessment/${this.sid2hawc[this.chemical.sid]}/references/visualization/`
    },
  },
}
</script>

<style lang="scss" scoped>
.search-popover {
    text-align: center;
    width: 300px !important;
    height: 340px !important;

    img {
        width: 260px;
        height: 260px;
    }
}
</style>
