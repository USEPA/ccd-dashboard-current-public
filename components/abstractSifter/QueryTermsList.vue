<template>
  <b-list-group
    class="mt-1"
    :cy-data="selectedQueryTerms"
    :style="{ height: listHeight, overflowY: 'auto' }"
  >
    <b-list-group-item
      v-for="term in selectedQueryTerms"
      :key="term.label"
      data-cy="selectedQueryItem"
      :title="`Click to remove ${term.label}`"
      class="list-items"
      button
      tabindex="0"
      @click="termRemoveHandler(term)"
      @keyup.enter="termRemoveHandler(term)"
      @keyup.space="termRemoveHandler(term)"
    >
      <mdb-icon icon="times" size="lg" class="mr-2" /> {{ term.label }}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import {
  mdbIcon,
} from 'mdbvue';

export default {
  name: 'QueryTermsList',
  components: {
    mdbIcon,
  },
  props: {
    selectedQueryTerms: {
      type: Array,
      required: true,
    },
    textAreaId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      listHeight: '80px',
    };
  },
  mounted() {
    const textAreaElement = document.getElementById(this.textAreaId);
    const ro = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect) {
        const textAreaHeight = entries[0]?.contentRect?.height || 80;
        const updatedListHeight = textAreaHeight > 80 ? textAreaHeight : 80;
        this.listHeight = `${updatedListHeight}px`;
      }
    });
    // Check element exists and is valid before adding observer
    if (textAreaElement && textAreaElement instanceof Element) {
      ro.observe(textAreaElement);
    }
  },
  methods: {
    termRemoveHandler(term) {
      this.$emit('removeTerm', term);
    },
  },
};
</script>

<style scoped>
.list-items {
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
  background-color: #0e6993;
  color: white;
  margin-bottom: 2px;
}

.list-items:hover, .list-items:focus {
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15)
}
</style>
