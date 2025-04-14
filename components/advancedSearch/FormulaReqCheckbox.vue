<template>
  <div class="mt-2 d-flex flex-row">
    <span>Formula Requirements: <mark>{{ req }}</mark></span>
    <div class="custom-control custom-checkbox ml-4">
      <input
        id="FormulaRequirementCheck"
        type="checkbox"
        class="custom-control-input"
        @change="emitFormulaReqCheckbox"
      >
      <label
        class="custom-control-label"
        for="FormulaRequirementCheck"
      >
        Include Halogens
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormulaReqCheckbox',
  components: {
  },
  props: {
    req: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      checked: false,
    }
  },
  methods: {
    emitFormulaReqCheckbox() {
      this.checked = !this.checked
      this.$emit('onCheck', this.checked)
    },
  },
}
</script>
