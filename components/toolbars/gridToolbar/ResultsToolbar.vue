<template>
  <div class="container-fluid toolbar">
    <div class="d-flex flex-row">
      <div class="col-xl-4 col-lg-5 col-md-6 no-gutters pl-0 pr-0">
        <div v-show="getGridToggle === 'table'" class="float-left pl-1 pr-1">
          <select-all-button
            @selectAll="selectAll"
          />
        </div>
        <div class="pl-1 pr-1">
          <div class="float-left">
            <grid-search-box
              id="results-search-box"
              :cname="cname"
              :qsearch="qsearch"
              @onFilter="emitUpdatedInput"
            />
          </div>
        </div>
        <div class="pl-1 pr-1">
          <results-sort
            :cname="cname"
            :custom-sort="customSort"
          />
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-3 no-gutters pl-1 pr-1">
        <div class="row no-gutters d-flex justify-content-end pr-0">
          <span v-show="isChemlistDetails">
            <clear-filter-btn />
          </span>
          <batch-search-button
            :chemical-count="chemicalCount"
            :loading="loading"
            @onSendtoBatch="sendtoBatch"
          />
          <span v-show="getGridToggle === 'table'" class="pl-1 pr-1">
            <tile-content-picker />
          </span>
          <span class="pl-1 pr-1">
            <results-filter-picker
              :cname="cname"
            />
          </span>
        </div>
      </div>
      <div class="col-xl-4 col-lg-3 no-gutters pl-0 pr-1">
        <div class="row no-gutters justify-content-end pr-3">
          <div
            v-if="copyUrlConfig.copy && getGridToggle === 'th'"
            class="pl-1 pr-1"
          >
            <grid-copy-url-button
              v-if="copyUrlConfig.copy"
              :cname="cname"
              :tip-text="tipText"
              :copy-text="textOutput"
              class="export-dropdown"
            />
          </div>
          <span class="pl-1 pr-1">
            <grid-export-dropdown
              :cname="cname"
              sdf="sdf"
              @onExport="onExport"
            />
          </span>
          <span class="pl-1 pr-1">
            <selected-view-dropdown
              :cname="cname"
              sdf="sdf"
              @emitViewPref="emitViewPref"
            />
          </span>
          <span class="pl-1 pr-1">
            <toggle-grid-button
              :cname="cname"
              @doToggle="doToggle"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mdbIcon,
  mdbBtn,
} from 'mdbvue';
import {
  mapMutations, mapState, mapGetters,
} from 'vuex';

import ToggleGridButton from '~/components/toolbars/gridToolbar/ToggleGridButton.vue';
import ClearFilterBtn from '~/components/toolbars/gridToolbar/ClearFilterBtn.vue';
import GridExportDropdown from '~/components/toolbars/gridToolbar/GridExportDropdown.vue';
import SelectedViewDropdown from '~/components/toolbars/gridToolbar/SelectedViewDropdown.vue';
import BatchSearchButton from '~/components/toolbars/gridToolbar/BatchSearchButton.vue';
import ResultsFilterPicker from '~/components/toolbars/gridToolbar/ResultsFilterPicker.vue';
import ResultsSort from '~/components/toolbars/gridToolbar/ResultsSort.vue';
import GridSearchBox from '~/components/toolbars/gridToolbar/GridSearchBox.vue';
import SelectAllButton from '~/components/toolbars/gridToolbar/SelectAllButton.vue';
import TileContentPicker from '~/components/toolbars/gridToolbar/TileContentPicker.vue';
import GridCopyUrlButton from '~/components/toolbars/gridToolbar/GridCopyUrlButton.vue';

export default {
  name: 'ResultsToolbar',
  components: {
    GridExportDropdown,
    BatchSearchButton,
    SelectedViewDropdown,
    ToggleGridButton,
    ResultsFilterPicker,
    ResultsSort,
    GridSearchBox,
    SelectAllButton,
    TileContentPicker,
    GridCopyUrlButton,
    ClearFilterBtn,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    loading: {type: Boolean, default: false},
    copyUrlConfig: {
      type: Object,
      default() {
        return {
          copy: false,
          copyButtonTipText: 'Copy Url',
        };
      },
    },
    filter: {
      type: Object,
      default: null,
    },
    customSort: {
      type: Object,
      default() {
        return {
          colId: 'default',
          sort: 'asc',
        };
      },
    },
    qsearch: {
      type: String,
      default: '',
    },
    chemicalCount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      searchTerm: '',
      isChemlistDetails: false,
      filteredLink: `${process.env.APPLICATION_EXTERNAL_LINK_URL}/dashboard${this.$route.path}`,
      placeholder: 'Hide chemicals that are:',
      sdf: true,
    };
  },
  computed: {
    ...mapState('results', ['gridToggle']),
    ...mapGetters('results', ['getGridToggle']),
    textOutput() {
      let filteredLinkText = this.filteredLink;
      if (this.qsearch && this.qsearch.length > 0) {
        if (this.filteredLink.includes('?')) {
          filteredLinkText = `${this.filteredLink}&search=${this.qsearch}`;
        } else {
          filteredLinkText = `${this.filteredLink}?search=${this.qsearch}`;
        }
      }
      if (this.searchTerm && this.searchTerm.length > 0) {
        if (this.filteredLink.includes('?')) {
          filteredLinkText = `${this.filteredLink}&search=${this.searchTerm}`;
        } else {
          filteredLinkText = `${this.filteredLink}?search=${this.searchTerm}`;
        }
      }
      return filteredLinkText;
    },
    tipText() {
      if (
        this.searchTerm.length > 0 ||
        this.qsearch.length > 0
      ) {
        return 'Copy filtered page URL';
      }
      return 'Copy page URL';
    },
  },
  created() {
    if (this.$route.path.includes('/chemical-lists/')) {
      this.isChemlistDetails = true;
    }
    if (this.$route.path === '/search-results') {
      this.filteredLink = `${process.env.APPLICATION_EXTERNAL_LINK_URL}/dashboard${this.$route.fullPath}`;
    }
  },
  methods: {
    doToggle(params) {
      this.$emit('doToggle', params);
    },
    SendtoBatchSearchButton(params) {
      this.$emit('test', params);
    },
    emitUpdatedInput(params) {
      this.searchTerm = params;
      this.$emit('onFilter', params);
    },
    emitViewPref(params) {
      this.$emit('emitViewPref', params);
    },
    selectAll(params) {
      this.$emit('selectAll', params);
    },
    onExport(params) {
      this.$emit('onExport', params);
    },
    sendtoBatch(params) {
      this.$emit('sendtoBatch', params);
    },
  },
};
</script>
<style lang="scss">
.toolbar{
  .btn.btn-sm {
    padding: 0.4rem !important;
    font-size: 0.64rem;
  }
  div.col{
    padding: 0.4rem .5rem !important;
  }
}
span.hide-responsiv {
  padding: .2px;
}
@media (max-width: 1200px) {
      span.hide-responsive {
        display: none;
      }
    }
</style>

