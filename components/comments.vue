<template>
  <mdb-modal data-cy="ccte-feedback" :show="visibility" info remove-backdrop @close="toggleVisibility">
    <mdb-modal-header class="primary-color lighten-1" :close="true">
      <h3 class="white-text ">
        <i class="fas fa-envelope mr-4" />New Comment
      </h3>
    </mdb-modal-header>
    <mdb-modal-body>
      <CcteContactForm
        ref="contactForm"
        form-type="comments"
        :selected="selectedObj"
        @closeModal="toggleVisibility"
      />
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mdbModal,
  mdbModalHeader,
  mdbModalBody,
} from 'mdbvue';
import CcteContactForm from '~/components/forms/CcteContactForm.vue';

export default {
  name: 'Comments',
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    CcteContactForm,
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
  },
  data() {
    return {
      selectedObj: this.selected,
    };
  },
  methods: {
    toggleVisibility() {
      this.$emit('toggleVisibility');
    },
  },
};
</script>

