<template>
  <div>
    <div class="row no-gutters">
      <div class="col-11">
        <autocomplete
          id="autocomplete"
          :debounce-time="300"
          :get-result-value="getResultValue"
          :search="lookup"
          placeholder="Search by Name, CAS, DTXSID, DTXCID, or InChIKey"
          @submit="submit"
        >
          <template #result="{ result, props }">
            <li
              v-bind="props"
              style="border-bottom:1px solid #ddd"
            >
              <div style="display:inline-flex;">
                <div style="display:inline">
                  <img
                    class="item-img"
                    :src="getStructureImageUrl(result)"
                  >
                </div>
                <div style="display:inline">
                  <strong>{{ result.searchWord }}</strong><br>
                  {{ result.dtxsid }}
                  <span
                    v-if="!result.hasStructureImage"
                    class="pl-4"
                  >
                    No defined structure for this substance.
                  </span>
                </div>
              </div>
            </li>
          </template>
        </autocomplete>
      </div>
      <div class="col-1">
        <div class="form-group form-check mt-2">
          <input
            id="fuzzy"
            v-model="fuzzy"
            type="checkbox"
            :disabled="disabled"
            class="form-check-input options"
          >
          <label class="form-check-label" for="fuzzy">Fuzzy</label>
        </div>
        <!-- <b-checkbox
          v-model="fuzzy"
          :disabled="disabled"
          class="col-1 options"
        >
          Fuzzy
        </b-checkbox> -->
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex';
import Axios from 'axios';

import Autocomplete from '@trevoreyre/autocomplete-vue';
import {getStructureImageUrl, LOOKUP_URL} from '~/assets/scripts/links';
import '@trevoreyre/autocomplete-vue/dist/style.css';

export default {
  components: {
    autocomplete: Autocomplete,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fuzzy: false,
    };
  },
  methods: {
    getStructureImageUrl(result) {
      if (result.hasStructureImage) {
        const imgUrl = `${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_IMAGE_API}by-dtxsid/${result.dtxsid}`;
        return imgUrl;
      }
      return false;
    },

    getResultValue(result) {
      return result.searchWord;
    },

    async lookup(query) {
      if (!query || query.trim().length < 3) { return []; }
      const encodedQuery = encodeURIComponent(query);
      const {data} = this.fuzzy ? await Axios.get(`${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_SEARCH_FUZZY_API}${encodedQuery}`) :
        await Axios.get(`${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_SEARCH_API}${encodedQuery}`);
      const filtered = data.filter(d => d);
      return filtered;
    },

    async submit(input) {
      // eslint-disable-next-line no-mixed-operators
      if ((!input || typeof (input) === 'string' && !input.trim())) { return; }
      const dtxid = input.dtxsid ? input.dtxsid : input.dtxcid;
      if (!input.hasStructureImage) {
        this.$notify.error({
          message: 'Cannot use structure search on substances with no structure',
          position: 'top left',
          timeOut: 4000,
        });
        return;
      }
      if (input.dtxcid) {
        const molResponse = await Axios.get(`${process.env.APPLICATION_BASE_API}${this.apiSettings().MOL_DOWNLOAD}${dtxid}?type=v2000`);
        const resultResp = await this.$repositories.chemicalSearch.equalsDetails(dtxid, this.$sentry);
        if (molResponse.data) { this.$emit('searchcompleted', molResponse.data); }
        if (resultResp) { this.$emit('chemResult', resultResp[0]); }
      }
    },
  },

};
</script>

<style scoped>
#autocomplete {
  margin-left:60px;
  max-width: 400px;
}
.item-img {
    width:60px;
    background:white;
    margin: 0px 20px;

}
.item-sub{
  font-size:12px;
}

.options {
    vertical-align: middle;
}
.form-check-label{
  color: rgb(20, 20, 20) !important;
}

.item-body {
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.form-check {
    padding-left: 0.25rem;
}

</style>
