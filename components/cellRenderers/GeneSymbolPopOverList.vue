<template>
  <span>

    <mdb-popover
      v-for="(gene, idx) in geneArray"
      :key="gene.gene_symbol + idx"
      :append-to-body="true"
      size="sm"
      trigger="hover"
      :options="{placement: 'top'}"
    >
      <span slot="body">
        <span v-if="gene.gene_name">{{ gene.gene_name }}
        </span>
        <span v-if="gene.taxon_name">[{{ gene.taxon_name }} ({{ gene.common_name }})]
        </span>
      </span>
      <span slot="reference" class="align-content-start  popoverLabel">
        <a target="_blank" :href="geneUrl+gene.entrez_gene_id">{{ gene.gene_symbol }}</a>
        <span v-if="idx !== geneArray.length - 1" style="color:#aaa"> | </span>
      </span>
    </mdb-popover>


  </span>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import {
  mdbPopover,
} from 'mdbvue';

export default {
  name: 'GeneSymbolPopover',
  components: {
    mdbPopover,
  },
  data() {
    return {
      icon: 'info-circle',
    };
  },
  computed: {
    geneArray() {
      return this.params.data.geneInfo || this.params.data.genes;
    },
    geneUrl() {
      return process.env.GENE_SYMBOL_BASE_URL;
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
