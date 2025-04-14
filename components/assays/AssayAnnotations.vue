<template>
  <div>
    <div class="buttons">
      <copy-text id="annotations" :tip-text="'Copy annotations'" :copy-data="annotations" :copy-type="'assayDetails'" />
    </div>
    <div class="table-responsive">
      <mdb-tbl>
        <mdb-tbl-head>
          <tr>
            <th class="text-nowrap">
              Index
            </th>
            <th>Value</th>
          </tr>
        </mdb-tbl-head>
        <mdb-tbl-body>
          <tr v-for="(value, index) in annotations" :key="index">
            <td class="text-nowrap">
              {{ index }}
            </td>
            <td>{{ value }}</td>
          </tr>
        </mdb-tbl-body>
      </mdb-tbl>
    </div>
  </div>
</template>

<script>
import {
  mdbTbl, mdbTblHead, mdbTblBody,
} from 'mdbvue'

export default {
  name: 'AssayAnnotations',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
  },
  props: {
    annotations: {
      default: null,
      type: Object,
    },
  },
}
</script>
