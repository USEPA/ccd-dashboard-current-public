<template>
  <div class="toolbar">
    <mdb-row>
      <mdb-col col="12">
        <mdb-row class="d-flex align-items-center">
          <mdb-col col="12" md="6" xl="6" class="d-flex justify-content-start align-items-center my-1">
            <grid-select-basic
              v-if="toolbarConfig.select"
              :cname="cname"
              :select-options="selectOptions"
              :select-default="selectDefault"
              data-cy="tableSelect"
              @onSelect="emitSelect"
            />
            <grid-search-box
              v-if="toolbarConfig.search"
              :cname="cname"
              :qsearch="qsearch"
              :data-cy="`${cname.camelName}GridSearchBox`"
              @onFilter="emitInput"
            />
          </mdb-col>
          <mdb-col col="12" md="6" xl="6" class="d-flex justify-content-end my-1">
            <grid-two-radio-btn
              v-if="toolbarConfig.radio"
              ref="toolBarRadioButtons"
              data-cy="toolBarRadioButtons"
              :cname="cname.hyphenName"
              :config="radioConfig"
              @onChange="emitChoice"
            />
            <grid-export-dropdown
              v-if="toolbarConfig.export"
              class="toolbar-dropdown"
              :cname="cname"
              :data-cy="`${cname.camelName}GridExportDropdown`"
              @onExport="emitExport"
            />
          </mdb-col>
        </mdb-row>
      </mdb-col>
    </mdb-row>
  </div>
</template>

<script>
import {mdbRow, mdbCol} from 'mdbvue';
import GridExportDropdown from '~/components/toolbars/gridToolbar/GridExportDropdown.vue';
import GridSelectBasic from '~/components/toolbars/gridToolbar/GridSelectBasic.vue';
import GridSearchBox from '~/components/toolbars/gridToolbar/GridSearchBox.vue';
import GridTwoRadioBtn from '~/components/toolbars/gridToolbar/GridTwoRadioBtn.vue';

export default {
  name: 'ChemicalDetailTabGridToolbar',
  components: {
    mdbRow,
    mdbCol,
    GridSelectBasic,
    GridSearchBox,
    GridExportDropdown,
    GridTwoRadioBtn,
  },
  props: {
    cname: {
      type: Object,
      default: null,
    },
    toolbarConfig: {
      type: Object,
      default: () => {},
    },
    qsearch: {
      type: String,
      default: '',
    },
    pstore: {
      type: String,
      default: null,
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
    // eslint-disable-next-line vue/require-prop-types
    selectDefault: {
      default: null,
    },
    radioConfig: {
      type: Object,
      default: () => {},
    },
  },


  methods: {
    emitChoice(choice) {
      this.$emit('onChange', choice);
    },
    emitSelect(selectedCode, selectedText) {
      this.$emit('onSelect', selectedCode, selectedText);
    },
    emitInput(input) {
      this.$emit('onFilter', input);
    },
    emitExport(params) {
      this.$emit('onExport', params);
    },
  },
};
</script>

