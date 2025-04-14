<template>
  <mdb-modal
    size="lg"
    :show="showImageZoom"
    @close="showImageZoom=false"
  >
    <mdb-modal-header id="zoomModal">
      {{ title }}
    </mdb-modal-header>
    <mdb-modal-body class="d-flex justify-content-center">
      <img :src="imagePath" height="550">
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mapGetters,
} from 'vuex'
import {
  mdbModal, mdbModalBody, mdbModalHeader,
} from 'mdbvue'

export default {
  name: 'ImageZoomModal',
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
  },
  props: {
    imageWidth: {
      type: String,
      default: () => '',
    },
    imageHeight: {
      type: String,
      default: () => '',
    },

  },
  data() {
    return {
      showImageZoom: false,
      imagePath: null,
      title: '',
    }
  },
  created() {
    this.$nuxt.$on('zoomImage', (data) => {
      this.imagePath = data.image
      this.showImageZoom = true
    })
  },
}
</script>
