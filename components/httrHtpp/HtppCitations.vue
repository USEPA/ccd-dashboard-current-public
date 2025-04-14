<template>
  <div>
    <div class="buttons">
      <copy-text id="citations" :tip-text="'Copy citations'" :copy-data="citations" :copy-type="'htppDetails'" />
    </div>
    <mdb-tbl v-if="citations.length > 0">
      <mdb-tbl-head>
        <tr>
          <th>
            PMID
          </th>
          <th>
            Author
          </th>
          <th>
            Title
          </th>
          <th>
            Citation
          </th>
          <th>
            DOI
          </th>
        </tr>
      </mdb-tbl-head>
      <mdb-tbl-body>
        <tr v-for="record in citations" :key="record.keyName">
          <td v-for="(value, index) in record" :key="index">
            <a
              v-if="index == 'Pmid' "
              target="_blank"
              :href="pubmedLink(value)"
            > {{ value }}</a>
            <a
              v-else-if="index == 'Doi' && value"
              target="_blank"
              :href="doiLink(value)"
            > {{ doiString(value) }}</a>
            <span v-else>
              {{ value }}
            </span>
          </td>
        </tr>
      </mdb-tbl-body>
    </mdb-tbl>
    <div v-else class="h3">
      No citations for this assay.
    </div>
  </div>
</template>

<script>
import {
  mdbTbl, mdbTblHead, mdbTblBody,
} from 'mdbvue'

export default {
  name: 'HtppCitations',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
  },
  props: {
    citations: {
      default: () => [],
      type: Array,
    },
  },
  methods: {
    pubmedLink(id) {
      return `http://www.ncbi.nlm.nih.gov/pubmed/${id}`
    },
    doiLink(id) {
      const urlString = id.split('doi: ')[1]
      return `https://doi.org/${urlString}`
    },
    doiString(id) {
      const urlString = id.split('doi: ')[1]
      return `${urlString}`
    },
  },
}
</script>
