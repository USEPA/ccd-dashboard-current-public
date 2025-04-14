<template>
  <b-modal
    v-model="dialog"
    centered
    hide-footer
    size="lg"
    title="Search structures"
  >
    <ketcher ref="ketcher" />

    <div class="container">
      <div class="row">
        <div class="col" />
        <div class="col-1">
          <b-button
            variant="primary"
            @click="onAdd()"
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Ketcher from './Ketcher.vue'

// eslint-disable-next-line no-undef
const eventBus = new Vue()

export default {
  components: {
    ketcher: Ketcher,
  },

  data() {
    return {
      dialog: false,
    }
  },

  created() {
    eventBus.$on('OPEN_DRAW_DIALOG', (mol) => {
      const self = this
      self.dialog = true
      if (mol) { self.$refs.ketcher.setMolecule(mol) }
    })
  },

  methods: {
    onAdd() {
      const self = this
      eventBus.$emit('ADD_STRUCTURE', self.$refs.ketcher.getSmiles())
      this.dialog = false
    },
  },
}
</script>
