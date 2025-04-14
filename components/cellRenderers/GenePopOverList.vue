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
        <span v-if="params.showItem === 'name'">Link to page for {{ gene.gene_name }}
        </span>
        <span v-if="params.showItem === 'url'">Link to page for {{ gene.gene_url }}
        </span>
        <span v-if="params.showItem === 'symbol'">Link to page for {{ gene.gene_symbol }}
        </span>
      </span>
      <span v-if="params.showItem === 'symbol'" slot="reference" class="align-content-start  popoverLabel">
        <a target="_blank" :href="geneUrl+gene.entrez_gene_id">{{ gene.gene_symbol }}</a>
        <span v-if="idx !== geneArray.length - 1" class="m-2" style="color:#aaa"> | </span>
      </span>
      <span v-if="params.showItem === 'name'" slot="reference" class="align-content-start  popoverLabel">
        <a target="_blank" :href="geneUrl+gene.entrez_gene_id">{{ gene.gene_name }}</a>
        <span v-if="idx !== geneArray.length - 1" class="m-2" style="color:#aaa"> | </span>
      </span>
      <span v-if="params.showItem === 'url'" slot="reference" class="align-content-start  popoverLabel">
        <a target="_blank" :href="geneUrl+gene.entrez_gene_id">{{ gene.gene_url }}</a>
        <span v-if="idx !== geneArray.length - 1" class="m-2" style="color:#aaa"><br> </span>
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
      const geneData = this.params.data.geneInfo || this.params.data.genes;
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
