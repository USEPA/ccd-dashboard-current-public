<template>
  <mdb-popover trigger="hover" :options="{placement: 'bottom'}">
    <span slot="body" data-cy="warning-msg">
      <mdb-icon icon="exclamation-circle" />
      {{ errorMessage[searchType] }}
    </span>
    <div slot="reference" class="input-group w-75 mt-4 d-flex align-items-center">
      <input
        v-model="input1"
        type="text"
        class="form-control"
        :placeholder="placeholder[0]"
        pattern="[0-9]+([\.][0-9]+)?"
        step="0.01"
        required
        @input="validateInput()"
      >
      <div class="input-group-append">
        <span class="input-group-text">{{ label }}</span>
      </div>
      <input
        v-model="input2"
        type="text"
        class="form-control"
        :placeholder="placeholder[1]"
        pattern="[0-9]?([\.][0-9]+)?"
        step="0.01"
        required
        @input="validateInput()"
      >
      <div class="input-group-append">
        <span
          class="input-group-text search-unit"
          :class="{'active-unit': unit === 'Da'}"
          @click="changeUnit('Da')"
        >
          Da
        </span>
      </div>
      <div v-if="searchType===0" class="input-group-append">
        <span
          class="input-group-text search-unit"
          :class="{'active-unit': unit === 'ppm'}"
          @click="changeUnit('ppm')"
        >
          ppm
        </span>
      </div>
      <mdb-btn
        class="blue ml-4"
        size="md"
        :disabled="!noError"
        @click="emitSearchData(input1, input2, unit)"
      >
        <mdbIcon
          icon="search"
          class="text-white"
        />
        Search
      </mdb-btn>
    </div>
  </mdb-popover>
</template>

<script>
import {
  mdbIcon, mdbBtn, mdbPopover,
} from 'mdbvue'

export default {
  name: 'RangeSearch',
  components: {
    mdbIcon,
    mdbBtn,
    mdbPopover,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
    searchType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      input1: '',
      input2: '',
      noError: false,
      unit: 'Da',
      errorMessage: ['Input requirements: 0 ≤ error(Da) ≤ 0.5; 0 ≤ error(ppm) ≤ 25 and must be integer.', 'Input requirements: min and max must be numbers and min < max.'],
    }
  },
  methods: {
    emitSearchData() {
      this.$emit('onSearch', this.input1, this.input2, this.unit)
    },
    changeUnit(unit) {
      this.unit = unit
      if (this.unit === 'ppm') {
        this.input2 = '5'
      } else {
        this.input2 = ''
      }
      this.validateInput()
    },
    validateInput() {
      this.noError = false
      this.input1 = this.input1.replace(/[a-zA-Z]!@#/g, '')
      this.input2 = this.input2.replace(/[a-zA-Z]/g, '')
      const num1 = Number(this.input1)
      const num2 = Number(this.input2)
      // validate input.
      if (!Number.isNaN(num1) && !Number.isNaN(num2)) {
        if (this.searchType === 0) {
          this.noError = true
          if (this.unit === 'Da') {
            num2 <= 0.5 && num2 >= 0 ? this.noError = true : this.noError = false
          }
          if (this.unit === 'ppm') {
            Number.isInteger(num2) && num2 <= 25 && num2 >= 0 ? this.noError = true : this.noError = false
          }
        }
        if (this.searchType === 1 && num1 < num2) {
          this.noError = true
        }
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

<style lang="scss">
@import "~/assets/styles/_custom-variables.scss";
.search-unit {
  cursor: pointer;
}

.active-unit {
  background-color: $blue-lighten-4;
}
</style>
