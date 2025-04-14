<template>
  <mdb-modal
    size="xl"
    :show="getShowAssayDetailsModal"
    @close="setShowAssayDetailsModal(false)"
  >
    <mdb-modal-header id="imageModalTitle">
      <mdb-modal-title>Assay Details - {{ getSelectedActorAssayName }}</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body class="m-0 p-0">
      <section v-if="getActorAssayDetails" class="assay-details">
        <actor-assay-details />
      </section>
      <section v-if="getActorAssayComponents" class="assay-components">
        <actor-assay-components />
      </section>
    </mdb-modal-body>
  </mdb-modal>
</template>

<script>
import {
  mapMutations, mapGetters, mapActions,
} from 'vuex'
import {
  mdbModal, mdbModalBody, mdbModalHeader, mdbModalTitle,
} from 'mdbvue'
import ActorAssayDetails from '~/components/actor/ActorAssayDetails.vue'
import ActorAssayComponents from '~/components/actor/ActorAssayComponents.vue'

export default {
  name: 'ActorDetailsModal',
  components: {
    mdbModal,
    ActorAssayDetails,
    ActorAssayComponents,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
  },
  data() {
    return {
      showGrid: false,
    }
  },
  computed: {
    ...mapGetters({
      getShowAssayDetailsModal: 'actor/getShowAssayDetailsModal',
      getActorAssayDetails: 'actor/getActorAssayDetails',
      getActorAssayComponents: 'actor/getActorAssayComponents',
      getSelectedActorAssayName: 'actor/getSelectedActorAssayName',
    }),
  },
  created() {
    this.$nuxt.$on('actorDetailsModal', (params) => {
      this.assayDetailsModal(params)
    })
  },
  methods: {
    ...mapActions({
      fetchAssayDetails: 'actor/assayDetailsSearch',
      fetchAssayComponents: 'actor/assayComponentSearch',
    }),
    ...mapMutations({
      setShowAssayDetailsModal: 'actor/setShowAssayDetailsModal',
    }),
    async assayDetailsModal(params) {
      const assayDetails = await this.fetchAssayDetails(params.qs)
      const assayComponents = await this.fetchAssayComponents(params.assayId)
      this.$nextTick(() => {
        this.setShowAssayDetailsModal(true)
      })
    },
  },
}
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

.modal-dialog {
    position: relative;
    width: auto;
    pointer-events: none;
}
.modal-header {
  padding: 0.5rem !important;
}
.modal-title {
    margin-bottom: 0;
    line-height: 1.5;
    font-size: 1.3em !important;
    font-weight: 500 !important;
    color: $primary-color-dark !important;
}

.modal-xl {
    max-width: 80% !important;
}
</style>
