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
        { text: 'Annotations', slot: 'annotations-slot' },
        { text: 'Genes', slot: 'genes-slot', disabled: genesDisabled },
        { text: 'Citations', slot: 'citations-slot', disabled: citationsDisabled },
        { text: 'tcpl Processing', slot: 'processing-slot', disabled: tcplDisabled },
        { text: 'Reagents', slot: 'reagents-slot', disabled: reagentsDisabled },
        { text: 'AOPs', slot: 'aops-slot', disabled: aopsDisabled },
      ]"
      :transition-duration="0.1"
      transition-style="linear"
      data-cy="assayDetailTabs"
    >
      <template :slot="'annotations-slot'">
        <assay-annotations v-if="annotations" :annotations="annotations" data-cy="assayAnnotations" />
      </template>
      <template :slot="'genes-slot'">
        <assay-genes :genes="genes" data-cy="assayGenes" />
      </template>
      <template :slot="'citations-slot'">
        <assay-citations :citations="citations" data-cy="assayCitations" />
      </template>
      <template :slot="'processing-slot'">
        <assay-data-processing-methods
          :processings="tcplProcessing"
          data-cy="assayDataProcessingMethods"
        />
      </template>
      <template :slot="'reagents-slot'">
        <assay-reagents :reagents="reagents" data-cy="assayReagents" />
      </template>
      <template :slot="'aops-slot'">
        <assay-aops v-if="aops.length > 0" ref="aops" :aops="aops" data-cy="assayAops" />
        <span v-else>
          No AOPs for {{ annotations[' Assay Component Endpoint Name'] }}
        </span>
      </template>
    </mdb-tabs>
    <div v-else>
      loading...
    </div>
  </mdb-container>
</template>
<script>
import {saveAs} from 'file-saver';
import {
  mdbContainer, mdbTabs,
} from 'mdbvue';
import ExcelJS from 'exceljs';
import AssayAnnotations from '~/components/assays/AssayAnnotations.vue';
import AssayCitations from '~/components/assays/AssayCitations.vue';
import AssayGenes from '~/components/assays/AssayGenes';
import AssayDataProcessingMethods from '~/components/assays/AssayDataProcessingMethods.vue';
import AssayReagents from '~/components/assays/AssayReagents.vue';
import AssayAops from '~/components/assays/AssayAops.vue';

