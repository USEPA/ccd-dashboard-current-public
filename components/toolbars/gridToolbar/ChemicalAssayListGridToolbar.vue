<template>
  <div class="toolbar">
    <mdb-row>
      <mdb-col col="12">
        <mdb-row class="d-flex align-items-center">
          <mdb-col col="12" lg="4" xl="3" class="d-flex justify-content-end my-1">
            <grid-search-box
              v-if="toolbarConfig.search"
              :cname="cname"
              :qsearch="qsearch"
              @onFilter="emitInput"
            />
          </mdb-col>
          <mdb-col col="12" lg="8" xl="9" class="d-flex justify-content-end my-1">
            <grid-multiselect
              v-if="toolbarConfig.filter"
              class="pr-2"
              :cname="cname"
              :select-opts="vendorsArr"
              :filter-column="assayVendorCol"
              @onSelected="multiSelectFilter"
            />
            <grid-export-dropdown
              v-if="toolbarConfig.export"
              class="pr-2"
              :cname="cname"
              @onExport="emitExport"
            />
            <grid-copy-url-button
              v-if="toolbarConfig.copy"
              :cname="cname"
              :tip-text="tipText"
              :copy-text="textOutput"
              class="export-dropdown"
            />
          </mdb-col>
        </mdb-row>
      </mdb-col>
    </mdb-row>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
import {mdbRow, mdbCol} from 'mdbvue';
import GridSearchBox from '~/components/toolbars/gridToolbar/GridSearchBox.vue';
import GridMultiselect from '~/components/toolbars/gridToolbar/GridMultiselect.vue';
import GridExportDropdown from '~/components/toolbars/gridToolbar/GridExportDropdown.vue';
import GridCopyUrlButton from '~/components/toolbars/gridToolbar/GridCopyUrlButton.vue';

const {mapGetters} = createNamespacedHelpers('assayEndpoints');
export default {
  name: 'ChemicalAssayListGridToolbar',
  components: {
    mdbRow,
    mdbCol,
    GridSearchBox,
    GridMultiselect,
    GridExportDropdown,
    GridCopyUrlButton,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    toolbarConfig: {
      type: Object,
      default: () => {},
    },
    qsearch: {
      type: String,
      default: '',
    },
    vfilter: {
      type: Array,
      default() {
        return {
          vendors: [],
        };
      },
    },
  },
  data() {
    return {
      searchTerm: null,
      vendorFilterString: null,
      copying: false,
      copied: false,
      assayVendorCol: 'vendorKey',
      linkTip: 'Copy page URL',
      linkText: `${process.env.APPLICATION_EXTERNAL_LINK_URL}${process.env.APPLICATION_ROUTER_BASE}${this.$route.name}`,
      filteredLink: `${process.env.APPLICATION_EXTERNAL_LINK_URL}${process.env.APPLICATION_ROUTER_BASE}${this.$route.name}?filtered=`,
    };
  },
  computed: {
    ...mapGetters(['getAssayVenders']),
    vendorsArr() {
      const vFiltered = this.vfilter;
      const vendors = this.getAssayVenders.map((item) => {
        if (vFiltered.includes(item.vendorShort)) {
          const newItem = {
            text: item.vendorFull,
            value: item.vendorShort,
            selected: true,
          };
          return newItem;
        }
        const newItem = {
          text: item.vendorFull,
          value: item.vendorShort,
        };
        return newItem;
      });
      return [...vendors];
    },
    textOutput() {
      if (this.vendorFilterString && !this.searchTerm) {
        return `${this.filteredLink}&vendorFilter=${this.vendorFilterString}`;
      }
      if (this.searchTerm && this.vendorFilterString) {
        return `${this.filteredLink}&vendorFilter=${this.vendorFilterString}&search=${this.searchTerm}`;
      }

      if (this.searchTerm && !this.vendorFilterString) {
        return `${this.filteredLink}&search=${this.searchTerm}`;
      }
      return `${this.filteredLink}`;
    },
    tipText() {
      if (
        this.vendorFilterString ||
        this.searchTerm ||
        this.vfilter.length > 0 ||
        this.qsearch.length > 0
      ) {
        return 'Copy filtered page URL';
      }
      return 'Copy page URL';
    },
  },
  methods: {
    emitExport(params) {
      this.$emit('onExport', params);
    },
    emitInput(input) {
      if (input.length > 0) {
        this.searchTerm = input;
      } else {
        this.searchTerm = null;
      }
      this.$emit('onFilter', input);
    },
    multiSelectFilter(params) {
      const vendorString = this.vendorFilterStr(params.filterValue);
      if (params.filterValue.length >= 1 && params.filterValue[0] != null) {
        this.vendorFilterString = vendorString;
      } else {
        this.vendorFilterString = null;
      }
      this.$emit('onFilterSelected', params);
    },
    arrayToDelimitedStr(arr) {
      const selectedVendorString = arr.join('-');
      return selectedVendorString;
    },
    vendorFilterStr(arr) {
      const arrString = this.arrayToDelimitedStr(arr);
      return `${arrString}`;
    },
  },
};
</script>

<style lang="scss">
ul.dropdown-content {
  max-height: 11 em !important;
}
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
ul.collapse-item .dropdown-content.select-dropdown {
  max-height: 11 em !important;
}
</style>
