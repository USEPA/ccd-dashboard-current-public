<template>
  <div>
    <div class="buttons">
      <copy-text
        id="dataset"
        :tip-text="'Copy Dataset'"
        :copy-data="dataset"
        :copy-type="'htppDetails'"
      />
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
          <tr v-for="(value, index) in dataset" :key="index">
            <td class="text-nowrap" data-cy="tableRowTextDataset">
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
  name: 'HtppDataset',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
  },
  props: {
    dataset: {
      default: null,
      type: Object,
    },
  },
}
</script>
