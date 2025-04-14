<template>
  <div>
    <div>
      <b-tabs v-model="tabIndex" class="options-tabs">
        <b-tab :title="searchTypes[0].text" :title-link-class="linkClass(0)">
          <div
            class="row mt-1"
          >
            <div class="col form-group">
              <label>Elements must be included:</label>
              <div class="input-group">
                <input
                  v-model="includeElements"
                  class="form-control"
                  placeholder="e.g. C,F,H"
                  type="text"
                >
                <b-btn
                  v-b-modal.modalPeriodElements
                  class="ml-1 mt-0"
                  size="sm"
                  variant="primary"
                  @click="showIncludeModal"
                >
                  <img src="~/assets/img/ic_view_module_white_24px.svg">
                </b-btn>
              </div>
              <periodic-table
                :emit-event="'allowedChange'"
                :modal-id="'modalPeriodElements'"
                @allowedChange="changeAllowedElements"
              />
            </div>
            <div class="col form-group">
              <label>Elements must be excluded:</label>
              <div class="input-group">
                <input
                  v-model="excludeElements"
                  class="form-control"
                  placeholder="e.g. C,F,H"
                  type="text"
                >
                <b-btn
                  v-b-modal.modalPeriodElementsExlud
                  class="ml-1 mt-0"
                  size="sm"
                  variant="primary"
                  @click="showExcludeModal"
                >
                  <img
                    src="~/assets/img/ic_view_module_white_24px.svg"
                  >
                </b-btn>
              </div>
              <periodic-table
                :emit-event="'excludedChange'"
                :modal-id="'modalPeriodElementsExlud'"
                @excludedChange="changeExcludedElements"
              />
            </div>
          </div>
          <div
            class="row mt-1"
          >
            <div class="col form-group">
              <div class="form-group form-check">
                <input
                  id="toxvalOnly"
                  v-model="toxval"
                  type="checkbox"
                  class="form-check-input options pb-sm-3"
                >
                <label class="form-check-label" for="toxvalOnly">Toxval Data Only</label>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab :title="searchTypes[1].text" :title-link-class="linkClass(1)">
          <div
            class="row mt-2"
          >
            <div class="col">
              <label>Min similarity: {{ minSimilarity }}</label>
              <b-form-input
                v-model="minSimilarity"
                :disabled="disableSimilarity"
                max="1"
                min="0.0"
                step="0.01"
                type="range"
              />
            </div>
            <div
              v-if="searchType === 'ADVANCED'"
              class="col"
            >
              <label />
              <b-form-checkbox v-model="useSimilarity">
                Use similarity
              </b-form-checkbox>
            </div>
            <div class="col">
              <div class="form-group">
                <label>Similarity-type:</label>
                <select
                  v-model="similarityType"
                  :disabled="disableSimilarity"
                  class="form-control"
                >
                  <option value="tanimoto">
                    Tanimoto
                  </option>
                </select>
              </div>
            </div>
            <div
              class="row mt-1"
            >
              <div class="col form-group">
                <label>Elements must be included:</label>
                <div class="input-group">
                  <input
                    v-model="includeElements"
                    class="form-control"
                    placeholder="e.g. C,F,H"
                    type="text"
                  >
                  <b-btn
                    v-b-modal.modalPeriodElements
                    class="ml-1 mt-0"
                    size="sm"
                    variant="primary"
                    @click="showIncludeModal"
                  >
                    <img src="~/assets/img/ic_view_module_white_24px.svg">
                  </b-btn>
                </div>
                <periodic-table
                  :emit-event="'allowedChange'"
                  :modal-id="'modalPeriodElements'"
                  @allowedChange="changeAllowedElements"
                />
              </div>
              <div class="col form-group">
                <label>Elements must be excluded:</label>
                <div class="input-group">
                  <input
                    v-model="excludeElements"
                    class="form-control"
                    placeholder="e.g. C,F,H"
                    type="text"
                  >
                  <b-btn
                    v-b-modal.modalPeriodElementsExlud
                    class="ml-1 mt-0"
                    size="sm"
                    variant="primary"
                    @click="showExcludeModal"
                  >
                    <img
                      src="~/assets/img/ic_view_module_white_24px.svg"
                    >
                  </b-btn>
                </div>
                <periodic-table
                  :emit-event="'excludedChange'"
                  :modal-id="'modalPeriodElementsExlud'"
                  @excludedChange="changeExcludedElements"
                />
              </div>
            </div>
            <div
              class="row mt-1"
            >
              <div class="col form-group">
                <div class="form-group form-check">
                  <input
                    id="toxvalOnly"
                    v-model="toxval"
                    type="checkbox"
                    class="form-check-input options pb-sm-3"
                  >
                  <label class="form-check-label" for="toxvalOnly">Toxval Data Only</label>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <!-- <div class="row mb-3">
      <div class="col">
        <b-form-radio-group
          v-model="searchType"
          :options="searchTypes"
          button-variant="primary"
          name="radio-btn"
          size="md"
          buttons
        />
      </div>
    </div>

    <div
      v-if="searchType === 'SIMILAR' || searchType === 'ADVANCED'"
      class="row mt-2"
    >
      <div class="col">
        <label>Min similarity: {{ minSimilarity }}</label>
        <b-form-input
          v-model="minSimilarity"
          :disabled="disableSimilarity"
          max="1"
          min="0.0"
          step="0.01"
          type="range"
        />
      </div>
      <div
        v-if=" searchType === 'ADVANCED'"
        class="col"
      >
        <label />
        <b-form-checkbox v-model="useSimilarity">
          Use similarity
        </b-form-checkbox>
      </div>
      <div class="col">
        <div class="form-group">
          <label>Similarity-type:</label>
          <select
            v-model="similarityType"
            :disabled="disableSimilarity"
            class="form-control"
          >
            <option value="tanimoto">
              Tanimoto
            </option>
            <option value="euclid-sub" disabled>
              Euclidean
            </option>
            <option value="tversky" disabled>
              Tversky
            </option>
          </select>
        </div>
      </div>
    </div> -->

    <!--  <div
      v-if="searchType === 'FORMULA' || searchType === 'ADVANCED'"
      class="row mt-2"
    >
      <div class="col-9">
        <label>Molecular formula:
          <b-icon
            id="formula-help"
            icon="info-circle"
          />
        </label>
        <input
          v-model="formula"
          class="form-control"
          placeholder="examples: C6H8O2 or C6H(8-10)O(0-2)"
        >
        <b-popover
          delay="500"
          target="formula-help"
          triggers="hover"
        >
          <template v-slot:title>
            Molecular Formula Query
          </template>
          <div class="m-2">
            <h6 class="mt-2">
              Rules:
            </h6>
            <div>
              <em>C5 or C(5)</em> - records having exactly 5 carbons
            </div>
            <div>
              <em>C(10-15)</em> - records having between 10 and 15 carbons
            </div>
            <h6 class="mt-2">
              Examples:
            </h6>
            <div>
              C6H8O2 or C6H(8-10)O(0-2)
            </div>
          </div>
        </b-popover>
      </div>
      <div
        v-if="errorMessageFormula"
        class="text-danger"
      >
        {{ errorMessageFormula }}
      </div>
    </div> -->

    <!--  <div
      v-if="searchType === 'MASS' || searchType === 'ADVANCED'"
      class="row mt-2"
    >
      <div class="container">
        <div class="row">
          <div class="btn-group form-group col">
            <button
              :class="{'btn-secondary': massPlusMinus, 'btn-outline-secondary': !massPlusMinus } "
              class="btn"
              @click="massPlusMinus=true"
            >
              ±
            </button>
            <button
              :class="{'btn-secondary': !massPlusMinus, 'btn-outline-secondary': massPlusMinus } "
              class="btn"
              @click="massPlusMinus = false;"
            >
              Min/Max
            </button>
          </div>

          <div class="form-group col">
            <select
              v-model="massType"
              class="form-control"
            >
              <option disabled="true">
                molecular-weight
              </option>
              <option disabled="true">
                most-abundant-mass
              </option>
              <option>
                monoisotopic-mass
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="container">
        <div
          v-if="massPlusMinus"
          class="row"
        >
          <div class="col">
            <div class="form-group">
              <label>Mass, Da:
                <input
                  v-model="mass"
                  :class="{'is-invalid': errorMessageMass || errorMessage}"
                  class="form-control"
                  type="number"
                >
              </label>

              <span class="mr-1 mt-1">±</span>

              <label class="mb-2">
                <input
                  v-model="deltaMass"
                  :class="{'is-invalid': errorMessageDelta || errorMessage}"
                  class="form-control"
                  type="number"
                >
              </label>

              <div class="btn-group">
                <button
                  :class="{'btn-secondary': unitsDaltons, 'btn-outline-secondary': !unitsDaltons } "
                  class="btn btn-primary btn-sm"
                  @click="unitsDaltons=true"
                >
                  Da
                </button>
                <button
                  :class="{'btn-secondary': !unitsDaltons, 'btn-outline-secondary': unitsDaltons } "
                  class="btn btn-primary btn-sm"
                  @click="unitsDaltons=false"
                >
                  ppm
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="row"
        >
          <div class="col">
            <div class="form-group">
              <label>Min mass, Da: (0 - 2000)
                <input
                  v-model="minMass"
                  :class="{'is-invalid': errorMessageMinMass || errorMessage}"
                  class="form-control"
                  type="number"
                >
              </label>
              <div class="invalid-feedback">
                {{ errorMessageMinMass }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Max mass, Da: (0 - 2000)
                <input
                  v-model="maxMass"
                  :class="{'is-invalid': errorMessageMaxMass || errorMessage}"
                  class="form-control"
                  type="number"
                >
              </label>
              <div class="invalid-feedback">
                {{ errorMessageMaxMass }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-danger">
          {{ errorMessage }}
        </div>
      </div>

      <div v-if="1==0" class="container">
        <div class="row form-check">
          <label class="form-check-label">
            <input
              v-model="singleComponent"
              class="form-check-input"
              type="checkbox"
            >
            Single components (searches individual components in mixtures)
          </label>
        </div>
      </div>
    </div> -->

    <!-- <div
      v-if="searchType === 'HAZARD' || searchType === 'ADVANCED'"
      class="row mt-2"
    >
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Hazard Name:</label>
              <b-form-select
                v-model="hazardName"
                :options="['', ...hazardNames]"
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Source:</label>
              <b-form-select
                v-model="hazardSource"
                :options="['', ...getHazardSources]"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Route:</label>
              <b-form-select
                v-model="hazardRoute"
                :options="['', ...getHazardRoutes]"
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Category:</label>
              <b-form-select
                v-model="hazardCategory"
                :options="['', ...getHazardCats]"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Hazard Code:</label>
              <b-form-select
                v-model="hazardCode"
                :options="['', ...getHazardCodes]"
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Test Organism:</label>
              <b-form-select
                v-model="hazardOrganism"
                :options="['', ...getHazardOrganisms]"
              />
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!--  <div
      v-if="searchType !== 'EXACT'"
      class="row mt-3"
    >
      <div class="col form-group">
        <b-form-checkbox-group
          v-if="1==0"
          v-model="features"
          :options="filters"
        />
      </div>
    </div> -->

    <!-- <div
      v-if="searchType !== 'FORMULA'"
      class="row mt-1"
    >
      <div class="col form-group">
        <label>Elements must be included:</label>
        <div class="input-group">
          <input
            v-model="includeElements"
            class="form-control"
            placeholder="e.g. C,F,H"
            type="text"
          >
          <b-btn
            v-b-modal.modalPeriodElements
            class="ml-1 mt-0"
            size="sm"
            variant="primary"
            @click="showIncludeModal"
          >
            <img src="~/assets/img/ic_view_module_white_24px.svg">
          </b-btn>
        </div>
        <periodic-table
          :emit-event="'allowedChange'"
          :modal-id="'modalPeriodElements'"
          @allowedChange="changeAllowedElements"
        />
      </div>
      <div class="col form-group">
        <label>Elements must be excluded:</label>
        <div class="input-group">
          <input
            v-model="excludeElements"
            class="form-control"
            placeholder="e.g. C,F,H"
            type="text"
          >
          <b-btn
            v-b-modal.modalPeriodElementsExlud
            class="ml-1 mt-0"
            size="sm"
            variant="primary"
            @click="showExcludeModal"
          >
            <img
              src="~/assets/img/ic_view_module_white_24px.svg"
            >
          </b-btn>
        </div>
        <periodic-table
          :emit-event="'excludedChange'"
          :modal-id="'modalPeriodElementsExlud'"
          @excludedChange="changeExcludedElements"
        />
      </div>
    </div> -->

    <!-- <div class="row mt-3">
      <div class="col">
        <div class="form-group">
          <label>Minimum toxicity:</label>
          <b-form-select
            v-model="toxicity"
            :options="toxicities"
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label>Minimum authority:</label>
          <b-form-select
            v-model="authority"
            :options="authorities"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue'
import {mapMutations} from 'vuex'
import PeriodicTable from '../Tables/PeriodicTable.vue'

const eventBus = new Vue()

export default {
  components: {
    PeriodicTable,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    filters: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deltaMassDa: 0,
      deltaMass: this.value.deltaMass,
      mass: this.value.mass,
      searchType: this.value.searchType,
      toxval: this.value.toxval,
      minSimilarity: this.value.minSimilarity,
      useSimilarity: this.value.useSimilarity,
      similarityType: this.value.similarityType,
      formula: this.value.formula,
      queryFormula: this.value.queryFormula,
      minMass: this.value.minMass,
      maxMass: this.value.maxMass,
      massType: this.value.massType,
      singleComponent: this.value.singleComponent,
      features: this.value.features,
      includeElements: this.value.includeElements,
      excludeElements: this.value.excludeElements,
      hazardName: null,
      hazardSource: null,
      hazardRoute: null,
      hazardCategory: null,
      hazardCode: null,
      hazardOrganism: null,
      toxicity: null,
      authority: null,
      massPlusMinus: false,
      unitsDaltons: true,
      searchTypes: [
        {
          text: 'Substructure', value: 'SUBSTRUCTURE',
        },
        {text: 'Similarity', value: 'SIMILAR'},
        // {text: 'Molecular Formula', value: 'FORMULA'},
        // {text: 'Molecular Weight', value: 'MASS'},
        // {text: 'Features', value: 'FEATURES'},
        // {text: 'Hazard', value: 'HAZARD'},
        // {text: 'Advanced', value: 'ADVANCED'},
      ],
      toxvalTileInfo: ['dtxsid', 'toxval', 'toxcast', 'similarity'],
      tileInfo: ['dtxsid', 'casrn', 'toxcast', 'similarity'],
      selectedTab: 0,
      tabIndex: 0,
      toxicities: [
        {text: 'Very High', value: 'VH'},
        {text: 'High', value: 'H'},
        {text: 'Medium', value: 'M'},
        {text: 'Low', value: 'L'},
        {text: 'Any', value: 'A'},
        {text: '', value: null},
      ],
      authorities: [
        {text: 'Authoritative', value: 'Authoritative'},
        {text: 'Screening', value: 'Screening'},
        {text: 'QSAR Model', value: 'QSAR Model'},
        {text: '', value: null},
      ],
    }
  },

  computed: {
    // ...mapGetters(['getHazardEndpoints']),
    // ...mapGetters(['getHazardSources']),
    // ...mapGetters(['getHazardRoutes']),
    // ...mapGetters(['getHazardCats']),
    // ...mapGetters(['getHazardCodes']),
    // ...mapGetters(['getHazardOrganisms']),

    // hazardNames() {
    //   return this.getHazardEndpoints.map(e => e.name)
    // },
    disableSimilarity() {
      return this.searchType === 'SIMILAR' ? false : !this.useSimilarity
    },
    errorMessageFormula() {
      const re = /([A-Z][a-z]?\s*(\d+|[+*!]|\(\s*((\d+)|(\d+)\s*-|-\s*(\d+)|(\d+)\s*-\s*(\d+))\s*\))?)+/

      if (!this.formula || re.test(this.formula)) { return null }

      return 'Invalid molecular formula'
    },
    errorMessageMinMass() {
      if (this.minMass < 0) { return 'min mass < 0' }
      if (this.minMass > 2000) { return 'min mass > 2000' }
      return null
    },
    errorMessageMaxMass() {
      if (this.maxMass < 0) { return 'max mass < 0' }
      if (this.maxMass > 2000) { return 'max mass > 2000' }
      return null
    },
    errorMessageMass() {
      if (this.mass < 0) { return 'mass < 0' }
      if (this.mass > 2000) { return 'mass > 2000' }
      return null
    },
    errorMessageDelta() {
      if (this.deltaMass < 0) { return 'delta mass < 0' }
      if (this.deltaMass > 1000) { return 'delta mass > 1000' }
      return null
    },
    errorMessage() {
      if (!this.minMass || !this.maxMass) { return null }
      if (this.minMass > this.maxMass) { return 'min > max mass' }
      if (this.minMass === this.maxMass) { return 'min == max mass' }
      if (this.minMass < 0) { return 'min mass < 0' }
      if (this.maxMass > 2000) { return 'max mass > 2000' }
      return null
    },

  },

  watch: {
    tabIndex() { this.searchType = this.searchTypes[this.tabIndex].value },
    searchType() { this.emitInputEvent() },
    toxval() {
      if (this.toxval === true) {
        this.setTileInfo(this.toxvalTileInfo)
      } else { this.setTileInfo(this.tileInfo) }
      this.emitInputEvent()
    },
    minSimilarity() { this.emitInputEvent() },
    useSimilarity() { this.emitInputEvent() },
    similarityType() { this.emitInputEvent() },
    formula() { this.emitInputEvent() },
    queryFormula() { this.emitInputEvent() },
    minMass() { this.emitInputEvent() },
    maxMass() { this.emitInputEvent() },
    massPlusMinus() { this.emitInputEvent() },
    unitsDaltons(d) { this.emitInputEvent() },
    massType() { this.emitInputEvent() },
    mass() { this.emitInputEvent() },
    deltaMass() { this.emitInputEvent() },
    singleComponent() { this.emitInputEvent() },
    features() { this.emitInputEvent() },
    includeElements() { this.emitInputEvent() },
    excludeElements() { this.emitInputEvent() },
    toxicity() { this.emitInputEvent() },
    authority() { this.emitInputEvent() },
    hazardName() { this.emitInputEvent() },
    hazardSource() { this.emitInputEvent() },
    hazardRoute() { this.emitInputEvent() },
    hazardCategory() { this.emitInputEvent() },
    hazardCode() { this.emitInputEvent() },
    hazardOrganism() { this.emitInputEvent() },
  },
  methods: {
    ...mapMutations({
      setTileInfo: 'results/setTileInfo',
    }),
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['primary-color', 'text-light', 'font-weight-bold']
      }
      return ['bg-light', 'text-dark', 'font-weight-bold']
    },
    emitInputEvent() {
      this.$emit('input', {
        searchType: this.searchType,
        toxval: this.toxval,
        minSimilarity: this.minSimilarity,
        useSimilarity: this.useSimilarity || !this.disableSimilarity,
        similarityType: this.similarityType,
        formula: this.formula,
        queryFormula: this.queryFormula,
        mass: this.mass,
        deltaMass: this.deltaMass,
        unitsDaltons: this.unitsDaltons,
        massPlusMinus: this.massPlusMinus,
        minMass: this.minMass,
        maxMass: this.maxMass,
        massType: this.massType,
        singleComponent: this.singleComponent,
        features: this.features,
        includeElements: this.includeElements,
        excludeElements: this.excludeElements,
        hazardName: this.hazardName,
        hazardSource: this.hazardSource,
        hazardRoute: this.hazardRoute,
        hazardCategory: this.hazardCategory,
        hazardCode: this.hazardCode,
        hazardOrganism: this.hazardOrganism,
        toxicity: this.toxicity,
        authority: this.authority,
      })
    },

    changeAllowedElements(data) {
      this.includeElements = data.elements
    },

    changeExcludedElements(data) {
      this.excludeElements = data.elements
    },

    emitPeriodicElements(data) {
      eventBus.$emit('EVENT_PERIODIC_ELEMENTS', data)
    },

    showIncludeModal() {
      this.emitPeriodicElements({included: this.includeElements, excluded: this.excludeElements})
    },

    showExcludeModal() {
      this.emitPeriodicElements({included: this.excludeElements, excluded: this.includeElements})
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap.scss';
@import 'bootstrap-vue/src/index.scss';

.nav-tabs {
  border-bottom: 1px solid #3280a3 !important;
}
.tab-details a.nav-link {
  color: #3280a3 !important;
}
.tab-details {
   color: black;
   margin-top: 2em;
   width: 100%;
   .nav-link {
     color: #3280a3 !important;
     border-color: #3280a3!important;
     border-bottom-color: rgb(222, 226, 230) !important;
     margin-bottom: 1px !important;
     text-transform: uppercase;
     font-size: .8rem;
   }
  .nav-link.active {
    background-color: #3280a3!important;
    border-bottom-color: #3280a3!important;
    color: white !important;
  }
  .tab-content {
    padding-top: 1em !important;
  }
 }

.tab-pane {
  height: fit-content !important;
  width: 100%;
}

.popover {
  width: 400px !important;
}

.child-properties {
    padding-left: 1rem;
}
.properties-tab {
    margin-bottom: 1rem;
}

.button-wrapper-right {
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
}

.nav-tabs .nav-link.enabledforuse {
    color: #f2f3f5 !important;
    cursor: pointer;
    background-color: #1079A8 !important;
}

.category-btn-group {
    display: flex;
    align-items: center;
    height: 2rem;
}
.btn-group-toggle .btn-group .btn-group-sm {
  label.btn .btn-outline-primary .btn-sm .active{
    background-color: #055e8a !important;
  }
}
.btn-outline-primary:not([disabled]):not(.disabled):active, .btn-outline-primary:not([disabled]):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
    background-color: transparent !important;
    border-color: #0e6993 !important;
    box-shadow: 0 5px 11px 0 #cacecf !important;
}


.custom-control-label{
  color: rgb(6, 76, 117) !important;
}
.btn-category {
    width: 2rem;
}
.category-label {
    margin-right: 0.5rem;
}

.btn-fab {
    padding: 0;
    line-height: 0;
    border-color: transparent;
    background: transparent;
    font-size: 0.8rem;

    &:focus {
        box-shadow: none;
    }
}

.btn-outline-dark:hover {
    color: #fff;
    background-color: rgba(52, 58, 64, 0.18);
    border-color: #343a40;
}

.range-padding {
    padding: 0;
}

.page-item.active .page-link {
    background-color: #17a2b8;
    border-color: #17a2b8;
}

.btn .fa-icon {
    vertical-align: middle;
    margin-right: 0.5rem;
}

.btn .fa-icon:last-child {
    margin-right: 0;
}


</style>
