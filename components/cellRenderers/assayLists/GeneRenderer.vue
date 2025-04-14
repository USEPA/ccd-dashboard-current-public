<template>
  <div v-html="display" />
</template>

<script>

export default {
  name: 'GeneRenderer',
  computed: {
    display() {
      let symbols = ''
      const {genes, geneInfo} = this.params.data
      const geneData = (genes) || geneInfo

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < geneData.length; i++) {
        if (geneData[i].entrez_gene_id) {
          var geneSymbToolTip = geneData[i].gene_symbol + ' ' + geneData[i].gene_name + ' [' + geneData[i].taxon_name + ' (' + geneData[i].common_name + ')]'
          symbols += `<a title="${geneSymbToolTip}" href="https://www.ncbi.nlm.nih.gov/gene/${geneData[i].entrez_gene_id}"\
        target="_blank">${geneData[i].gene_symbol}</a>`
          if (geneData.length > 1 && i < geneData.length - 1) {
            symbols += ' | '
          }
        }
      }
      return symbols
    },
  },
}
</script>
