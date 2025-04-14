<template>
  <div class="container">
    <div v-if="acdIupacName" class="row sid">
      <div class="col-1 pl-0">
        <copy-text :tip-text="'Copy IUPAC Name'" :to-copy="acdIupacName" :copy-type="'icon'" />
      </div>
      <div class="col-11 pt-2 breakWord">
        <strong><a href="https://en.wikipedia.org/wiki/IUPAC_nomenclature_of_organic_chemistry" target="_blank">
          IUPAC Name:
        </a></strong>
        {{ acdIupacName }}
      </div>
    </div>
    <div class="row">
      <div class="col-1 pl-0">
        <copy-text :tip-text="'Copy SMILES'" :to-copy="smiles" :copy-type="'icon'" />
      </div>
      <div class="col-11 pt-2 breakWord">
        <strong><a href="https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system" target="_blank">
          SMILES:
        </a></strong>
        {{ smiles }}
      </div>
    </div>
    <div v-if="inchi" class="row">
      <div class="col-1 pl-0">
        <copy-text :tip-text="'Copy InChI String'" :to-copy="inchi" :copy-type="'icon'" />
      </div>
      <div class="col-11 pt-2 breakWord">
        <strong><a href="https://en.wikipedia.org/wiki/International_Chemical_Identifier" target="_blank">
          InChI String:
        </a></strong>
        {{ inchi }}
      </div>
    </div>
    <div v-if="inchiKey" class="row">
      <div class="col-1 pl-0">
        <copy-text :tip-text="'Copy InChIKey'" :to-copy="inchiKey" :copy-type="'icon'" />
      </div>
      <div class="col-11 pt-2 breakWord">
        <strong><a href="https://en.wikipedia.org/wiki/International_Chemical_Identifier#InChIKey" target="_blank">
          InChIKey:
        </a></strong>
        {{ inchiKey }}
      </div>
    </div>
    <div class="row">
      <div class="col-1 pl-0">
        <copy-text :tip-text="'Copy All'" :to-copy="copyAll" :copy-type="'icon'" />
      </div>
      <div class="pt-2 h3">
        <span class="align-middle"> Copy All</span>
      </div>
    </div>
    <div v-if="inchiKey && inchiKeySkeleton" class="row">
      <div class="col pt-2 pr-1 pl-2 h3 text-left text-nowrap">
        Search Google for:
      </div>
      <div class="col-3 px-0">
        <mdb-btn
          tag="a"
          color="info"
          data-cy="inchiKeySkelLink"
          size="sm"
          class="text-white"
          :href="`https://www.google.com/search?q=%22${inchiKeySkeleton.split('-')[0]}%22`"
          target="_blank"
        >
          <span class="icon"><i class="fa fa-search" /></span>
          <span>Structural Skeleton</span>
        </mdb-btn>
      </div>
      <div class="col-3 px-0">
        <mdb-btn
          tag="a"
          color="info"
          data-cy="inchiKeyLink"
          size="sm"
          class="text-white"
          :href="`https://www.google.com/search?q=%22${inchiKey}%22`"
          target="_blank"
        >
          <span class="icon"><i class="fa fa-search" /></span>
          <span>Full Structure</span>
        </mdb-btn>
      </div>
      <div class="col-4" />
    </div>
  </div>
</template>

<script>
import {mdbBtn} from 'mdbvue';
// TODO: Formatting of identifiers
export default {
  name: 'StructuralIdentifiers',
  components: {
    mdbBtn,
  },
  props: ['autoOpen', 'acdIupacName', 'smiles', 'inchi', 'inchiKey', 'inchiKeySkeleton'],
  computed: {
    copyAll() {
      return `IUPAC Name: ${this.acdIupacName}\n SMILES: ${this.smiles}\n InChI String: ${this.inchi}\n InChIKey: ${this.inchiKey}\n`;
    },
  },
};
</script>

<style lang="scss" scoped>
.md-accordion .scalable .collapse-item.card-body .row {
    height: max-content !important;
}
.md-accordion .collapse-item.card-body .row {
    height: max-content !important;
}
div .breakWord {
      word-wrap: break-word !important;
    }
.btn.btn-sm {
  padding: .5rem .6rem;
}
</style>
