<template>
  <div data-cy="propertiesMenu" >
    <p>Select properties to predict</p>
    <Properties
      v-for="cat in cats"
      :key="cat"
      :name="cat"
      :family="provider.categories[cat]"
    />
  </div>
</template>

<script>
import {
  mapMutations, mapState, mapGetters,
} from 'vuex'
import Properties from './Properties.vue'

const {log} = console
export default {
  name: 'Provider',
  components: {Properties},
  props: {
    provider: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    cats() { return Object.keys(this.provider.categories) },
    ...mapState({
      properties: state => state.properties,
      providersState: state => state.provider,
    }),
  },
  mounted() {
    this.setProviders(this.provider)
  },
  methods: {
    ...mapMutations({
      setProviders: 'predictions/setProviders',
      setProperties: 'predictions/setProperties',
    }),
  },
}
</script>
