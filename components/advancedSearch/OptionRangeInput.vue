<template>
  <mdb-popover trigger="hover" :options="{placement: 'bottom'}" class="w-25">
    <span slot="body" data-cy="warning-msg">
      <mdb-icon icon="exclamation-circle" />
      {{ errorMessage }}
    </span>
    <div slot="reference" class="input-group mt-4 pr-4">
      <div class="input-group-preappend">
        <span class="input-group-text">{{ option.name }}: </span>
      </div>
      <input
        v-model="input1"
        type="text"
        class="form-control"
        :placeholder="defaultOption.min"
        pattern="[0-9]+"
        @input="emitUpdatedInput('min')"
      >
      <div class="input-group-append">
        <span class="input-group-text">to</span>
      </div>
      <input
        v-model="input2"
        type="text"
        class="form-control"
        :placeholder="defaultOption.max"

        @input="emitUpdatedInput('max')"
      >
    </div>
  </mdb-popover>
</template>

<script>
import {mdbIcon, mdbPopover} from 'mdbvue'

export default {
  name: 'OptionRangeInput',
  components: {
    mdbIcon,
    mdbPopover,
  },
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      input1: '',
      input2: '',
      defaultOption: {...this.option},
      noError: false,
      errorMessage: 'Input requirements: min ≥ 0, max ≤ 100 and min < max.',
    }
  },
  beforeMount() {
    this.input1 = this.option.defaultMin
    this.input2 = this.option.defaultMax
  },
  methods: {
    clearInput() {
      this.input1 = this.option.defaultMin
      this.input2 = this.option.defaultMax
    },
    emitUpdatedInput(minOrMax) {
      this.validateInput()
      if (minOrMax === 'min') {
        this.input1 = this.input1.replace(/\D/g, '')
        this.$emit('onInput', 'min', this.option.id, this.input1)
      } else if (minOrMax === 'max') {
        this.input2 = this.input2.replace(/\D/g, '')
        this.$emit('onInput', 'max', this.option.id, this.input2)
      }
    },
    validateInput() {
      this.noError = false
      const num1 = Number(this.input1)
      const num2 = Number(this.input2)

      // validate input.
      if (!Number.isNaN(num1) && !Number.isNaN(num2) &&
          num1 < num2 && num1 >= 0 && num2 <= 100) {
        this.noError = true
      }
      if (this.input1 === '' || this.input2 === '') {
        this.noError = false
      }

      // hide warning message when input is valid.
      if (this.$el.querySelector('.show') !== null) {
        this.$el.querySelector('.show').style.opacity = this.noError ? 0 : 1
      }

      return this.noError
    },
  },
}
</script>
