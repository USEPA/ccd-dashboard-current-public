<template>
  <select
    id="m1"
    v-model="s1"
    class="form-control mr-3"
    aria-label="Select Option Input"
    style="max-width: 275px !important;"
  >
    <option
      v-for="item in selectOptions"
      :key="item.value"
      :value="item.value"
    >
      {{ item.text }}
    </option>
  </select>
</template>

<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex';

export default {
  name: 'GridSelectBasic',
  props: {
    cname: {
      type: Object,
      default: null,
    },

    selectOptions: {
      type: Array,
      default: () => [],
    },
    // eslint-disable-next-line vue/require-prop-types
    selectDefault: {
      default: null,
    },
  },
  data() {
    return {
      whichStore: 'chemicalProperties',
    };
  },
  computed: {
    ...mapGetters('chemicalProperties', ['getPropertySelection']),
    ...mapState('chemicalProperties', ['propertySelection']),
    s1: {
      set(val) {
        this.setPropertySelection(val);
      },
      get() {
        return this.getPropertySelection();
      },
    },
  },
  beforeMount() {

  },
  mounted() {
    this.setPropertySelection(this.selectDefault);
  },
  methods: {


    ...mapMutations({
      setPropertySelection: 'chemicalProperties/setPropertySelection',

    }),
  },
};
</script>

<style lang="scss" scoped>
  a:hover, a:active, a:focus, input {
    outline:0
  }
  #m1 {
    font-size:14px;
    background-color:#3280a3;
    color:white;
    font-family: "Roboto", sans-serif;
    outline:none;
    }
  basic {
    max-width: 200px !important;
  }
</style>
