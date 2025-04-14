<template>
  <mdb-modal size="xl" data-cy="assay-modal" :show="visibility" info @close="toggleVisibility">
    <mdb-modal-header class="primary-color lighten-1" :close="true">
      <slot name="header">
        <h3 class="white-text">
          <mdb-icon icon="table" class="mr-4 white-text" />{{ title }}
          <NuxtLink :title="title" :to="'/assay-endpoints/'+title">
            <i class="fas fa-link" style="color:white" />
          </NuxtLink>
        </h3>
      </slot>
    </mdb-modal-header>
    <mdb-modal-body class="assayModal pr-0">
      <slot name="tabs">
        <assay-detail-tabs :endpoint-name="title" class="pr-0" />
      </slot>
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mdbModal,
  mdbIcon,
  mdbModalHeader,
  mdbModalBody,
} from 'mdbvue'

import AssayDetailTabs from '~/components/assays/AssayDetailTabs.vue'

export default {
  name: 'AssaysModal',
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbIcon,
    AssayDetailTabs,
  },
  props: {
    title: {
      default: '',
      type: String,
    },
    visibility: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      aopI: [],
    }
  },
  methods: {
    toggleVisibility() {
      this.$emit('toggleVisibility')
    },

  },
}
</script>

<style scoped lang="scss">
  .assayModal {
    background: white;
    max-height: 80%;
    overflow-x: auto;
    width: 100%;
  }

.modal-dialog {
    width: 80%;
    margin: 1.75rem auto;
}
.tab-details {
   color: black;
   max-height: 600px;
   min-height: 400px;
   margin-top: 2em;
   overflow: auto;
   .nav-link {
     color: black !important;
   }
 }
</style>
