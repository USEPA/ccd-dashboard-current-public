<template>
  <div v-if="params.data.seqAPASS" style="display: block; marginBottom: 4px; lineHeight: 8px;">
    <div
      v-for="(seq, idx) in seqArray"
      :key="seq + idx"
    >
      <div
        v-if="seq !== '-'"
        slot="reference"
      >
        <a style="display: block; marginTop: 4px; lineHeight: 8px;" target="_blank" :href="seqUrl+seq+'.zip'">
          {{ seq?.replace('_v8', '') || seq }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */

export default {
  name: 'SeqaPassList',
  data() {
    return {
      icon: 'info-circle',
    };
  },
  computed: {
    seqArray() {
      if (this.params.data.seqAPASS) {
        return this.params.data.seqAPASS.split('|');
      }
      return ['-'];
    },
    seqUrl() {
      return 'https://dmap-data-commons-ord.s3.amazonaws.com/ccte/dmap-ccte-ccd/current/seqapass_reports/';
    },
  },
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/_custom-variables.scss";

.widen {
  max-width: 500px !important;
}

.popoverLabel {
  width:fit-content;
  border-bottom:1px dashed;
  cursor: help;
  // margin: auto;
}


</style>
