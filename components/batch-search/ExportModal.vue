<template>
  <mdb-modal
    size="md"
    data-cy="batch-modal"
    :show="visibility"
    @shown="handleShown"
    @close="toggleVisibility"
  >
    <mdb-modal-header class="primary-color lighten-1" :close="true">
      <h3 class="white-text">
        {{ title }}
      </h3>
    </mdb-modal-header>
    <mdb-modal-body class="batchModal pr-0" style="padding:20px">
      <div class="pr-3">
        <mdb-progress v-show="exportDownloadLink == ''" bg-color="info-color" :height="20" indeterminate />
      </div>

      <p>
        Your export request is being processed. <br>
        Requests with lots of additional fields or Enhanced Data sheets will take longer to process.
      </p>
      <div v-show="exportDownloadLink != ''" class="text-center">
        <a
          style="color:#FFF !important"
          class="btn  btn-default "
          :href="exportDownloadLink"
          @click="hideAfterDownload"
        >
          Download File
        </a>
      </div>
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mdbModal,
  mdbModalHeader,
  mdbModalBody,
  mdbProgress,
} from 'mdbvue'


export default {
  name: 'ExportModal',
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbProgress,

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

    exportDownloadLink: {type: String, default: 'Waiting for Link'},
  },
  data: () => ({
    done: false,

  }),
  beforeMount() {


  },
  methods: {
    handleShown(e) {

    },

    hideAfterDownload() {
      this.$emit('downloaded')
    },

    toggleVisibility() {
      this.showGrid = false
      this.$emit('toggleVisibility')
    },


  },
}
</script>

<style lang="scss">
  .batchModal {
    background: white;
    height:300px;
    width: 100%;
    padding:0;
  }

.modal-dialog {
    width: 80%;
    margin: 1.75rem auto;
}

</style>
