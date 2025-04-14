<template>
  <mdb-popover trigger="hover" :options="{placement: 'bottom'}">
    <span slot="body" data-cy="warning-msg">
      <mdb-icon icon="exclamation-circle" />
      {{ placeholder }}
    </span>
    <div slot="reference" class="input-group mt-4 d-flex align-items-center">
      <input
        v-model="input"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        :aria-label="`${cname}Search`"
        :data-cy="`${cname}Input`"
        @keyup="validateInputFormat"
      >
      <div class="input-group-append">
        <mdb-btn
          data-cy="buttonSearch"
          class="blue m-0"
          size="md"
          :disabled="!noError"
          @click="emitSearchData"
        >
          <mdbIcon
            icon="search"
            class="text-white"
          />
          Search
        </mdb-btn>
      </div>
    </div>
  </mdb-popover>
</template>

<script>
import {
  mdbIcon, mdbPopover, mdbBtn,
} from 'mdbvue';

export default {
  name: 'MolecularSearchBox',
  components: {
    mdbIcon,
    mdbPopover,
    mdbBtn,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
      noError: false,
    };
  },
  methods: {
    emitSearchData() {
      this.validateInputFormat();
      this.$emit('onSearch', this.input);
    },
    validateInputFormat() {
      const regex = /[^?/\\><,.!@#$%^&*_+=:;'"{}|~`]+/;
      const match = this.input.match(regex);
      if (this.input !== '' && match !== null) {
        this.noError = match[0] === this.input;
      } else {
        this.noError = false;
      }
      if (this.$el.querySelector('.show') !== null) {
        this.$el.querySelector('.show').style.opacity = this.noError ? 0 : 1;
      }
      return this.noError;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

.home-search-input-group {
  margin-top: 1.5em;
}

.home-search-icon {
  height: 3em;
  width: 3em;
}

.home-search-input {
  height: 3em;
}
</style>
