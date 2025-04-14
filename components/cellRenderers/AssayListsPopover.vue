<template>
  <div class="mt-1 mb-2">
    <span v-if="listArray">
      <mdb-popover
        v-for="(list, idx) in listArray"
        :key="list.assay_list_id + '_' + idx"
        :append-to-body="true"
        size="sm"
        trigger="hover"
        :options="{placement: 'top'}"
      >
        <span slot="body">{{ list.assay_list_descr }}</span>
        <span slot="reference" class="align-content-start  popoverLabel">
          {{ list.assay_list_nm }}
          <span v-if="idx !== listArray.length - 1" style="color:#aaa"> <br> </span>
        </span>
      </mdb-popover>
    </span>
    <span v-else>
      -
    </span>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import {
  mdbPopover,
} from 'mdbvue'

export default {
  name: 'AaayListsPopover',
  components: {
    mdbPopover,
  },
  data() {
    return {
      icon: 'info-circle',
    }
  },
  computed: {
    listArray() {
      if (this.params.data.assayList) {
        return this.params.data.assayList
      }
      return ''
    },
  },
}
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
