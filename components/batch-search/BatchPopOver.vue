<template>
  <span>
    <mdb-popover v-if="popText" :append-to-body="true" size="sm" trigger="hover" :options="{placement: popTextPlacement}">
      <span slot="body" v-html="popText" />
      <div slot="reference">
        <span class="align-content-start flex-wrap batchPopoverLabel" v-html="display" />
      </div>
    </mdb-popover>
    <span v-if="!popText" v-html="display" />
  </span>
</template>

<script>
import {
  mdbPopover,
} from 'mdbvue';

export default {
  name: 'BatchPopOver',
  components: {
    mdbPopover,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['display', 'popText', 'popTextPlacement'],
};

</script>
<style scoped lang="scss">
.batchPopoverLabel {
  text-overflow: ellipsis !important;
  border-bottom:1px dashed;
  cursor: help;
}
</style>
