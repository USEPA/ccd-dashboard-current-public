<template>
  <div class="container mb-2 pb-2">
    <client-only placeholder="Loading...">
      <isotope-pattern
        v-if="!isMarkush"
        :chart-data="chartData"
        :row-data="rowData"
        :formula="mol_formula"
        :visibility="showIsotopePattern"
        @toggleVisibility="showHideIsotope"
      />
    </client-only>
    <div class="row">
      <div v-if="mol_weight && !isMarkush" class="col-1 pl-1">
        <copy-text :tip-text="'Copy Molecular Formula'" :to-copy="mol_formula" :copy-type="'icon'" />
      </div>
      <div class="col-11">
        <strong v-if="mol_formula && !isMarkush">Molecular Formula:</strong>
        <span v-if="mol_formula && !isMarkush" v-html="formattedFormula" />
        <mdb-btn
          tag="a"
          color="info"
          data-cy="MolLink"
          size="sm"
          class="text-white"
          :href="downloadMolUrl"
          target="_blank"
        >
          <span class="icon">
            <i class="fa fa-download" />
          </span>
          <span>Mol File</span>
        </mdb-btn>
        <mdb-btn
          v-if="mol_weight"
          tag="a"
          color="info"
          data-cy="ChemicalLink"
          size="sm"
          class="text-white"
          :target="'_blank'"
          @click="findAllChemicals"
        >
          <span class="icon"><i class="fa fa-search" /></span>
          <span>Find All Chemicals</span>
        </mdb-btn>
      </div>
    </div>
    <div v-if="mol_weight" class="row">
      <div class="col-1 pl-1">
        <copy-text :tip-text="'Copy Average Mass'" :to-copy="mol_weight" :copy-type="'icon'" />
      </div>
      <div class="col-11">
        <strong>Average Mass:</strong>
        {{ formattedWeight }} g/mol
        <mdb-btn
          color="info"
          data-cy="IsotopeModalButton"
          size="sm"
          class="text-white"
          @click.native="showHideIsotope"
        >
          <span class="icon">
            <i class="fa fa-bar-chart" />
          </span>
          <span>Isotope Mass Distribution</span>
        </mdb-btn>
      </div>
    </div>
    <div v-if="mol_weight" class="row">
      <div class="col-1 pl-1">
        <copy-text :tip-text="'Copy Monoisotopic Mass'" :to-copy="monoisotopic_mass" :copy-type="'icon'" />
      </div>
      <div class="col-11 pt-2">
        <strong>Monoisotopic Mass:</strong>
        {{ formattedMono }} g/mol
      </div>
    </div>
  </div>
</template>

<script>
import {mdbBtn} from 'mdbvue';
import IsotopePattern from '@/components/chemical/details/IsotopePatternModal.vue';

const chemcalc = require('chemcalc');

export default {
  name: 'IntrinsicProperties',
  components: {
    IsotopePattern,
    mdbBtn,
  },
  // eslint-disable-next-line vue/prop-name-casing
  props: ['auto-open', 'mol_formula', 'mol_weight', 'monoisotopic_mass', 'cid', 'dtxsid', 'isMarkush'],
  data() {
    return {
      dtxcid: '',
      showIsotopePattern: false,
      chartData: [],
      rowData: [],
    };
  },
  computed: {
    downloadMolUrl() {
      return `${process.env.APPLICATION_BASE_API}${this.apiSettings().MOL_DOWNLOAD}${this.dtxsid}`;
    },
    formattedFormula() {
      if (!this.mol_formula) {
        return 'Not Found';
      }
      return this.mol_formula
        .replace(/\[(\d+)([A-Za-z])/g, '[<sup>$1</sup>$2')
        .replace(/([A-Za-z\]])(\d+)/g, '$1<sub>$2</sub>');
    },
    formattedWeight() {
      const factor = 10 ** 3;
      return Math.round(this.mol_weight * factor) / factor;
    },
    formattedMono() {
      const factor = 10 ** 6;
      return Math.round(this.monoisotopic_mass * factor) / factor;
    },
  },
  created() {
    this.dtxcid = this.cid2dtxcid(this.cid);
    if (this.mol_formula && !this.isMarkush) {
      const {xy} = chemcalc.analyseMF(this.mol_formula, {isotopomers: 'xy', fwhm: 0.0001});
      this.chartData = xy;
      const td = xy.trim().split(/\n/g).map((line) => {
        const lineSplit = line.split(/,/).map(text => parseFloat(text.trim()));
        return {x: lineSplit[0], y: lineSplit[1]};
      });
      this.rowData = td;
    }
  },
  methods: {
    showHideIsotope() {
      this.showIsotopePattern = !this.showIsotopePattern;
    },
    findAllChemicals() {
      const params = {
        inputs: this.mol_formula,
        input_type: 'exact_formula',
        no_filters: true,
      };
      this.$router.push({name: 'search-results',
        query: {
          inputs: params.inputs, input_type: params.input_type, no_filters: params.no_filters,
        }});
    },
  },
};
</script>

