<template>
  <div class="d-flex flex-row mt-4">
    <div class="custom-control custom-radio mr-4">
      <input
        :id="`option1-${cname}`"
        type="radio"
        class="custom-control-input"
        :name="`searchTypeRadios-${cname}`"
        :radio-value="`option1-${cname}`"
        checked
        @input="emitChoice(0)"
      >
      <label class="custom-control-label" :for="`option1-${cname}`">
        {{ labels[0] }}
      </label>
    </div>
    <div class="custom-control custom-radio">
      <input
        :id="`option2-${cname}`"
        type="radio"
        class="custom-control-input"
        :name="`searchTypeRadios-${cname}`"
        :radio-value="`option1-${cname}`"
        @input="emitChoice(1)"
      >
      <label class="custom-control-label" :for="`option2-${cname}`">
        {{ labels[1] }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoRadioBtn',
  components: {
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    labels: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    emitChoice(choice) {
      this.$emit('onChange', choice)
    },
  },
}
</script>

