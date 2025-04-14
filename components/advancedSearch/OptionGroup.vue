<template>
  <div class="border border-light mt-4 p-4">
    <formula-req-checkbox
      :checkid="formulaCheck"
      :req="formulaReq()"
      @onCheck="onFormulaCheck"
    />
    <div class="d-flex flex-row flex-wrap">
      <option-range-input
        v-for="op in currentOptions"
        ref="childRangeInput"
        :key="op.name"
        :option="op"
        @onInput="updateFormulaRequirements"
      />
    </div>
    <mdb-popover trigger="hover" :options="{placement: 'bottom'}" class="w-25">
      <span slot="body" data-cy="warning-msg">
        <mdb-icon icon="exclamation-circle" />
        {{ errorMessage }}
      </span>
      <div slot="reference" class="input-group w-75 mt-4 d-flex align-items-center">
        <div class="input-group-preappend">
          <span class="input-group-text">Other options</span>
        </div>
        <input
          v-model="otherOptions"
          type="text"
          class="form-control"
          :placeholder="'Additional requirements'"
          @keyup="validateInput"
        >
        <mdb-btn
          class="blue ml-4"
          size="md"
          outline="blue"
          @click="resetOptions"
        >
          Reset Options
        </mdb-btn>
      </div>
    </mdb-popover>
  </div>
</template>

<script>
import {
  mdbBtn, mdbIcon, mdbPopover,
} from 'mdbvue'
import OptionRangeInput from '~/components/advancedSearch/OptionRangeInput.vue'
import FormulaReqCheckbox from '~/components/advancedSearch/FormulaReqCheckbox.vue'

export default {
  name: 'OptionGroup',
  components: {
    FormulaReqCheckbox,
    OptionRangeInput,
    mdbBtn,
    mdbIcon,
    mdbPopover,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      includeHalogens: false,
      formulaCheck: 'formulaCheck',
      otherOptions: '',
      noError: false,
      errorMessage: 'Please use the format of formula requirements above.',
      currentOptions: this.copyArr(this.options[0]),
    }
  },
  computed: {

  },
  beforeMount() {
    this.$emit('onChange', this.formulaReq())
  },
  methods: {
    formulaReq() {
      let req = ''
      this.currentOptions.forEach((op) => { req += `${op.name}${op.min}-${op.max} ` })
      req += this.otherOptions
      this.$emit('onChange', req)
      return req
    },
    onFormulaCheck(checked) {
      this.includeHalogens = checked
      this.currentOptions = this.includeHalogens ?
        this.copyArr(this.options[1]) : this.copyArr(this.options[0])
    },
    resetOptions() {
      for (let i = 0; i < this.$refs.childRangeInput.length; i += 1) {
        this.$refs.childRangeInput[i].clearInput()
      }
      this.currentOptions = this.includeHalogens ?
        this.copyArr(this.options[1]) : this.copyArr(this.options[0])
      this.otherOptions = ''
    },
    updateFormulaRequirements(minOrMax, id, value) {
      if (minOrMax === 'min') {
        this.currentOptions[id].min = value !== '' ? value : this.options[1][id].min
      } else {
        this.currentOptions[id].max = value !== '' ? value : this.options[1][id].max
      }
      // emit formula requirement string for search str purpose.
      this.$emit('onChange', this.formulaReq())
    },
    copyArr(arr) {
      return arr.map(a => ({...a}))
    },
    validateInput() {
      const regex = /([A-Z][a-z]{0,1}\[[\d]+[-][\d]+\])+/
      const match = this.otherOptions.match(regex)
      if (this.otherOptions !== '' && match !== null) {
        this.noError = match[0] === this.otherOptions
      } else {
        this.noError = false
      }
      if (this.$el.querySelector('.show') !== null) {
        this.$el.querySelector('.show').style.opacity = this.noError ? 0 : 1
      }
      return this.noError
    },
  },
}
</script>
