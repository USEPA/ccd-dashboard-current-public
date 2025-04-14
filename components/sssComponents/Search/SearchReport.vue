<template>
  <div>
    <div class="row mb-1">
      <div class="col-auto">
        <div class="d-flex p-1">
          <Tristate
            v-model="localFilters"
            size="sm"
            @updated="localFilters = [...localFilters]"
          />
        </div>
      </div>
      <div
        v-if="records.length !== 0"
        class="col-auto d-flex align-items-center align-middle"
      >
        <h6 class="mr-2">
          Sort
        </h6>

        <b-form-select
          v-model="localSortBy"
          @input="$emit('update:sortBy', localSortBy)"
        >
          <option
            v-if="searchType !== 'FORMULA' && searchType !== 'HAZARD'"
            :value="'similarity'"
          >
            Similarity
          </option>
          <option :value="'mass'">
            Mass
          </option>
          <option :value="'toxicity'">
            Toxicity
          </option>
        </b-form-select>
        <button
          v-if="localSortDirection === 'asc'"
          class="btn"
          @click="onSortToggle"
        >
          <img src="~/assets/img/ic_sort_asc_black_24px.svg">
        </button>
        <button
          v-else
          class="btn"
          @click="onSortToggle"
        >
          <img src="~/assets/img/ic_sort_black_24px.svg">
        </button>
      </div>
    </div>

    <div
      v-if="records.length !== 0"
      class="row block-tile-img"
    >
      <div
        v-for="item in records"
        :id="`r-${item.id}`"
        :key="`r-${item.id}`"
        class="tile-img"
      >
        <a
          :href="getDashboardLink(item)"
          target="_blank"
        >
          <img :src="getImageUrl(item)">
        </a>

        <div class="block-badge-left">
          <img src="~/assets/img/ic_file_download_black_24px.svg">
          <a @click="onDownload(item, 'v2000')">
            <img src="~/assets/img/ic_file_download_black_24px.svg">
            v2000
          </a>
          <a @click="onDownload(item, 'v3000')">
            <img src="~/assets/img/ic_file_download_black_24px.svg">
            v3000
          </a>
        </div>
        <div
          v-if="item.hazard"
          :id="`hazard-${item.id}`"
          :class="{
            'table-secondary': item.hazard === 'I',
            'table-warning': item.hazard === 'M',
            'table-success': item.hazard === 'L',
            'table-danger': item.hazard === 'VH',
            'table-orange': item.hazard === 'H',
            'authoritative': item.authority === 'Authoritative',
            'screening': item.authority === 'Screening',
            'predicted': item.authority === 'QSAR Model',
          }"
          class="hazard-badge"
        >
          {{ item.hazard }}

          <HazardPopover
            :hazard-chemical="getHazardChemical(item.sid)"
            :target="`hazard-${item.id}`"
          />
        </div>
        <div
          v-if="isSimSearchType()"
          class="block-badge"
        >
          {{ roundup(item.similarity, 2) }}
        </div>
        <div
          v-if="searchType === 'MASS'"
          v-b-tooltip.hover
          :title="roundup(item.mass, 6)"
          class="block-badge"
        >
          {{ roundup(item.mass, 2) }}
        </div>

        <ChemPopover
          :chemical="item"
          :query="query"
          :search-type="searchType"
          :target="`r-${item.id}`"
        />
      </div>
    </div>

    <div
      v-if="records && records.length"
      class="row mt-2"
    >
      <div class="col-3">
        <b-form inline>
          <label class="mr-1">
            Page size
          </label>
          <b-form-select v-model="localPageSize">
            <option :value="50">
              50
            </option>
            <option :value="100">
              100
            </option>
            <option :value="150">
              150
            </option>
          </b-form-select>
        </b-form>
      </div>

      <div class="col align-content-center">
        <b-pagination
          v-model="localCurrentPage"
          :limit="10"
          :per-page="localPageSize"
          :total-rows="searchResult.totalRecordsCount"
          size="md"
        />
      </div>

      <div class="col-2 text-right">
        <b-dropdown>
          <template slot="button-content">
            <img src="~/assets/img/ic_file_download_white_24px.svg">
            <span>Download</span>
          </template>
          <b-dropdown-item @click="downloadAll('sdf')">
            SDF
          </b-dropdown-item>
          <b-dropdown-item @click="downloadAll('xlsx')">
            XLSX
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="col-2 text-right">
        <b-dropdown
          split
          text="Transfer to HCD"
          title="Transfer this page of search results to HCD"
          @click="transfer('hazard')"
        >
          <b-dropdown-item
            title="Transfer this page of search results to HCD"
            @click="transfer('hazard')"
          >
            Transfer to HCD
          </b-dropdown-item>
          <b-dropdown-item
            title="Transfer this page of search results to WebTEST Batch"
            @click="transfer('predict')"
          >
            Transfer to WebTEST
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import {cloneDeep} from 'lodash'
import Axios from 'axios'
import {
  download,
  DOWNLOAD_MOL,
  DOWNLOAD_URL,
  getDatedFilename,
  HAZARD_PREDICT_API,
  SEARCH_URL,
  SSS_URL,
} from '~/assets/scripts/links'
import Tristate from '~/components/sssComponents/Buttons/Tristate.vue'
import HazardPopover from '~/components/sssComponents/Helpers/HazardPopover.vue'
import ChemPopover from '~/components/sssComponents/Helpers/ChemPopover.vue'

