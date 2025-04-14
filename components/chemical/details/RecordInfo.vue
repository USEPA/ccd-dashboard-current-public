<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-1">
          <copy-text :tip-text="'Copy Citation'" :to-copy="citation" :copy-type="'icon'" />
        </div>
        <div class="col-11">
          <!-- <copy :to-copy="`${dashboard_title}, ${name}`"></copy> <help helpKey="SR Record Information Panel'"></help>-->
          <strong>Citation: </strong>
          {{ citation }} <span v-html="subSuperScriptReplace(name)" />
        </div>
      </div>
      <template v-if="description">
        <span><strong>Data Quality:</strong></span>
        <div class="qclevel l1" :class="{active: description.includes('Level 1')}">
          Level 1: Expert curated, highest confidence in accuracy and consistency of unique chemical identifiers
        </div>
        <div class="qclevel l2" :class="{active: description.includes('Level 2')}">
          Level 2: Expert curated, unique chemical identifiers using multiple sources
        </div>
        <div class="qclevel l3" :class="{active: description.includes('Level 3')}">
          Level 3: Programmatically curated from high quality EPA source, unique chemical identifiers have no
          conflicts in ChemID and PubChem
        </div>
        <div class="qclevel l4" :class="{active: description.includes('Level 4')}">
          Level 4: Programmatically curated from ChemID, unique chemical identifiers have no conflicts in PubChem
        </div>
        <div class="qclevel l5" :class="{active: description.includes('Level 5')}">
          Level 5: Programmatically curated from ACToR or PubChem, unique chemical identifiers with low confidence,
          single public source
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RecordCollapse',
  props: ['dtxsid', 'description', 'name'],
  data() {
    return {
      now: '',
    };
  },
  computed: {
    citation() {
      return `U.S. Environmental Protection Agency. Comptox Chemicals Dashboard. ${process.env.APPLICATION_EXTERNAL_LINK_URL}${process.env.APPLICATION_ROUTER_BASE}chemical/details/${this.dtxsid} (accessed ${this.now})`;
    },
  },
  created() {
    this.now = this.dateFormat(new Date(), 'MMMM dd, yyyy');
  },
};

</script>

<style scoped lang="scss">
.md-accordion .card .collapse-item.card-body .row {
    height: max-content !important;
    overflow-y: visible !important;
}
.qclevel {
  padding-left: 5px !important;

  &.active {
    height: max-content !important;
    border: 2px dashed black;
  }
  &:not(.active) {
    height: max-content !important;
    filter: grayscale(100%);
  }
  &.l1 {
    background-color: #9CDBFF;
  }
  &.l2 {
    background-color: #D0E3A4;
  }
  &.l3 {
    background-color: #F5E18D;
  }
  &.l4 {
    background-color: #F8D292;
  }
  &.l5 {
    background-color: #FFC9BB;
    margin-bottom: 10px;;
  }
}
</style>
