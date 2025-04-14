<template>
  <mdb-tooltip trigger="hover" :options="{placement: 'top'}">
    <span slot="tip">{{ tipText }}</span>
    <mdb-btn
      id="toggle-grid-btn"
      slot="reference"
      type="button"
      class="blue lighten-1 m-0 text-white py-2 px-3"
      data-cy="gridToggle"
      size="sm"
      @click="doToggle"
    >
      <mdb-icon size="lg" :icon="getGridToggle" />
    </mdb-btn>
  </mdb-tooltip>
</template>

<script>
import {
  mapMutations, mapState, mapGetters,
} from 'vuex'
import {
  mdbIcon, mdbBtn, mdbTooltip,
} from 'mdbvue'

export default {
  name: 'ToggleGridButton',
  components: {
    mdbBtn,
    mdbIcon,
    mdbTooltip,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      btnIcon: 'th',
      tipText: 'Show Tile View',
    }
  },
  computed: {
    ...mapGetters('results', ['getModalInfo', 'getChemicals', 'getSortModelState', 'getGridToggle']),
  },
  created() {
    this.$nuxt.$on('updateTogglerBtn', (view) => {
      if (view === 'th') {
        this.btnIcon = 'table'
        this.tipText = 'Show Tile View'
      }
      if (view === 'table') {
        this.btnIcon = 'th'
        this.tipText = 'Show Grid View'
      }
    })
  },
  mounted() {
    const savedView = window.localStorage.getItem('defaultView')
    if (savedView && savedView === 'table') {
      this.tipText = 'Show Grid View'
      this.btnIcon = 'table'
      this.setGridToggle('table')
    } else if (savedView && savedView === 'th') {
      this.tipText = 'Show Tile View'
      this.btnIcon = 'th'
      this.setGridToggle('th')
    }
  },
  methods: {
    ...mapMutations({
      setGridToggle: 'results/setGridToggle',
    }),
    doToggle() {
      // console.log('this.btnIcon: ', this.btnIcon)
      this.btnIcon = (this.btnIcon === 'th') ? 'table' : 'th'
      this.tipText = (this.btnIcon === 'th') ? 'Show Tile View' : 'Show Grid View'
      this.setGridToggle(this.btnIcon)
      this.$emit('doToggle', this.btnIcon)
    },
  },
}
</script>
