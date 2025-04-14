<template>
  <mdb-tbl>
    <mdb-tbl-head>
      <tr>
        <th v-for="(value, index) in records[0]" :key="index">
          {{ index }}
        </th>
      </tr>
    </mdb-tbl-head>
    <mdb-tbl-body>
      <tr v-for="record in records" :key="record.keyName">
        <td v-for="(value, index) in record" :key="index">
          <span>
            {{ value }}
          </span>
        </td>
      </tr>
    </mdb-tbl-body>
  </mdb-tbl>
</template>

<script>
import {
  mdbTbl, mdbTblHead, mdbTblBody,
} from 'mdbvue'

export default {
  name: 'AssayDetailTable',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
  },
  props: {
    records: {
      default: () => [],
      type: Array,
    },
    keyName: {
      default: '',
      type: String,
    },
  },
}
</script>
