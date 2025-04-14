<template>
  <mdb-dropdown dropright class="mr-2 grid-toolbar-dropdown">
    <mdb-dropdown-toggle slot="toggle" class="blue lighten-1 text-white" size="sm">
      Data Type
    </mdb-dropdown-toggle>
    <mdb-dropdown-menu>
      <mdb-dropdown-item v-for="item in selectOptions" :key="item.value" @click="emitSelect(item.value,item.text)">
        {{ item.text }}
      </mdb-dropdown-item>
    </mdb-dropdown-menu>
  </mdb-dropdown>
</template>

<script>
import {
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
} from 'mdbvue';

export default {
  name: 'GridSelectDropdown',
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    emitSelect(selectedCode, selectedText) {
      this.$emit('onSelect', selectedCode, selectedText);
    },
  },
};
</script>
