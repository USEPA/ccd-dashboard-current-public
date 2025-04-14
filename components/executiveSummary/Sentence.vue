<template>
  <div>
    <div
      v-for="phrase in phrases"
      :key="phrase.id"
      class="sentence"
      :class="{ check: phrase.enableIndicator, x: !phrase.enableIndicator }"
    >
      <span class="linkSizes">{{ phrase.data }}
        <div v-if="phrase.displayDataJson !== null && phrase.data === 'Lowest Observed Bioactivity Equivalent Level:'">
          <span v-for="(gene,i) in phrase.displayDataJson" :key="i">
            <mdb-popover trigger="hover" append-to-body :options="{placement: 'top'}">
              <div slot="body">
                <span style="dispay: block;" v-html="getLobelDat(i)" />
              </div>
              <a
                v-if="gene.geneSymbol !== 'NO GENE'"
                slot="reference"
                :href="nihLink(gene.geneId)"
                target="_blank"
              >{{ gene.geneSymbol }}{{ showComma(i, phrase.displayDataJson) }} </a>
              <a v-else slot="reference">NA{{ showComma(i, phrase.displayDataJson) }} </a>
            </mdb-popover>
          </span>
        </div>
        <div v-if="phrase.displayDataJson !== null && phrase.data === 'AOP Links:'">
          <span v-for="(aop, i) in phrase.displayDataJson" :key="aop.aopId">
            <mdb-popover trigger="hover" append-to-body :options="{placement: 'top'}">
              <div slot="body">
                <span style="dispay: block;" v-html="getAopDat(aop)" />
              </div>
              <a
                slot="reference"
                :href="aopLink(aop.aopId)"
                target="_blank"
              > {{ aop.aopId }}{{ showComma(i, phrase.displayDataJson) }}</a>
            </mdb-popover>
          </span>
        </div>
      </span>
      <nuxt-link
        v-if="phrase.enableIndicator && phrase.link.indexOf('%s') < 0"
        :title="`Go to ${navigate(phrase)}`"
        class="fa fa-external-link link-logo"
        :to="navigate(phrase)"
      />
    </div>
  </div>
</template>
<script>
import {
  mapGetters,
} from 'vuex';
import {
  mdbPopover,
} from 'mdbvue';

export default {
  name: 'Sentence',
  components: {
    mdbPopover,
  },
  props: ['phrases', 'linkDtxsid'],
  data() {
    return {
      aid: 0,
      aopArray: [],
      lobelArray: [],
    };
  },
  computed: {
    ...mapGetters({
      getFiltered: 'aops/getFiltered',

    }),
    aopsComputed() {
      const aopsArr = this.getFiltered(this.aid);
      return aopsArr[0];
    },
    aopRows() {
      return this.aopArray;
    },
  },
  created() {
    const phrase = this.phrases[0];
    if (phrase) {
      if (phrase.displayDataJson !== null && phrase.data === 'AOP Links:') {
        this.aopArray = phrase.displayDataJson.map((aop) => {
          this.aid = aop.aopId;
          const aopData = this.aopsComputed;
          const newObj = {
            id: aopData.aop_id,
            title: aopData.aop_name,
            wiki: aopData.wiki_status,
            oecd: aopData.oecd_status,
            saaop: aopData.saaop_status,
          };
          return newObj;
        });
      }
      const matchPhrase = 'Lowest Observed Bioactivity Equivalent Level:';
      const lobel = this.phrases.filter(item => item.data === matchPhrase);
      if (lobel.length > 0) {
        this.lobelArray = lobel[0].displayDataJson.map((item) => {
          const itemData = item;
          const geneSymbol = itemData.geneSymbol === 'NO GENE' ? 'NA' : itemData.geneSymbol;
          const newObj = {
            geneId: itemData.geneId,
            ac50: itemData.ac50.toString(),
            assayComponentEndpNm: itemData.assayComponentEndpNm,
            assayFrmtTypTx: itemData.assayFrmtTypTx,
            geneSymbol: geneSymbol,
            intendedTargetFamily: itemData.intendedTargetFamily,
            orgsmNm: itemData.orgsmNm,
            tissueTx: itemData.tissueTx,
          };
          return newObj;
        });
      }
    }
  },
  methods: {
    nihLink(id) {
      return `http://www.ncbi.nlm.nih.gov/gene/${id}`;
    },
    aopLink(id) { return `https://aopwiki.org/aops/${id}`; },
    navigate(linkData) {
      return `/${linkData.link}/${this.linkDtxsid}?deepLink=${linkData.id}`;
    },
    showComma(i, arr) {
      if (i < arr.length - 1) {
        return ',';
      }
    },
    getAopDat(aopData) {
      const link = this.aopLink(aopData.aopId);
      const linkString = `<span style="display: block">
      <a href="${link}" target="_blank">ID: ${aopData.aopId}</a></span>`;

      let displayString = `${linkString}`;
      if (aopData) {
        const titleString = `<span style="display: block">${aopData.title}</span>`;
        displayString = `${linkString}${titleString}`;
      }
      return displayString;
    },
    getLobelDat(id) {
      const item = this.lobelArray[id];
      const ac50num = Number(item.ac50);
      const ac50String = `<span style="display: block">AC50(uM): ${ac50num.toFixed(3)} </span>`;
      const assayComponentEndpNmString = `<span style="display: block">Assay Endpoint Name: ${item.assayComponentEndpNm} </span>`;
      const assayFrmtTypTxString = `<span style="display: block">Assay Format Type: ${item.assayFrmtTypTx} </span>`;
      const geneSymbolString = `<span style="display: block">Gene Symbol: ${item.geneSymbol} </span>`;
      const intendedTargetFamilyString = `<span style="display: block">Intended Target Family: ${item.intendedTargetFamily} </span>`;
      const orgsmNmString = `<span style="display: block">Organism: ${item.orgsmNm} </span>`;
      const tissueTxString = `<span style="display: block">Tissue: ${item.tissueTx} </span>`;
      const displayString = `${ac50String}${assayComponentEndpNmString}${geneSymbolString}${orgsmNmString}${tissueTxString}${assayFrmtTypTxString}${intendedTargetFamilyString}`;
      return displayString;
    },
  },
};
</script>
<style scoped>
.sentence:before {
 font-size:     0.6em;
 color:         white;
 width:         1em;
 height:        1em;
 line-height:   1em;
 display:       inline-block;
 text-align:    center;
 border-radius: 50%;
 margin:        2px 2px 0 0;
}

.sentence.check:before {
 content:    '\02713';
 background: green;
 font-weight: bold;
}

.sentence.x {
 color: #999;
}

.header {
    font-weight: bold;
    text-decoration: none !important;
}

.linkSizes {
    font-size: 0.7em;
}

.link-logo {
 font-size: 0.6em;
 margin-left: 0;
}

.sentence.x:before {
 content:    '\02715';
 background: #e00000;
 font-weight: bold;
}

.fa-external-link {
 text-decoration: none;
}
.section {
 margin: 0;
 padding: 0;
}
</style>