export default {
  name: 'AssayDetailTabs',
  components: {
    mdbContainer,
    mdbTabs,
    AssayAnnotations,
    AssayCitations,
    AssayDataProcessingMethods,
    AssayReagents,
    AssayGenes,
    AssayAops,
  },
  props: {
    endpointName: {default: '', type: String},
  },
  data() {
    return {
      tabs: {
        annotation: 'Annotations',
        genes: 'Genes',
        citations: 'Citations',
        tcplProcessing: 'tcpl Processing',
        reagents: 'Reagents',
        aops: 'AOPs',
      },
      loading: true,
      aops: [],
      genes: [],
      annotations: {},
      orderedCitations: null,
      citations: [],
      reagents: [],
      tcplProcessing: [],
      aopInfo: [],
      annotationsDisabled: false,
      citationsDisabled: false,
      reagentsDisabled: false,
      tcplDisabled: false,
      aopsDisabled: false,
      genesDisabled: false,
    };
  },
  beforeMount() {
    this.$repositories.assay.endpointDetailSearchByName(this.endpointName).then((endpointDetails) => {
      const [firstAnnotation] = endpointDetails.annotation;
      this.annotations = this.updateObjectKeys(firstAnnotation);
      this.genes = endpointDetails.gene ? endpointDetails.gene.map((g) => {
        const geneUrl = `https://www.ncbi.nlm.nih.gov/gene/${g.entrezGeneId}`;
        return {
          entrezGeneId: g.entrezGeneId, geneName: g.geneName, geneSymbol: g.geneSymbol, url: geneUrl,
        };
      }) : [];

      this.orderedCitations = endpointDetails.citations ? endpointDetails.citations.map((citation) => {
        const newObj = {
          pmid: citation.pmid,
          author: citation.author,
          title: citation.title,
          citation: citation.citation,
          doi: citation.doi,
        };
        return newObj;
      }) : [];
      this.citations = this.orderedCitations ? this.orderedCitations.map(o => this.updateObjectKeys(o)) : [];
      this.aops = endpointDetails.aops ? endpointDetails.aops.map(o => this.updateObjectKeys(o)) : [];
      this.reagents = endpointDetails.reagents ? endpointDetails.reagents.map(o => this.updateObjectKeys(o)) : [];
      this.tcplProcessing = endpointDetails.tcplProcessing ? endpointDetails.tcplProcessing.map(o => this.updateObjectKeys(o)) : [];
      this.citations.length === 0 ? this.citationsDisabled = true : this.citationsDisabled = false;
      this.genes.length === 0 ? this.genesDisabled = true : this.genesDisabled = false;
      this.tcplProcessing.length === 0 ? this.tcplDisabled = true : this.tcplDisabled = false;
      this.aops.length === 0 ? this.aopsDisabled = true : this.aopsDisabled = false;
      this.reagents.length === 0 ? this.reagentsDisabled = true : this.reagentsDisabled = false;
      this.loading = false;
    });
  },
  methods: {
    cleanUpKeyForDisplay(key) {
      const upCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
      return upCaseKey.replace(/(?=[A-Z])/g, ' ').trim();
    },
    updateObjectKeys(obj) {
      Object.keys(obj).forEach((key) => {
        const newkey = this.cleanUpKeyForDisplay(key);
        obj[newkey] = obj[key];
        delete obj[key];
      });
      return obj;
    },
    async download() {
      const workbook = new ExcelJS.Workbook();

      const worksheetConfigurations = {
        Annotations: [
          {header: 'PROPERTY', key: 'property'},
          {header: 'VALUE', key: 'value'},
        ],
        Genes: [
          {header: 'ENTREZ_GENE_ID', key: 'entrezGeneId'},
          {header: 'GENE_NAME', key: 'geneName'},
          {header: 'GENE_SYMBOL', key: 'geneSymbol'},
          {header: 'GENE_URL', key: 'url'},
        ],
        Citations: [
          {header: 'PMID', key: 'Pmid'},
          {header: 'AUTHOR', key: 'Author'},
          {header: 'TITLE', key: 'Title'},
          {header: 'CITATION', key: 'Citation'},
          {header: 'DOI', key: 'Doi'},
        ],
        tcpl: [
          {header: 'ASSAY_RUN_TYPE', key: 'Assay Run Type'},
          {header: 'LEVEL_APPLIED', key: 'Level Applied'},
          {header: 'METHOD_NAME', key: 'Method Name'},
          {header: 'DESCRIPTION', key: 'Description'},
        ],
        Reagents: [
          {header: 'REAGENT_TYPE', key: 'Reagent Type'},
          {header: 'REAGENT_VALUE', key: 'Reagent Value'},
          {header: 'CULTURE_OR_ASSAY', key: 'Culture Or Assay'},
        ],
        AOPs: [
          {header: 'AOP_ID', key: 'id'},
          {header: 'AOP_URL', key: 'url'},
          {header: 'AOP_TITLE', key: 'title'},
        ],
      };

      Object.keys(worksheetConfigurations).forEach((worksheetName) => {
        const worksheet = workbook.addWorksheet(worksheetName);

        // add header record
        worksheet.columns = worksheetConfigurations[worksheetName];

        // add data
        if (worksheetName === 'Annotations') {
          Object.keys(this.annotations).forEach((k) => {
            worksheet.addRow({
              property: k, value: this.annotations[k],
            });
          });
        } else if (worksheetName === 'Citations') {
          this.citations.forEach((citation) => {
            const c = {...citation};
            c.url = `http://www.ncbi.nlm.nih.gov/pubmed/${c.Pmid}`;
            c.doiUrl = (c.Doi) ? `https://doi.org/${c.Doi.substring(5)}` : null;
            worksheet.addRow(c);
          });

          const urlColumn = worksheet.getColumn(2);
          urlColumn.eachCell((cell, rowNumber) => {
            if (rowNumber !== 1) {
              cell.value = {
                text: cell.text,
                hyperlink: cell.text,
              };
            }
          });

          const doiUrlColumn = worksheet.getColumn(7);
          doiUrlColumn.eachCell((cell, rowNumber) => {
            if (rowNumber !== 1 && cell.text.length > 0) {
              cell.value = {
                text: cell.text,
                hyperlink: cell.text,
              };
            }
          });
        } else if (worksheetName === 'tcpl' && this.tcplProcessing.length > 0) {
          this.tcplProcessing.forEach(tcpl => worksheet.addRow(tcpl));
        } else if (worksheetName === 'Reagents' && this.reagents.length > 0) {
          this.reagents.forEach(reagent => worksheet.addRow(reagent));
        } else if (worksheetName === 'AOPs' && this.aops.length > 0) {
          this.$refs.aops.aopArray.forEach((aop) => {
            aop.url = `https://aopwiki.org/aops/${aop.id}`;
            worksheet.addRow(aop);
          });
          const urlColumn = worksheet.getColumn(2);
          urlColumn.eachCell((cell, rowNumber) => {
            if (rowNumber !== 1) {
              cell.value = {
                text: cell.text,
                hyperlink: cell.text,
              };
            }
          });
        } else if (worksheetName === 'Genes') {
          this.genes.forEach((gene) => {
            const g = {...gene};
            g.url = `https://www.ncbi.nlm.nih.gov/gene/${g.entrezGeneId}`;
            worksheet.addRow(g);
          });
          const urlColumn = worksheet.getColumn(4);
          urlColumn.eachCell((cell, rowNumber) => {
            if (rowNumber !== 1) {
              cell.value = {
                text: cell.text,
                hyperlink: cell.text,
              };
            }
          });
        }

        // format the header record
        worksheet.getRow(1).eachCell((cell, cullNumber) => {
          cell.font = {
            bold: true,
          };
        });
      });
      const fileName = `${this.annotations['Assay Component Endpoint Name']}_${this.getDate_YYYY_Mon_DD()}`;
      await workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(blob, `${fileName}.xlsx`);
      });
    },
  },
};
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
  padding-top:7px;
}
</style>
