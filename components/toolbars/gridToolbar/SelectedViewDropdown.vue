<template>
  <div>
    <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
      <div slot="tip">
        Select and save your preferred chemical list view.
      </div>
      <mdb-dropdown id="export-detail-btn" slot="reference">
        <mdb-dropdown-toggle slot="toggle" class="blue lighten-1 text-white" size="sm">
          <span class="hide-responsive">Preferred</span> View
        </mdb-dropdown-toggle>
        <mdb-dropdown-menu>
          <mdb-dropdown-item
            @click="emitDefaultView('th')"
          >
            Grid View
          </mdb-dropdown-item>
          <mdb-dropdown-item
            @click="emitDefaultView('table')"
          >
            Tile View
          </mdb-dropdown-item>
        </mdb-dropdown-menu>
      </mdb-dropdown>
    </mdb-tooltip>
  </div>
</template>

<script>
import {
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbTooltip,
} from 'mdbvue'

export default {
  name: 'SelectedViewDropdown',
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbTooltip,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    sdf: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitDefaultView(type) {
      this.$emit('emitViewPref', type)
      this.$nuxt.$emit('updateTogglerBtn', type)
    },
  },
}
</script>
