<template>
  <mdb-popover trigger="hover" :options="{placement: 'bottom'}">
    <span slot="body" data-cy="warning-msg">
      <mdb-icon icon="exclamation-circle" />
      {{ inputError }}
    </span>
    <div slot="reference" class="input-group home-search-input-group">
      <input
        v-model="input"
        type="text"
        class="form-control home-search-input"
        :placeholder="placeholder"
        :aria-label="`${cname}Search`"
        :data-cy="`${cname}Input`"
        @keyup="emitUpdatedInput"
      >
      <div class="input-group-append">
        <span class="input-group-text blue home-search-icon">
          <mdbIcon
            icon="search"
            class="text-white"
            size="lg"
          />
        </span>
      </div>
    </div>
  </mdb-popover>
</template>

<script>
import {
  mdbIcon, mdbPopover, mdbAutocomplete,
} from 'mdbvue';

export default {
  name: 'HomepageSearchBox',
  components: {
    mdbIcon,
    mdbPopover,
  },
  props: {
    cname: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search for chemical by systematic name, synonym, CAS number, DTXSID or InChIKey',
    },
  },
  data() {
    return {
      input: '',
      noError: false,
      inputError: 'Please input at least 2 characters to search',
      searchResults: [],
    };
  },
  methods: {
    emitUpdatedInput() {
      this.validateInputLength();
      this.$emit('onFilter', this.input);
    },
    validateInputLength() {
      this.noError = this.input.length >= 2;
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

.text-white
{
  font-size: 19px;
  font-weight: 700;
}

</style>
