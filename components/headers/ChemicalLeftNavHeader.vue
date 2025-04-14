<template>
  <div class="navbar-head">
    <div class="list-info pl-3" v-if="chemListComputed">
      <a :href="listUrl(chemListComputed.name)" class="list-abbreviation has-text-weight-bold">{{ chemListComputed.name }}</a>
      <div class="list-label" v-html="chemListComputed.label" />
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations, mapState,
} from 'vuex'

export default {
  name: 'ChemicalNavbarHeader',
  data() {
    return {
      listId: null,
    }
  },
  computed: {
    ...mapGetters({
      getChemicalLists: 'chemicalLists/getChemicalLists',
      getFiltered: 'chemicalLists/getFiltered',
    }),
    chemListComputed() {
      if (this.listId) {
        const chem = this.getFiltered(this.listId)
        return chem[0]
      }
      return null
    },
  },
  created() {
    if (this.$route.query.list) {
      this.listId = this.$route.query.list
    }
  },
  methods: {
    listUrl(listName) {
      return `${process.env.APPLICATION_ROUTER_BASE}chemical-lists/${listName}`
    },
  },
}
</script>

<style lang="scss" scoped>
$header-height: 100px;
.navbar-head {
  height: $header-height;
  overflow-y: visible;
}
.list-abbreviation {
  font-size: 1em;
  font-weight: bold;
}
.list-label {
  font-size: .7rem;
}
</style>
