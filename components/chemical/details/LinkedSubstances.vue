<template>
  <div class="ml-3" style="height: 160px;">
    <div v-if="inchiKeySkeleton" class="row">
      <div class="col-12 pt-2 pb-1">
        <span>
          <strong>Same Connectivity: </strong>
          <template v-if="similarData.connectivity !== undefined">
            <router-link :to="`/search-results?input_type=inchikey_skeleton&inputs=${inchiKeySkeleton}`" target="_blank">
              {{ similarData.connectivity }} {{ record(similarData.connectivity) }}
            </router-link>
            (based on first layer of InChI)
          </template>
          <template v-else>
            0 records
          </template>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-12 pt-3 pb-2 mb-1">
        <span>
          <strong>Mixtures, Components and Isotopomers: </strong>
          <template v-if="msReadyMappings.length > 0">
            <template>
              <span style="dispay: inline-block;">
                <mdb-popover
                  v-for="item in msReadyMappings"
                  :key="item.dtxcid"
                  trigger="hover"
                  :append-to-body="true"
                  :options="{placement: 'left'}"
                >
                  <img slot="body" :height="'100'" :src="imageUrl(item.dtxcid)">
                  <span slot="reference" class="pr-1">
                    <router-link class="p-1" :to="`/msready-mixture?dtxcid=${item.dtxcid}`" target="_blank">
                      {{ item.dtxcid }}: {{ item.count }} {{ record(item.count) }};
                    </router-link>
                  </span>
                </mdb-popover>
              </span>
            </template>
          </template>
          <template v-else>
            No Records Available
          </template>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mt-4 pb-1">
        <span><strong>Similar Compounds: </strong>
          <template
            v-if="similarData.similarCount !== undefined && similarData.similarCount.similarCompounds > 0"
          >
            <router-link :to="navigateSimilar(chemical.compoundId)">
              {{ similarData.similarCount.similarCompounds }} {{ record(similarData.similarCount.similarCompounds) }}
            </router-link>
            (based on Tanimoto coefficient >{{ similarData.similarCount.tanimoto }})
          </template>
          <template v-else>
            0 records
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mdbPopover,
} from 'mdbvue';

export default {
  name: 'LinkedSubstances',
  components: {
    mdbPopover,
  },
  props: ['name', 'inchiKey', 'gsid', 'compoundId', 'molFormula', 'smiles', 'chemical', 'msReadyMappings', 'similarData'],
  computed: {
    inchiKeySkeleton() {
      return this.inchiKey ? this.inchiKey.substr(0, this.inchiKey.indexOf('-')) : null;
    },
    imageApi() {
      const path = this.apiSettings().CHEMICAL_IMAGE_API;
      return path;
    },
  },
  methods: {
    navigateSimilar(cid) {
      return (this.$route.query.list) ?
        `/chemical/similar-molecules/${this.$route.params.id}?list=${this.$route.query.list}` :
        `/chemical/similar-molecules/${this.$route.params.id}`;
    },
    imageUrl(cid) {
      return `${process.env.APPLICATION_BASE_API}${this.imageApi}by-dtxcid/${cid}`;
    },
    record(count) {
      return count === 1 ? 'record' : 'records';
    },
  },
};
</script>
