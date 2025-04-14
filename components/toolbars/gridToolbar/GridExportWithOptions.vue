<template>
  <div>
    <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
      <span slot="tip">Export Data</span>
      <mdb-dropdown id="export-detail-btn" slot="reference" data-cy="exportButton">
        <mdb-dropdown-toggle slot="toggle" class="blue lighten-1 text-white" size="sm">
          <mdb-icon icon="download" />  <span class="hide-responsive">Export</span>
        </mdb-dropdown-toggle>
        <mdb-dropdown-menu>
          <mdb-dropdown-item v-for="item in exportOptions" :key="item.key" @click="emitExport(item.key)">
            {{ item.label }}
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
  mdbIcon,
  mdbTooltip,
} from 'mdbvue';

export default {
  name: 'GridExportWithOptions',
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbIcon,
    mdbTooltip,
  },
  props: {
    exportOptions: {
      type: Array,
      default: null,
    },
  },
  methods: {
    emitExport(format) {
      this.$emit('concExport', format);
    },
  },
};
</script>
