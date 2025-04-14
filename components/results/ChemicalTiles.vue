<template>
  <div>
    <slot name="chemicalTile">
      <div class="chemicalTiles">
        <ChemicalTile
          v-for="chemical in pagedChemicals"
          :key="randKey(chemical.genericSubstanceId)"
          :chemical="chemical"
          :class="chemical.selected"
          @selectTile="onSelectTile"
        />
      </div>
    </slot>
  </div>
</template>

<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex'

import ChemicalTile from '~/components/results/ChemicalTile.vue'


export default {
  name: 'ChemicalTiles',
  components: {
    ChemicalTile,
  },

  data() {
    return {

      ImageUrl: '',
      modalTitle: 'Chemical Name',
      cname: {
        camelName: 'chemicalLists',
        hyphenName: 'chemical-lists',
        baseName: 'Chemical Lists',
      },
      page: 0,
      pageSize: 30,
      pagedChemicals: [],

    }
  },
  computed: {
    ...mapState('results', ['chemicals', 'selectedChemicals', 'filteredChemicals', 'sortModel']),
    ...mapGetters('results', ['getChemicals']),

  },

  watch: {
    chemicals(n, o) {
      this.page = 0
      this.pagedChemicals.splice(0, this.pagedChemicals.length)
      const newSlice = this.getChemicals().slice(this.page, this.pageSize)
      for (let k = 0; k < newSlice.length; k++) {
        this.pagedChemicals.splice(k, 1, newSlice[k])
      }
    },
  },
  created() {

  },
  mounted() {
    this.pagedChemicals = this.getChemicals().slice(0, this.pageSize)
    this.initObserver()
  },

  methods: {
    randKey(gsid) {
      return gsid + Math.random().toString(36).substring(7)
    },

    onSelectTile(pObj) {
      this.$emit('selectTile', pObj)
    },

    initObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }

      const observer = new IntersectionObserver((entries) => {
        this.page = this.page + this.pageSize
        const np = this.getChemicals().slice(this.page, this.pageSize + this.page)

        this.pagedChemicals = this.pagedChemicals.concat(np)
      }, options)


      const footer = document.getElementsByClassName('main-footer')[0]
      observer.observe(footer)
    },

  },
}
</script>

<style  lang="scss">
.chemicalTiles {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  margin: auto;
  margin-top:30px;
  max-width: calc(6 * 275px);
}

 .chemicalTile {
  width: 235px;
  height: 275px;
  margin: 8px;
  box-sizing: border-box;
  position: relative;
}

  .badge{
    font-size:11px;
    margin-right:4px;
    font-weight: 500;
    background-color:white!important;
    color:black;

    &.pink{
      border-left: 8px solid #ea5e7e;
    }
    &.indigo{
      border-left: 8px solid #6670ad!important;
    }
    &.orange{
      border-left: 8px solid #f7ac3f!important;
    }
    &.green{

      border-left: 8px solid #60cc77!important;
    }
  }

.results {
  margin: 1em auto;
}

.hiddenTile{
  display: none
}
.noResults {
  margin: 10px;
  display: block;
  font-size: 20px;
  width: 100%;
  text-align: center;
}

#imageModalTitle a.close{
  color:red!important;
}
</style>
