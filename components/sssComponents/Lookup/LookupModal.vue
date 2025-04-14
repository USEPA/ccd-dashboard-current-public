<template>
  <b-modal
    ref="searchModalRef"
    centered
    class="p-0 modal-row"
    hide-footer
    hide-header
    size="lg"
  >
    <b-button-close @click="hideSearchModal()">
      ×
    </b-button-close>

    <b-tabs
      v-model="tabIndex"
      card
    >
      <b-tab title="Search by identifiers">
        <b-form-textarea
          id="textarea1"
          v-model="searchText"
          :max-rows="10"
          :rows="10"
          autofocus
          class="mb-2"
          placeholder="Any combination of DTXSID, SMILES, Name, CASRN, InChI and InChIKey, one per line"
        />

        <div class="text-right">
          <b-button
            :disabled="searchText.length === 0"
            variant="primary"
            @click="onSearch()"
          >
            Search
          </b-button>
        </div>
      </b-tab>

      <b-tab title="Search by structure">
        <ketcher ref="ketcher" />

        <div class="container">
          <div class="row">
            <div class="col">
              <b-form-radio-group
                v-model="sssType"
                :options="sssTypes"
              />
            </div>

            <div
              v-if="sssType==='SUBSTRUCTURE' || sssType==='SIMILAR'"
              class="col-3"
            >
              <b-form-input
                v-model="minSimilarity"
                max="1"
                min="0.2"
                step="0.05"
                type="range"
              />
            </div>

            <div class="col-1">
              <span v-if="sssType==='SUBSTRUCTURE' || sssType==='SIMILAR'">
                {{ minSimilarity }}
              </span>
            </div>

            <div class="col-2">
              <b-form-select
                v-if="sssType==='SIMILAR' || sssType==='SUBSTRUCTURE'"
                v-model="sssLimit"
              >
                <b-form-select-option value="20">
                  20
                </b-form-select-option>
                <b-form-select-option value="50">
                  50
                </b-form-select-option>
                <b-form-select-option value="100">
                  100
                </b-form-select-option>
                <b-form-select-option :value="null">
                  No limit
                </b-form-select-option>
              </b-form-select>
            </div>
          </div>
          <div class="row form-group">
            <div class="col">
              <div>
                <label>Minimum toxicity:</label>
                <b-form-select
                  v-model="toxicity"
                  :options="toxicities"
                />
              </div>
            </div>

            <div class="col">
              <div>
                <label>Minimum authority:</label>
                <b-form-select
                  v-model="authority"
                  :options="authorities"
                />
              </div>
            </div>

            <div class="col-2 align-bottom text-right">
              <div class="pt-4">
                <b-button
                  variant="primary"
                  @click="onStructureSearch()"
                >
                  Search
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </b-tab>

      <b-tab title="Search result">
        <div
          v-if="getSearchStatus.pending"
          class="loading-result"
        >
          <font-awesome-icon
            class="fa-spin text-primary"
            icon="spinner"
          />
        </div>

        <div
          v-if="!getSearchStatus.pending && getFoundStructures.length === 0"
          class="loading-result"
        >
          <p v-if="!getSearchStatus.err">
            No result
          </p>
          <p v-else>
            {{ getSearchStatus.err }}
          </p>
        </div>

        <div v-if="getFoundStructures.length > 0">
          <div class="row">
            <div class="col">
              <template v-if="searchType === 'ID'">
                Chemical(s) found by {{ searchIds.length }} identifier(s)
              </template>
              <template v-else-if="searchType === 'SSS'">
                Chemical(s) found by {{ sssType }} search
              </template>
            </div>
            <div class="col text-right mb-3">
              <b-form-input
                v-if="searchType==='SSS'"
                v-model="cutoffSimilarity"
                :disabled="minSim === maxSim"
                :min="minSim"
                :step="cutoffStep"
                class="col-3 align-middle"
                max="1"
                type="range"
              />

              <span>{{ getSelectedStructures.length }} / {{ getFoundStructures.length }}</span>
              <b-button
                v-b-tooltip.hover
                size="sm"
                title="Remove All"
                variant="outline-secondary"
                @click="onRemoveAll"
              >
                <font-awesome-icon icon="trash-alt" />
              </b-button>
              <b-button
                v-b-tooltip.hover
                size="sm"
                title="Select All"
                variant="outline-secondary"
                @click="onSelectAll()"
              >
                <font-awesome-icon icon="check" />
              </b-button>
              <b-button
                v-b-tooltip.hover
                size="sm"
                title="Select None"
                variant="outline-secondary"
                @click="onSelectNone()"
              >
                <font-awesome-icon icon="minus" />
              </b-button>
              <b-button
                v-b-tooltip.hover
                :disabled="getSelectedStructures.length === 0"
                size="sm"
                title="Add chemicals to the cart"
                variant="outline-secondary"
                @click="onAdd()"
              >
                Add
              </b-button>
            </div>
          </div>

          <div class="p-body">
            <b-row>
              <b-col
                v-for="(item, index) in getFoundStructures"
                :key="`search-${index}`"
                class="m-2 p-0"
                sm="auto"
              >
                <ChemCard
                  :item="item"
                  :on-check-click="invertStructureSelection"
                />
              </b-col>
            </b-row>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import {mapGetters} from 'vuex'
