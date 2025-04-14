<template>
  <div>
    <mdb-dropdown>
      <mdb-dropdown-toggle
        slot="toggle"
        data-cy="filter-dropdown"
        class="blue lighten-1 text-white"
        size="sm"
      >
        <mdb-icon icon="filter" />  <span class="hide-responsive">Filter</span>
        <span v-if="filterCount > 0" style="margin-left:3px;font-size:10px" class="badge badge-pill badge-dark">
          {{ filterCount }}
        </span>
      </mdb-dropdown-toggle>
      <mdb-dropdown-menu>
        <form class="px-2 py-2" style="min-width:300px">
          <p class="picker-info">
            Filter by vendor:
          </p>
          <div v-for="(item, index) in selectOpts" :key="index" class="custom-control custom-checkbox" @click.stop>
            <input
              :id="item.value"
              class="custom-control-input"
              type="checkbox"
              :value="item.value"
              :checked="item.selected"
              @change="onChange"
            >
            <label class="custom-control-label" :for="item.value">{{ item.text }}</label>
          </div>
        </form>
      </mdb-dropdown-menu>
    </mdb-dropdown>
  </div>
</template>

<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex';
import {
  mdbDropdown, mdbIcon, mdbDropdownMenu, mdbDropdownToggle,
} from 'mdbvue';

export default {
  name: 'GridMultiselect',
  components: {
    mdbDropdown,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbIcon,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
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
      msName: `${this.cname.camelName}msInput`,
    };
  },
  computed: {
    ...mapGetters('assayEndpointResults', ['getFilterOptions', 'getFilterModel']),
    ...mapState('assayEndpointResults', ['filterModel', 'filterOptions']),
    filterCount() {
      return this.filterModel?.length;
    },

  },
  created() {
    this.opts = this.selectOpts.filter(o => o.selected).map(o => o.value);
  },
  methods: {
    ...mapMutations({setFilterModel: 'assayEndpointResults/setFilterModel'}),
    onChange(e) {
      if (e.target.checked) {
        this.opts.push(e.target.value);
      }
      if (!e.target.checked) {
        this.opts = this.opts.filter(item => item !== e.target.value);
      }
      this.setFilterModel(this.opts);
      this.$emit('onSelected', {
        filterColumn: this.filterColumn,
        filterValue: this.opts,
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
