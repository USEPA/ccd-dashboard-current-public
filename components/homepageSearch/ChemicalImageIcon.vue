<template>
  <div class="chemicalImage" :class="{level: !data.image}">
    <div v-if="data.hasStructureImage === false" class="relatedText" style="float:left; margin-right:12px;" />
    <img v-if="data.hasStructureImage" width="45" height="45" :src="imageUrl(data.dtxcid)" style="float:left; margin-right:12px;">
  </div>
</template>

<script>
export default {
  name: 'ChemicalIcon',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    border: {
      type: Boolean,
      default() {
        return false;
      },
    },
    height: {
      type: String,
      default() {
        return '45';
      },
    },
    width: {
      type: String,
      default() {
        return '45';
      },
    },
  },
  computed: {
    imageApi() {
      const path = this.apiSettings().CHEMICAL_IMAGE_API;
      return path;
    },
  },
  methods: {
    imageUrl(id) {
      const url = `${process.env.APPLICATION_BASE_API}${this.imageApi}by-dtxcid/${id}`;
      return url;
    },
  },
};

</script>

<style scoped>
.chemicalImage.level {
  text-align: center;
  width: 100%;
}
.chemicalIcon {
  display: block;
  width: 25px;
  height: 25px;
}
.border {
  border: 2px solid darkslategrey !important;
}

.relatedText{
  height:45px;
  width:45px;
  font-size:8px;
  margin-top:9px;
  padding-top:8px;
}
</style>
