<template>
  <div>
    <mdb-dropdown>
      <mdb-dropdown-toggle
        slot="toggle"
        data-cy="assay-filter-dropdown"
        class="blue lighten-1 text-white"
        size="sm"
      >
        Filter by assay list
      </mdb-dropdown-toggle>
      <mdb-dropdown-menu>
        <form class="px-2 py-2" style="min-width:300px">
          <p class="picker-info">
            Deselecting an option will also filter all blank values:
          </p>
          <div v-for="(item, index) in selectOpts" :key="index" class="custom-control custom-checkbox" @click.stop>
            <input
              :id="item.assay_list_id"
              class="custom-control-input"
              type="checkbox"
              :value="item.assay_list_nm"
              :checked="item.selected"
              @change="onChange"
            >
            <label class="custom-control-label" :for="item.assay_list_id">{{ item.assay_list_nm }}</label>
          </div>
        </form>
      </mdb-dropdown-menu>
    </mdb-dropdown>
  </div>
</template>

<script>
import {
  mdbDropdown, mdbDropdownMenu, mdbDropdownToggle,
} from 'mdbvue';

export default {
  name: 'AssayListsSelect',
  components: {
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
  },
  props: {
    filterColumn: {
      type: String,
      default: '',
    },
    selectOpts: {
      type: Array,
      default() {
        return {
          opts: [],
        };
      },
    },
  },
  data() {
    return {
      opts: [],
      allOpts: [],
    };
  },
  created() {
    this.allOpts = this.selectOpts.map((option) => {
      if (option.assay_list_nm !== '(Blanks)') {
        option.selected = true;
      }
      return option;
    });
    this.opts = this.allOpts.map(option => option);
  },
  methods: {
    onChange(e) {
      if (e.target.checked) {
        this.opts = this.opts.map((item) => {
          if (item.assay_list_nm === e.target.value) {
            item.selected = true;
          }
          return item;
        });
      }
      if (!e.target.checked) {
        this.opts = this.opts.map((item) => {
          if (item.assay_list_nm === e.target.value) {
            item.selected = false;
          }
          return item;
        });
      }
      const optVals = [];
      this.opts.forEach((item) => {
        if (item.selected === true) {
          const rv = item.assay_list_nm;
          optVals.push(rv);
        }
      });
      this.$emit('onSelected', {
        filterColumn: this.filterColumn,
        filterValue: optVals,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.select-dropdown {
  margin: 0 !important;
  max-height: 400px;
}

.dropdown-content {
  max-height: 10.7rem;
}

.grid-toolbar-multiselect .md-form.md-outline input[type="text"] {
  height: 2rem;
  font-size: 0.8rem;
}

.grid-toolbar-multiselect .select-wrapper span.caret {
  top: 0.6rem !important;
}

.picker-info{
  font-size:11px
}
</style>
