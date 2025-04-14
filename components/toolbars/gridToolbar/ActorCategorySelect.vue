<template>
  <select id="m1" v-model="s1" class="form-control mr-3 ">
    <option
      v-for="(item, idx) in selectOptions"
      :key="idx"
      :value="item.value"
      selected="item.value === selectDefault"
    >
      {{ item.categoryName }}
    </option>
  </select>
</template>

<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex'

export default {
  name: 'ActorCategorySelect',
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
      whichStore: 'actor',
    }
  },
  computed: {
    ...mapGetters('actor', ['getCategorySelection']),
    ...mapState('actor', ['categorySelection']),
    s1: {
      set(val) {
        this.setCategorySelection(val)
        this.$nuxt.$emit('updateActorCategory')
        // console.log('changed:', val)
      },
      get() {
        return this.getCategorySelection
      },
    },
  },
  beforeMount() {

  },
  mounted() {
    // console.log(this.selectOptions)
    this.setCategorySelection(this.selectDefault)
  },
  methods: {
    ...mapMutations({
      setCategorySelection: 'actor/setCategorySelection',

    }),
  },
}
</script>

<style lang="scss" scoped>
a:hover, a:active, a:focus, input {
    outline:0
}
    #m1 {
     font-size:14px;
    // padding:2px;
    background-color:#3280a3;
    color:white;
    font-family: "Roboto", sans-serif;
    outline:none;
    }
</style>