export default {
  components: {
    ChemPopover, HazardPopover, Tristate,
  },
  props: {
    searchResult: {
      type: Object,
      required: true,
    },
    filters: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: String,
      default: 'similarity',
    },
    sortDirection: {
      type: String,
      default: 'desc',
    },
    pageSize: {
      type: Number,
      default: 50,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      localSortBy: this.sortBy,
      localSortDirection: this.sortDirection,
      localFilters: this.filters,
      localPageSize: this.pageSize,
      localCurrentPage: this.currentPage,
    }
  },

  computed: {
    records() {
      return this.searchResult.records
    },
    searchType() {
      return this.searchResult.request.searchType
    },
    query() {
      return this.searchResult.request.query
    },
  },

  watch: {
    localFilters() {
      this.$emit('update:filters', this.localFilters)
    },
    localPageSize() {
      this.$emit('update:page-size', this.localPageSize)
    },
    localCurrentPage() {
      this.$emit('update:current-page', this.localCurrentPage)
    },
  },

  methods: {
    getImageUrl(item) {
      if (this.searchType === 'SUBSTRUCTURE' || this.searchType === 'SIMILAR' || this.searchType === 'ADVANCED') {
        return `${SEARCH_URL}api/search/render/svg?id=${item.id}&query=${encodeURIComponent(this.query)}`
      }
      return `${SEARCH_URL}api/search/render/svg?id=${item.id}`
      // return `https://comptox.epa.gov/dashboard/dsstoxdb/compound_image_file?source=${item.id}`;
    },

    getDashboardLink(item) {
      return `https://comptox.epa.gov/dashboard/${item.sid}`
    },

    isSimSearchType() {
      return this.searchType === 'SUBSTRUCTURE' || this.searchType === 'SIMILAR'
    },

    roundup(value, digits) {
      // eslint-disable-next-line no-restricted-properties
      const round = Math.round(Math.pow(10, digits))
      return Math.round((value + Number.EPSILON) * round) / round
    },

    onDownload(item, format) {
      Axios.get(`${DOWNLOAD_MOL}?id=${item.id}&format=${format}`)
        .then((response) => {
          download(`${item.gsid}_${format}.mol`, response.data)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },

    onSortToggle() {
      if (this.localSortDirection === 'asc') { this.localSortDirection = 'desc' } else { this.localSortDirection = 'asc' }

      this.$emit('update:sortDirection', this.localSortDirection)
    },

    getHazardChemical(sid) {
      return Axios.get(`${HAZARD_PREDICT_API}?query=${sid}`)
        .then(response => response.data.hazardChemicals[0])
    },

    downloadAll(format) {
      if (this.searchResult && this.searchResult.request) {
        // get all data from server
        this.searchResult.request.limit = this.searchResult.totalRecordsCount
        this.searchResult.request.offset = 0

        Axios.post(SSS_URL, this.searchResult.request, {timeout: 30 * 1000})
          .then((response) => {
            const filename = getDatedFilename('search', format.toLowerCase())
            this.downloadFile(response.data, format, filename)
          })
          .catch((error) => {
            let errorMessage = `Error. ${error.status} - ${error.statusText}`
            if (error.status === 0) {
              errorMessage = 'Error. Search timed out.'
            }

            this.inProgress = false
            if (this.searchType === 'FORMULA') {
              error.json().then((data) => {
                if (data.error) {
                  this.showCalculateError(`Error: ${data.error}`)
                }
              },)
            } else {
              this.showCalculateError(errorMessage)
            }

            this.searchResult.totalRecordsCount = 0
          })
      }
    },

    // eslint-disable-next-line camelcase
    downloadFile(inputData, format, file_name) {
      const itemsList = inputData.records.map(item => ({id: item.id, sim: item.similarity}))
      const queryBody = {ids: itemsList, format: format}

      Axios.post(DOWNLOAD_URL, queryBody, {
        responseType: 'arraybuffer',
      }).then((response) => {
        download(file_name, response.data, format)
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
    },

    transfer(target) {
      const records2 = cloneDeep(this.records)
      records2.forEach((r) => {
        r.id = r.sid
        r.checked = true
      })

      this.$store.dispatch('addUniqueStructures', records2)
        .then(() => this.$router.push(target))
    },
  },
}
</script>

<style lang="scss">
.block-tile-img {
    display: flex;
    flex-wrap: wrap;
    margin-left: -5px;
    margin-right: -5px;
}

.tile-img {
    width: 110px;
    height: 110px;
    border: 1px solid #ddd;
    margin: 2px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        max-width: 100%;
        max-height: 100%;
    }

    position: relative;

    .block-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 2px;
        background: rgba(#efefef, .5);
    }

    .hazard-badge {
        position: absolute;
        top: 0;
        right: 0;
        padding: 3px;
    }

    .block-badge-left {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 2px;
        opacity: 0;
        cursor: pointer;
        display: flex;
        transition: 0.3s;

        a {
            display: none;
            width: 50%;
            text-align: center;
            font-size: 12px;
            line-height: 24px;
            background: #ffffff;
            z-index: 1;

            img {
                height: 14px;
                width: 14px;
                display: inline-block;
            }
        }

        & > img {
            opacity: .5;
        }

        &:hover {
            width: 100%;
            text-decoration: none;

            & > img {
                display: none;
            }

            a {
                display: block;

                &:hover {
                    background: #efefef;
                }
            }
        }
    }

    &:hover .block-badge-left {
        opacity: 1;
    }
}

</style>
