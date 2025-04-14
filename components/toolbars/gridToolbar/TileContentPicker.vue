<template>
  <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
    <span slot="tip">Select tile content</span>
    <mdb-dropdown slot="reference">
      <mdb-dropdown-toggle
        id="tile-content-picker"
        slot="toggle"
        class="blue lighten-1 text-white"
        data-cy="infoButton"
        size="sm"
      >
        <span class="hide-responsive">Tile</span> Info
      </mdb-dropdown-toggle>
      <mdb-dropdown-menu>
        <form class="px-2 py-2" style="min-width:300px;font-size:10px">
          <p class="picker-info">
            Choose information to show on tiles. Maximum pick {{ maxChecks }}
          </p>
          <div v-for="(item, index) in infoItems" :key="index" class="custom-control custom-checkbox" @click.stop>
            <input
              :id="item.id"
              v-model="infoList"
              class="custom-control-input"
              data-cy="customControlInput"
              type="checkbox"
              :value="item.id"
              :disabled="infoList.length >= maxChecks && tileInfo.indexOf(item.id) == -1"
            >
            <label class="custom-control-label" :for="item.id">{{ item.label }}</label>
          </div>
        </form>
      </mdb-dropdown-menu>
    </mdb-dropdown>
  </mdb-tooltip>
</template>
<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex';
import {
  mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbTooltip,
} from 'mdbvue';

export default {
  name: 'TileContentPicker',
  components: {
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbTooltip,
  },
  data() {
    return {
      maxChecks: 4,
      infoItems: ['dtxsid', 'casrn', 'toxcast'],
    };
  },
  computed: {
    ...mapGetters('results', ['getTileInfo', 'getTileInfoOptions']),
    ...mapState('results', ['tileInfo']),
    infoList: {
      set(val) {
        this.setTileInfo(val);
      },
      get() {
        const currentAvailableOptionsIds = this.infoItems.map(({id}) => id);
        return this.getTileInfo().filter(tileInfo => currentAvailableOptionsIds.includes(tileInfo));
      },
    },
  },
  mounted() {
    this.infoItems = this.getTileInfoOptions();
  },
  methods: {
    ...mapMutations({setTileInfo: 'results/setTileInfo'}),
  },
};
</script>
