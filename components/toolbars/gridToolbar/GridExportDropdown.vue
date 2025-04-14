<template>
  <div>
    <mdb-tooltip trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
      <span slot="tip">Export Data</span>
      <mdb-dropdown id="export-detail-btn" slot="reference" data-cy="export-menu">
        <mdb-dropdown-toggle
          slot="toggle"
          class="blue lighten-1 text-white"
          size="sm"
          aria-label="Export data select button"
        >
          <mdb-icon
            icon="download"
            alt="Export Data"
          />  <span class="hide-responsive">Export</span>
        </mdb-dropdown-toggle>
        <mdb-dropdown-menu>
          <mdb-dropdown-item
            @click="emitExport('csv')"
          >
            CSV (.csv)
          </mdb-dropdown-item>
          <mdb-dropdown-item
            @click="emitExport('xlsx')"
          >
            Excel (.xlsx)
          </mdb-dropdown-item>
          <mdb-dropdown-item
            v-if="sdf"
            @click="emitExport('sdf2')"
          >
            SDF v2000 MOL Format (.sdf)
          </mdb-dropdown-item>
          <mdb-dropdown-item
            v-if="sdf"
            @click="emitExport('sdf3')"
          >
            SDF v3000 MOL Format (.sdf)
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
  mdbIcon,
} from 'mdbvue';

export default {
  name: 'GridExportDropdown',
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbTooltip,
    mdbIcon,
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
    emitExport(format) {
      const timeStamp = this.dateFormat();
      const fileName = `${this.cname.hyphenName}-${timeStamp}`;
      const params = {
        fileType: format,
        fileName: fileName,
      };
      this.$emit('onExport', params);
    },
  },
};
</script>
