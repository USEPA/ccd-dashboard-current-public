<template>
  <div class="d-flex flex-row ml-4">
    <div class="custom-control custom-radio mr-4 align-self-center">
      <input
        :id="`option1-${cname}`"
        ref="r1"
        v-model="selected"
        type="radio"
        class="custom-control-input"
        :name="`searchTypeRadios-${cname}`"
        :value="0"
        :disabled="config.disabled[0]"
        :checked="config.selected[0]"
      >
      <label class="custom-control-label" :for="`option1-${cname}`">
        {{ config.labels[0] }}
      </label>
    </div>
    <div class="custom-control custom-radio mr-4 align-self-center">
      <input
        :id="`option2-${cname}`"
        ref="r2"
        v-model="selected"
        type="radio"
        class="custom-control-input"
        :name="`searchTypeRadios-${cname}`"
        :value="1"
        :disabled="config.disabled[1]"
        :checked="config.selected[1]"
      >
      <label class="custom-control-label" :for="`option2-${cname}`">
        {{ config.labels[1] }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridTwoRadioBtn',
  components: {
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => { },
    },
    labels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      b1: true,
      selected: 0,
    };
  },
  watch: {
    selected(n, o) {
      this.emitChoice(n);
    },
  },
  methods: {
    emitChoice(choice) {
      this.$emit('onChange', choice);
    },
  },
};
</script>
