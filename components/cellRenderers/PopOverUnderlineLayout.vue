<template>
  <span>
    <mdb-popover v-if="popText" :append-to-body="true" size="sm" trigger="hover" :options="{placement: popTextPlacement}">
      <span slot="body" v-html="popText" />
      <div slot="reference">

        <a
          v-if="isLink"
          :href="display"
          class="align-content-start flex-wrap popoverLabel"
          target="_blank"
          rel="noopener noreferrer"
          v-html="display"
        />
        <span v-else class="align-content-start flex-wrap popoverLabel" v-html="display" />
      </div>
    </mdb-popover>
    <a
      v-if="isLink && !popText"
      rel="noopener noreferrer"
      target="_blank"
      :href="display"
      v-html="display"
    />
    <span v-else-if="!popText" v-html="display" />
  </span>
</template>

<script>
import {
  mdbPopover,
} from 'mdbvue';

export default {
  name: 'PopOverUnderlineLayout',
  components: {
    mdbPopover,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['display', 'popText', 'popTextPlacement', 'isLink'],
};
</script>
<style scoped lang="scss">
.popoverLabel {
  text-overflow: ellipsis !important;
  border-bottom:1px dashed;
  cursor: help;
}
</style>
