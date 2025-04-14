<template>
  <div class="mr-5" style="margin-top:10px">
    <div class="h2">
      <ccte-help-text
        data-cy="GoogleScholarHeader"
        label-type="span"
        :heading-text="`Literature - Google Scholar`"
        help-key="GoogleScholarHeader"
      />
    </div>
    <p>Submit the query as is to search on Google Scholar or select from the multiple query terms. Note that query terms may be multi-level</p>
    <div class="toolbar mr-4">
      <div class="row d-flex ">
        <div class="col-3 py-2">
          <select id="m1" v-model="s1" @change="buildPhrase">
            <option
              v-for="option in m1Items"
              :key="option.id"
              :selected="option.id === 0"
              :value=" option.id "
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="col-3 py-2">
          <select v-if="s1 != 0 " id="m2" v-model="s2" @change="buildPhrase">
            <option
              v-for="option in m2Items"
              :key="option.id"
              :selected="option.id === 0"
              :value=" option.id "
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="col-3 py-2">
          <select v-if="s2 != 0 && m3Items.length >1" id="m3" v-model="s3" @change="buildPhrase">
            <option
              v-for="option in m3Items"
              :key="option.id"
              :selected="option.id === 0"
              :value="option.id "
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div>Query to send to Google Scholar</div>
        <textarea class="form-control rounded-0" rows="5" :value="completedPhrase" @input="userInput($event.target.value)" />
      </div>

      <div class="col-6  d-flex flex-column justify-content-center">
        <div>
          <a
            :href="computedUrl"
            target="_blank"
            class="btn btn-primary mt-2"
            style="color:white!important"
          >
            Submit query to Google Scholar
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations, mapState, mapActions,
} from 'vuex';


import scholarData from '~/assets/fixtures/scholar.json';

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
  name: 'GoogleScholarView',
  components: {

  },

  data() {
    return {
      googleScholarURL: 'https://scholar.google.com/scholar?hl=en&q=',
      active: 'literature',
      s1: 0,
      s2: 0,
      s3: 0,
      chemicalPhrase: '',
      categoryPhrase: '',
      userPhrase: '',
      completedPhrase: '',
    };
  },

  computed: {

    ...mapGetters({
      getActiveChemical: 'results/getActive',
    }),
    m1Items() {
      const m1 = scholarData.filter(obj => obj.parent_id === 0);
      m1.unshift({id: '0', label: 'Choose Query Term'});
      return m1;
    },
    m2Items() {
      const m2 = scholarData.filter(obj => obj.parent_id === this.s1);
      m2.unshift({id: '0', label: 'Choose Query Term'});
      return m2;
    },
    m3Items() {
      const m3 = scholarData.filter(obj => obj.parent_id === this.s2);
      m3.unshift({id: '0', label: 'Choose Query Term'});
      return m3;
    },

    computedUrl() {
      return encodeURI(`${this.googleScholarURL}${this.completedPhrase}`);
    },

  },
  async asyncData(context) {
    try {
      const chemical = await context.app.store.state.results.activeChemical;
      return {chemical};
    } catch (err) {
      console.error(`ERROR CALLING chemical-details ${err}`);
    }
  },
  head() {
    return {
      title: `${this.getActiveChemical().preferredName}  - Publications -  Google Scholar`,
      meta: [],
    };
  },
  created() {
    this.completedPhrase = `"${this.chemical.casrn}" OR "${this.chemical.preferredName}"`;
  },
  methods: {
    getPhraseText(id) {
      const foundObj = scholarData.find(obj => obj.id === id);
      return foundObj.label;
    },
    buildPhrase(e) {
      this.chemicalPhrase = `"${this.getActiveChemical().casrn}" OR "${this.getActiveChemical().preferredName}"`;
      if (e.target.id === 'm1') {
        this.categoryPhrase = '';
        this.s2 = 0;
        this.s3 = 0;
      }

      if (this.s1 != 0) {
        this.categoryPhrase = `AND "${this.getPhraseText(this.s1)}" `;
      }
      if (this.s2 != 0) {
        this.categoryPhrase += `AND "${this.getPhraseText(this.s2)}" `;
      }
      if (this.s3 != 0 && this.m3Items.length > 1) {
        this.categoryPhrase += `AND "${this.getPhraseText(this.s3)}" `;
      }
      this.completedPhrase = `${this.chemicalPhrase} ${this.categoryPhrase}`;
    },
    userInput(textAreaValue) {
      this.completedPhrase = textAreaValue;
    },
  },

};
</script>
<style scoped>
#m1,#m2,#m3{
  min-width:220px
}
</style>
