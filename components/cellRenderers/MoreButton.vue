<template>
  <span>
    <button type="button" class="btn btn-sm btn-default more-btn" @click="emitRowClick">
      <mdb-icon :icon="icon" />
    </button>


  </span>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import {
  mdbIcon,
} from 'mdbvue'

export default {
  name: 'MoreButton',
  components: {

    mdbIcon,
  },
  data() {
    return {
      icon: 'file',
    }
  },
  computed: {

    display() {
      const r = this.params.value
      return r
    },

  },
  mounted() {},
  methods: {
    emitRowClick(p) {
      console.log('more btn click', this.params)
      this.params.context.componentParent.showMoreModal(this.params.data)
      // this.$emit('onMoreBtnClick', this.params.data)
    },
  },
}
</script>

<style scoped >
.more-btn{
  width:20px;
  padding: .5rem .7rem;
  font-size:12px;
}
</style>
