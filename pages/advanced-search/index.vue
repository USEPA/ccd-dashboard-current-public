<template>
  <client-only>
    <div class="d-flex flex-column align-items-center container-fluid pt-4">
      <ccte-help-text
        data-cy="AdvancedSearchHeader"
        label-type="h1"
        heading-text="Advanced Search"
        help-key="AS Advanced Search Title"
      />
      <mdb-container fluid class="tab-details" style="overflow:visible">
        <mdb-tabs
          id="adv-tabs"
          :active="activeTab"
          :links="[
            { text: 'Mass Search', slot: 'mass-slot' },
            { text: 'Molecular Formula Search', slot: 'moecular-slot' },
            { text: 'Generate Molecular Formula(e)', slot: 'generate-slot' },
          ]"
          :transition-duration="0.1"
          default
          transition-style="linear"
        >
          <template :slot="'mass-slot'">
            <mass-search
              :cname="'MassSearch'"
              data-cy="mass-search"
              class="mt-4"
            />
          </template>
          <template :slot="'moecular-slot'">
            <molecular-formula-search
              :cname="'MolecularFormulaSearch'"
              data-cy="molecular-formula-search"
              class="mt-4"
            />
          </template>
          <template :slot="'generate-slot'">
            <generate-molecular-formula
              :cname="'GenerateMolecularFormula'"
              data-cy="generate-molecular-formula"
              class="mt-4"
            />
          </template>
        </mdb-tabs>
      </mdb-container>
    </div>
  </client-only>
</template>

<script>
import {mdbContainer, mdbTabs} from 'mdbvue';
import MassSearch from '~/components/advancedSearch/MassSearch.vue';
import MolecularFormulaSearch from '~/components/advancedSearch/MolecularFormulaSearch.vue';
import GenerateMolecularFormula from '~/components/advancedSearch/GenerateMolecularFormula.vue';

export default {
  name: 'AdvancedSearch',
  components: {
    mdbContainer,
    mdbTabs,
    MassSearch,
    MolecularFormulaSearch,
    GenerateMolecularFormula,
  },
  computed: {
    activeTab() {
      const deepLinkValue = this.$route.hash;
      let returnValue = 0;
      // eslint-disable-next-line default-case
      switch (deepLinkValue) {
      case '#MassSearch':
        returnValue = 0;
        break;
      case '#MolecularFormulaSearch':
        returnValue = 1;
        break;
      case '#GenerateMF':
        returnValue = 2;
        break;
      case '#':
        returnValue = 0;
        break;
      }
      return returnValue;
    },
  },
};
</script>

<style lang="scss">

.tab-details {
   color: black;
   margin-top: 2em;
   width: 80%;
   .nav-link {
     color: black !important;
   }
  .nav-link.active {
    background-color: #3280a3!important;
    border-bottom-color: rgb(222, 226, 230) !important;
    color: white !important;
  }
  .tab-content {
    padding-top: 1em !important;
  }
 }

.tab-pane {
  height: 40rem;
  width: 100%;
}

.popover {
  width: 400px !important;
}
</style>
