<template>
  <div>
    <mdb-btn color="primary" @click.native="toggleVisibility">
      <mdb-icon icon="search-plus" />
    </mdb-btn>
    <mdb-modal size="xl" :show="visibility" info @close="toggleVisibility">
      <mdb-modal-header class="primary-color lighten-1" :close="true">
        <h3 class="white-text">
          Dose Response Summary Value Plots
        </h3>
      </mdb-modal-header>
      <mdb-modal-body class="pr-0" style="maxWidth: 90% !important;">
        <mdb-container fluid class="graphModal pr-0">
          <Pods :width="width" :height="height" />
        </mdb-container>
      </mdb-modal-body>
    </mdb-modal>
  </div>
</template>

<script>
import {
  mdbModal,
  mdbModalHeader,
  mdbModalBody,
  mdbContainer,
  mdbBtn,
  mdbIcon,
} from 'mdbvue';
import Pods from './Pods.vue';

export default {
  name: 'GraphModal',
  components: {
    Pods,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbContainer,
    mdbBtn,
    mdbIcon,
  },
  props: {
    visibility: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Object,
      default: null,
    },
    graph: String,
  },
  data() {
    return {
      modal: null,
      width: 680,
      height: 760,
    };
  },
  methods: {
    toggleVisibility() {
      this.$emit('toggleVisibility');
    },
  },
};
</script>

<style lang="scss" scoped>
.graphModal {
  background: white;
  padding-right: 0px !important;
  max-height: 600px;
  min-height: 400px;
  margin-top: 2em;
  overflow: auto;
}
.graph {
    width: 980px;
    height: 860px;
}
.animation-content .modal-content {
  width: auto !important;
}
</style>
