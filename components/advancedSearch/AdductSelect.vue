<template>
  <div class="d-flex flex-row">
    <!-- <mdb-select
      id="adduct-select"
      v-model="labelOptions"
      label="Adduct"
      wrapper-class="adduct-wrapper"
      placeholder="Choose one or all adducts"
      @getValue="emitAdductChoice"
    /> -->

    <select v-model="s1" class="browser-default custom-select adduct-select" @change="emitAdductChoice">
      <option
        v-for="option in labelOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
import {mdbSelect} from 'mdbvue'

export default {
  name: 'AdductSelect',
  components: {
    mdbSelect,
  },
  props: {
    labelOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      s1: 0,
      adductOpts: [],
    }
  },
  created() {
    this.adductOpts = [...this.labelOptions]
  },
  methods: {
    emitAdductChoice(value) {
      this.$emit('onSelect', this.s1)
    },
  },
}
</script>
<style >
  .adduct-select{
    width:200px;
    font-size:14px;
  }

</style>
