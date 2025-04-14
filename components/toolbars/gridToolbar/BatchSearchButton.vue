<template>
  <div>
    <mdb-tooltip v-show="!isBatch" trigger="hover" :options="{placement: 'top'}">
      <span slot="tip">{{ tipText }}</span>
      <mdb-btn
        slot="reference"
        type="button"
        class="blue lighten-1 text-white m-0"
        size="sm"
        :disabled="loading"
        @click="sendToBatchSearch"
      >
        Send <span class="hide-responsive">
          {{ batchCount }}
        </span> to Batch <span class="hide-responsive">Search</span>
      </mdb-btn>
    </mdb-tooltip>
    <mdb-tooltip v-show="isBatch" trigger="hover" :options="{ placement: 'top' }">
      <span slot="tip">{{ tipText }}</span>
      <mdb-btn
        slot="reference"
        type="button"
        class="blue lighten-1 text-white m-0"
        size="sm"
        :disabled="loading"
        @click="sendToBatchSearch"
      >
        Replace batch search chemicals
      </mdb-btn>
    </mdb-tooltip>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import {
  mdbTooltip, mdbBtn,
} from 'mdbvue';

export default {
  name: 'SendtoBatchSearchButton',
  components: {
    mdbBtn,
    mdbTooltip,
  },
  props: {

    chemicalCount: {
      type: Number,
      default: null,
    },
    loading: {type: Boolean, default: true},
  },
  computed: {
    ...mapGetters('results', ['getFilteredChemicals']),
    batchCount() {
      if (this.$route.path.includes('/chemical-lists/')) {
        return this.getFilteredChemicals().length > 0 ? this.getFilteredChemicals().length : this.chemicalCount;
      }
      return this.chemicalCount;
    },
    isBatch() {
      if (this.$route.name === 'batch-search') {
        return true;
      }
      return false;
    },
    tipText() {
      if (this.isBatch) {
        return 'Send the selected chemicals to Batch Search';
      }
      return 'Replace list of batch search chemicals with the chemicals from this grid.';
    },
  },
  methods: {
    sendToBatchSearch(params) {
      this.$emit('onSendtoBatch', params);
    },
  },
};
</script>
