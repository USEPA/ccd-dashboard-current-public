<template>
  <div>
    <mdb-btn class="p-1 mt-1" size="sm" color="info" icon="edit" @click="doEdit" />
  </div>
</template>

<script>
import {
  mdbBtn,
} from 'mdbvue'

export default {
  name: 'EditorButton',
  components: {mdbBtn},
  computed: {
    display() {
      const data = this.params.value
      return data
    },
  },

  methods: {
    doEdit() {
      this.params.context.componentParent.showEditModal(this.params.node.id)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
