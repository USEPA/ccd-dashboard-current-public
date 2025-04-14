<template>
  <div class="sentence-container">
    <ul>
      <li>
        <Sentences :data="qravGroup" header="Quantitative Risk Assessment Values" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="qhvGroup" header="Quantitative Hazard Values" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="ciGroup" header="Cancer Information" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="rtGroup" header="Reproductive/Developmental Toxicity Studies" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="ctGroup" header="Chronic Toxicity Studies" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="stGroup" header="Subchronic Toxicity Studies" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="atGroup" header="Acute Toxicity Studies" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="seGroup" header="Skin / Eye" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="admeGroup" header="ADME" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="ftGroup" header="Fate Transport" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="expGroup" header="Exposure" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="aopIGroup" header="AOP Information" :dtxsid="chemicalDtxsid" />
      </li>
      <li>
        <Sentences :data="onGroup" header="Other Notes" :dtxsid="chemicalDtxsid" />
      </li>
    </ul>
  </div>
</template>
<script>
import {
  mapState,
} from 'vuex';
import Sentences from './Sentences.vue';

export default {
  name: 'ExecSumLinks',
  components: {
    Sentences,
  },
  props: ['chemicalDtxsid'],
  data() {
    return {
      qravGroup: [],
      qhvGroup: [],
      ciGroup: [],
      rtGroup: [],
      ctGroup: [],
      stGroup: [],
      dtGroup: [],
      atGroup: [],
      satGroup: [],
      neGroup: [],
      esGroup: [],
      admeGroup: [],
      seGroup: [],
      ftGroup: [],
      expGroup: [],
      aopIGroup: [],
      onGroup: [],
    };
  },
  created() {
    this.execSumLinksData.forEach((item) => {
      switch (item.header) {
      case 'Quantitative Risk Assessment Values':
        this.qravGroup.push(item);
        break;
      case 'Quantitative Hazard Values':
        this.qhvGroup.push(item);
        break;
      case 'Cancer Information':
        this.ciGroup.push(item);
        break;
      case 'Reproductive/Developmental Toxicity Studies':
        this.rtGroup.push(item);
        break;
      case 'Chronic Toxicity Studies':
        this.ctGroup.push(item);
        break;
      case 'Subchronic Toxicity Studies':
        this.stGroup.push(item);
        break;
      case 'Acute Toxicity Studies':
        this.atGroup.push(item);
        break;
      case 'ADME':
        this.admeGroup.push(item);
        break;
      case 'Fate and Transport':
        this.ftGroup.push(item);
        break;
      case 'Exposure':
        this.expGroup.push(item);
        break;
      case 'AOP Information':
        this.aopIGroup.push(item);
        break;
      case 'Other Notes':
        this.onGroup.push(item);
        break;
      case 'Skin / Eye':
        this.seGroup.push(item);
        break;
      default:
        // code block
      }
    });
  },
  computed: {
    ...mapState({
      execSumLinksData: state => state.executiveSummary.execSumLinksData,
    }),
  },
};
</script>
<style scoped>
.sentence-container {
    width: 100%;
}

.sentence-container > ul > li {
 margin-top: 1em;
}

.sentence-container > ul > li > strong {
 font-size: 1.2em;
}
</style>
