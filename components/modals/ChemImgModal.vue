<template>
  <mdb-modal
    size="lg"
    :show="getModalInfo().visible"
    @close="setModalVisibility(false)"
  >
    <mdb-modal-header id="imageModalTitle">
      <mdb-modal-title>{{ getModalInfo().name }}</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body class="d-flex justify-content-center">
      <img :src="modalImageURL" height="550">
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mapMutations, mapState, mapGetters,
} from 'vuex';
import {
  mdbModal, mdbModalBody, mdbModalHeader, mdbModalTitle, mdbBadge,
} from 'mdbvue';

export default {
  name: 'ChemImgModal',
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
  },
  computed: {
    imageUrl() {
      return 'imageUrl';
    },
    imageApi() {
      const path = this.apiSettings().CHEMICAL_IMAGE_API;
      return path;
    },
    ...mapGetters('results', ['getModalInfo', 'getChemicals']),
    modalImageURL() {
      const {gsid} = this.getModalInfo();
      const {imageBy} = this.getModalInfo();
      const url = `${process.env.APPLICATION_BASE_API}${this.imageApi}${imageBy}/${gsid}`;
      return url;
    },
  },
  methods: {
    ...mapMutations({
      setChemicalImage: 'results/setChemicalImage',
      setModalVisibility: 'results/setModalVisibility',
    }),
  },
};
</script>