import Ketcher from './Ketcher.vue'
import ChemCard from '../Cards/ChemCard.vue'

// eslint-disable-next-line no-undef
const eventBus = new Vue()

export default {
  components: {Ketcher, ChemCard},
  data() {
    return {
      tabIndex: 0,
      searchText: '',
      searchIds: [],
      searchType: null,
      sssType: 'SUBSTRUCTURE',
      sssTypes: [
        {text: 'Substructure', value: 'SUBSTRUCTURE'},
        {text: 'Similarity', value: 'SIMILAR'},
      ],
      minSimilarity: 0.85,
      sssLimit: 20,
      cutoffSimilarity: null,

      toxicity: null,
      authority: null,

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
    ...mapGetters(['getFoundStructures']),
    ...mapGetters(['getSearchStatus']),
    ...mapGetters(['getSelectedStructures']),

    minSim() {
      let m = 0
      if (this.getFoundStructures && this.getFoundStructures[0]) {
        m = this.getFoundStructures
          .reduce((min, str) => Math.min(min, str.similarity), this.getFoundStructures[0].similarity)
      }
      return m
    },

    maxSim() {
      let m = 1
      if (this.getFoundStructures && this.getFoundStructures[0]) {
        m = this.getFoundStructures
          .reduce((min, str) => Math.max(min, str.similarity), this.getFoundStructures[0].similarity)
      }
      return m
    },

    cutoffStep() {
      const m = Math.abs(1.0 - this.minSim) / 10.0
      console.log('cutoffStep: %d', m)
      return m
    },
  },

  watch: {
    cutoffSimilarity(newValue) {
      // eslint-disable-next-line no-return-assign
      if (this.getFoundStructures) { this.getFoundStructures.forEach(s => s.checked = (s.similarity >= newValue)) }
    },
  },

  created() {
    eventBus.$on('START_SEARCH', () => this.showSearchModal())
  },

  methods: {
    showSearchModal() {
      this.$store.commit('LOOKUP_SET_RESULT', [])
      this.tabIndex = 0
      this.searchText = ''
      if (this.$refs.searchModalRef) { this.$refs.searchModalRef.show() }
    },

    hideSearchModal() {
      this.$refs.searchModalRef.hide()
    },

    onSearch() {
      this.searchIds = this.searchText.split('\n').filter(str => (str && !/^\s*$/.test(str)))
      if (!this.searchIds) { return }

      this.searchType = 'ID'

      this.$store.commit('LOOKUP_SET_RESULT', [])

      this.$store.dispatch('searchByIds', {identifiers: this.searchIds})

      this.tabIndex = 2
    },

    onStructureSearch() {
      this.searchType = 'SSS'

      this.$store.commit('LOOKUP_SET_RESULT', [])

      const queryBody = {
        searchType: this.sssType,
        inputType: 'SMILES',
        query: this.$refs.ketcher.getSmiles(),
        limit: this.sssLimit,
        params: {
          'min-similarity': this.minSimilarity,
          'similarity-type': 'tanimoto',
          'filter-stereo': null,
          'filter-chiral': null,
          'filter-isotopes': false,
          'filter-charged': false,
          'filter-multicomponent': false,
          'filter-radicals': false,
          'filter-salts': null,
          'filter-polymers': false,
          'filter-sgroups': false,
          'min-toxicity': this.toxicity,
          'min-authority': this.authority,
        },
      }

      this.$store.dispatch('searchBySss', queryBody)

      this.tabIndex = 2
    },

    onAdd() {
      this.$store.dispatch('addUniqueStructures', this.getSelectedStructures)
      this.$store.commit('SET_VIEW_STRUCTURES', true)
      this.hideSearchModal()
    },

    onSelectAll() {
      this.$store.commit('LOOKUP_SELECT_ALL')
    },

    onSelectNone() {
      this.$store.commit('LOOKUP_SELECT_NONE')
    },

    invertStructureSelection(structure) {
      this.$store.commit('LOOKUP_INVERT_STRUCTURE', structure)
    },

    onRemoveAll() {
      this.$store.commit('LOOKUP_SET_RESULT', [])
    },
  },
}
</script>

<style lang="scss" scoped>

.cutoff-slider {
    vertical-align: middle;
}

.loading-result {
    height: 385px;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
