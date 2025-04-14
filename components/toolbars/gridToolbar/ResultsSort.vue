<template>
  <div style="white-space:nowrap;overflow-x:visible">
    <select id="m1" v-model="sortObj.colId" class="form-control form-control-sm" @change="getSelectValue">
      <option
        v-for="option in sortOpts"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <mdb-btn
      id="sortDir"
      size="md"
      class=" "
      :icon="sortDirection"
      @click="changeSortDirection"
    />
  </div>
</template>

<script>
import {
  mapMutations, mapState, mapGetters,
} from 'vuex'
import {mdbBtn} from 'mdbvue'


export default {
  name: 'ResultsSort',
  components: {
    mdbBtn,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    customSort: {
      type: Object,
      default() {
        return {
          colId: 'preferredName',
          sort: 'asc',
        }
      },
    },
  },

  data() {
    return {
      sortOpts: [],
      sortDirection: 'angle-up',
      sortObj: {
        colId: 'name',
        sort: 'asc',
      },

    }
  },
  computed: {
    ...mapState('results', ['sortModel']),
    ...mapGetters('results', ['getSortOptions', 'getSortModelState']),
  },
  created() {
    this.sortOpts = [...this.getSortOptions()]
  },
  methods: {
    // ...mapMutations({setSort: 'results/setSort'}),

    getSelectValue(value, text) {
      this.sortObj.sort = 'asc'
      // console.log('in getSelctValue', this.sortObj)
      this.$nuxt.$emit('updateSort', this.sortObj)
    },
    changeSortDirection() {
      switch (this.sortObj.sort) {
      case 'asc':
        this.sortObj.sort = 'desc'
        this.sortDirection = 'angle-down'
        // this.setSort(this.sortObj)
        this.$nuxt.$emit('updateSort', this.sortObj)
        break
      case 'desc':
        this.sortObj.sort = 'asc'
        this.sortDirection = 'angle-up'
        // this.setSort(this.sortObj)
        this.$nuxt.$emit('updateSort', this.sortObj)
        break

      default:
        break
      }
    },
  },
}
</script>

<style lang="scss" scoped>

#m1{
  display:inline-block;
  max-width:110px
}

#sortDir{
  display:inline-block;
    font-size:16px;
    margin:0;
    padding:2px 0 3px 0;
margin-top:1px;
margin-left:-4px;
}

</style>
