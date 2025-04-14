<template>
  <div>
    <div class="buttons">
      <copy-text id="genes" :tip-text="'Copy genes'" :copy-data="genes" :copy-type="'assayDetails'" />
    </div>
    <mdb-tbl v-if="genes.length > 0">
      <mdb-tbl-head>
        <tr>
          <th>
            Entrez Gene Id
          </th>
          <th>
            Gene Name
          </th>
          <th>
            Gene Symbol
          </th>
          <th>
            Gene URL
          </th>
        </tr>
      </mdb-tbl-head>
      <mdb-tbl-body>
        <tr v-for="record in genes" :key="record.entrezGeneId">
          <td v-for="(value, index) in record" :key="value">
            <a
              v-if="index === 'url'"
              alt="Link to gene detailed information"
              title="Link to gene detailed information"
              target="_blank"
              :href="geneLink(value)"
              rel="noopener noreferrer"
            > {{ value }} </a>
            <span v-else>{{ value }}</span>
          </td>
        </tr>
      </mdb-tbl-body>
    </mdb-tbl>
    <div v-else class="h3">
      No genes for this assay.
    </div>
  </div>
</template>

<script>
import {
  mdbTbl, mdbTblHead, mdbTblBody,
} from 'mdbvue';

export default {
  name: 'AssayGenes',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
  },
  props: {
    genes: {
      default: () => [],
      type: Array,
    },
  },
  methods: {
    geneLink(id) {
      return `${id}`;
    },
  },
};
</script>

