<template>
  <mdb-container fluid class="tab-details mt-0 mb-0">
    <div class="buttons">
      <button @click="download()">
        <i class="fa fa-download" /> Excel
      </button>
    </div>
    <mdb-tabs
      v-if="!loading"
      :active="0"
      default
      :links="[
        {
          text: 'Annotations',
          slot: 'annotations',
          disabled: !annotationsEnabled
        },
        {
          text: 'Citations',
          slot: 'citations',
          disabled: !citationsEnabled,
        },
        {
          text: 'Dataset',
          slot: 'dataset',
          disabled: !datasetEnabled,
        },
      ]"
      :transition-duration="0.1"
      transition-style="linear"
      data-cy="assayDetailTabs"
    >
      <template :slot="'annotations'">
        <htpp-annotations
          v-if="annotations"
          :annotations="annotations"
          data-cy="htppAnnotations"
        />
      </template>
      <template :slot="'citations'">
        <htpp-citations
          v-if="citations"
          :citations="citations"
          data-cy="htppCitations"
        />
      </template>
      <template :slot="'dataset'">
        <htpp-dataset
          v-if="dataset"
          :dataset="dataset"
          data-cy="htppDataset"
        />
      </template>
    </mdb-tabs>
    <div v-else>
      loading...
    </div>
  </mdb-container>
</template>
<script>
import {saveAs} from 'file-saver'
import {
  mapGetters, mapActions,
} from 'vuex'
import {
  mdbContainer,
  mdbTabs,
} from 'mdbvue'
import ExcelJS from 'exceljs'
import HtppAnnotations from '~/components/httrHtpp/HtppAnnotations.vue'
import HtppCitations from '~/components/httrHtpp/HtppCitations.vue'
import HtppDataset from '~/components/httrHtpp/HtppDataset.vue'

