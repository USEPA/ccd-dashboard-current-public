<template>
  <div>
    <div v-if="display" class="rowFlag">
      <span v-if="quality === 'Valid' " class="font-weight-bold"> {{ display }}</span>
      <span v-else-if="quality === 'Good'" class="font-italic">{{ display }}</span>
      <span v-else class="font-weight-normal">{{ display }}</span>
      <span v-if="quality === 'Beilstein'" class="badge" style="background-color: #209cee !important;">Beilstein Registry Number</span>
      <span v-else-if="quality.startsWith('UNII')" class="badge info">FDA Registry Number</span>
      <span v-else-if="quality === 'Alternate'" class="badge badge-warning">Alternate CAS-RN</span>
      <span v-else-if="quality === 'Deleted'" class="badge badge-danger">Deleted CAS-RN</span>
      <span v-else-if="display.match(/^\d{2,7}-\d{2}-\d{1}$/)" class="badge badge-success">Active CAS-RN</span>
    </div>
    <div v-else-if="displayName" class="rowFlag">
      <span v-if="quality === 'Valid' " class="font-weight-bold" v-html="displayName" />
      <span v-else-if="quality === 'Good'" class="font-italic" v-html="displayName" />
      <span v-else class="font-weight-normal" v-html="displayName" />
      <span v-if="quality === 'Beilstein'" class="badge" style="background-color: #209cee !important;">Beilstein Registry Number</span>
      <span v-else-if="quality.startsWith('UNII')" class="badge info">FDA Registry Number</span>
      <span v-else-if="quality === 'Alternate'" class="badge badge-warning">Alternate CAS-RN</span>
      <span v-else-if="quality === 'Deleted'" class="badge badge-danger">Deleted CAS-RN</span>
      <span v-else-if="displayName.match(/^\d{2,7}-\d{2}-\d{1}$/)" class="badge badge-success">Active CAS-RN</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SynonymRenderer',
  computed: {
    display() {
      const data = this.params.value
      if (this.params.value.length > 10) {
        // data = this.params.value.replace(/~(\d+)~/g, '<sup>$1</sup>')
        // .replace(/_(\d+)_/g, '<sub>$1</sub>')
        return false
      }
      return data
    },
    displayName() {
      let data = this.params.value
      if (this.params.value.length > 10) {
        data = this.params.value.replace(/~(\d+)~/g, '<sup>$1</sup>')
        // .replace(/_(\d+)_/g, '<sub>$1</sub>')
        return data
      }
      return false
    },
    quality() {
      const qual = this.params.data.quality
      return qual
    },
  },
}
</script>

<style lang="scss" scoped>
.rowFlag {
  // display: block;
  // width: 90%;
  // height: auto;
  // font-size: .80rem;
  // // white-space: normal;
}
 .badge{
    height: auto !important;
    margin-bottom: 5px !important;
    padding-top: 3px;
    margin-left: 5px;
    span {
      text-align: center;
      word-wrap: normal;
      height: 100px;
      }
  }
  .info{
      background-color: #209cee !important;
    }
</style>
