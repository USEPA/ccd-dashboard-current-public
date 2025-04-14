<template>
  <mdb-container fluid class="home-search-tabs">
    <mdb-tabs
      :active="0"
      default
      :links="[
        { text: 'Chemicals', slot: 'chemical-slot' },
        { text: 'Products/Use Categories', slot: 'product-slot' },
        { text: 'Assay/Gene', slot: 'assay-slot' },
      ]"
      :transition-duration="0.1"
      transition-style="linear"
    >
      <template :slot="'chemical-slot'">
        <chemical-search
          id="chemical-search-tab"
          data-cy="chemical-search"
          :cname="'ChemicalSearch'"
          :placeholder="'Search for chemical by systematic name, synonym, CAS number, DTXSID or InChIKey'"
        />
      </template>
      <template :slot="'product-slot'">
        <product-search
          data-cy="product-search"
          :cname="'ProductSearch'"
          :placeholder="'Search for chemicals based on product or use categories'"
        />
      </template>
      <template :slot="'assay-slot'">
        <assay-search
          data-cy="assay-search"
          :cname="'AssaySearch'"
          :placeholder="'Search for assays based on endpoint name or gene symbol'"
        />
      </template>
    </mdb-tabs>
  </mdb-container>
</template>

<script>
import {mdbContainer, mdbTabs} from 'mdbvue';
import ChemicalSearch from '~/components/homepageSearch/ChemicalSearch.vue';
import ProductSearch from '~/components/homepageSearch/ProductSearch.vue';
import AssaySearch from '~/components/homepageSearch/AssaySearch.vue';

export default {
  name: 'SearchTabs',
  components: {
    mdbContainer,
    mdbTabs,
    ChemicalSearch,
    ProductSearch,
    AssaySearch,
  },
};
</script>

<style lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

.home-search-tabs {
  width: 85%;
  min-height: 16em;
  border-radius: 25px;
  padding-top: 2.5em;
  background-color: rgba(50, 128, 163, 0.4);
  .nav-link, .nav-tabs .nav-link.active {
    background-color: transparent !important;
  }
}
.tab-content {
  padding-top: 1rem !important;
  padding-bottom: 2.75rem !important;
}
.tab-pane {
  width: 100%;
}
</style>