export default {
  name: 'HttrHtppDetailTabs',
  components: {
    mdbContainer,
    mdbTabs,
    HtppAnnotations,
    HtppCitations,
    HtppDataset,
  },
  props: {
    dataIdentifiers: {
      type: Object,
      default() {
        return {
          annotations: null,
          dataset: null,
          citations: null,
          type: null,
        }
      },
    },
  },
  data() {
    return {
      tabs: {
        annotation: 'Annotations',
        citations: 'Citations',
        dataset: 'Dataset',

      },
      loading: true,
      orderedCitations: null,
      annotations: null,
      citations: [],
      dataset: [],
      selectedDataset: null,
      annotationsEnabled: false,
      citationsEnabled: false,
      datasetEnabled: false,
    }
  },
  async mounted() {
    this.citations = await this.$repositories[this.dataIdentifiers.type.toLowerCase()].detailsCitations(this.dataIdentifiers.citations)
    this.dataset = await this.$repositories[this.dataIdentifiers.type.toLowerCase()].detailsDataset(this.dataIdentifiers.dataset)
    this.annotations = await this.$repositories[this.dataIdentifiers.type.toLowerCase()].detailsAnnotations(this.dataIdentifiers.annotations)
    try {
      if (this.annotations) {
        this.updateObjectKeys(this.annotations)
        this.annotationsEnabled = true
      }
    } catch (err) {
      console.log('annotations error: ', err)
    }
    try {
      if (this.citations) {
        this.orderedCitations = this.citations ?
          this.citations.map((citation) => {
            const newObj = {
              pmid: citation.pmid,
              author: citation.author,
              title: citation.title,
              citation: citation.citation,
              doi: citation.doi,
            }
            return newObj
          }) : []
        this.citations = this.orderedCitations ?
          this.orderedCitations.map(o => this.updateObjectKeys(o)) : []
        this.citationsEnabled = true
      }
    } catch (err) {
      console.log('citations error', err)
    }
    try {
      if (this.dataset) {
        this.updateObjectKeys(this.dataset)
        this.datasetEnabled = true
      }
    } catch (err) {
      console.log('dataset error:', err)
    }
    this.loading = false
  },
  methods: {
    ...mapActions({
      getCitations: 'httr/citations',
      getDataset: 'httr/dataset',
      getAnnotations: 'httr/annotations',
    }),
    cleanUpKeyForDisplay(key) {
      const upCaseKey = key.charAt(0).toUpperCase() + key.slice(1)
      return upCaseKey.replace(/(?=[A-Z])/g, ' ').trim()
    },
    updateObjectKeys(obj) {
      Object.keys(obj).forEach((key) => {
        const newkey = this.cleanUpKeyForDisplay(key)
        obj[newkey] = obj[key]
        delete obj[key]
      })
      return obj
    },
    async download() {
      const workbook = new ExcelJS.Workbook()

      const worksheetConfigurations = {
        Annotations: [
          {header: 'PROPERTY', key: 'property'},
          {header: 'VALUE', key: 'value'},
        ],
        Citations: [
          {header: 'PMID', key: 'Pmid'},
          {header: 'URL', key: 'url'},
          {header: 'TITLE', key: 'Title'},
          {header: 'AUTHOR', key: 'Author'},
          {header: 'CITATION', key: 'Citation'},
          {header: 'DOI', key: 'Doi'},
          {header: 'DOI_URL', key: 'doiUrl'},
        ],
        Dataset: [
          {header: 'PROPERTY', key: 'property'},
          {header: 'VALUE', key: 'value'},
        ],
      }

      Object.keys(worksheetConfigurations).forEach((worksheetName) => {
        const worksheet = workbook.addWorksheet(worksheetName)

        // add header record
        worksheet.columns = worksheetConfigurations[worksheetName]

        // add data
        if (worksheetName === 'Annotations') {
          Object.keys(this.annotations).forEach((k) => {
            worksheet.addRow({
              property: k,
              value: this.annotations[k],
            })
          })
        } else if (this.citations && worksheetName === 'Citations') {
          this.citations.forEach((citation) => {
            const c = {...citation}
            c.url = `http://www.ncbi.nlm.nih.gov/pubmed/${c.Pmid}`
            c.doiUrl = c.Doi ? `https://doi.org/${c.Doi.substring(5)}` : null
            worksheet.addRow(c)
          })
          const urlColumn = worksheet.getColumn(2)
          urlColumn.eachCell((cell, rowNumber) => {
            if (rowNumber !== 1) {
              cell.value = {
                text: cell.text,
                hyperlink: cell.text,
              }
            }
          })
          const doiUrlColumn = worksheet.getColumn(7)
          doiUrlColumn.eachCell((cell, rowNumber) => {
            if (rowNumber !== 1 && cell.text.length > 0) {
              cell.value = {
                text: cell.text,
                hyperlink: cell.text,
              }
            }
          })
        } else if (worksheetName === 'Dataset') {
          Object.keys(this.dataset).forEach((k) => {
            worksheet.addRow({
              property: k,
              value: this.dataset[k],
            })
          })
        }
        // format the header record
        worksheet.getRow(1).eachCell((cell, cullNumber) => {
          cell.font = {
            bold: true,
          }
        })
      })
      const fileName = `${this.dataIdentifiers.type}_${this.dataset.Dataset}_${this.getDate_YYYY_Mon_DD()}`
      await workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        saveAs(blob, `${fileName}.xlsx`)
      })
    },
  },
}
</script>
<style lang="scss">
@import "~/assets/styles/_custom-variables.scss";

button {
  border: 1px solid $grey-lighten-2;
  border-radius: 5px;
  text-decoration: none;
  background: white;
  font-size: 18px;
}
.tab-details {
  a.nav-link {
    color: black !important;
    &.disabled {
      color: #6c757d !important;
      background-color: transparent;
      border-color: transparent;
    }
  }
}

button:hover {
  background: $grey-lighten-3;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  padding-top: 7px;
}
</style>
