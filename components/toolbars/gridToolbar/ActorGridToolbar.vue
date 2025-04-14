<template>
  <div class="toolbar">
    <mdb-row>
      <mdb-col col="12">
        <mdb-row class="d-flex align-items-center">
          <mdb-col col="6" class="d-flex justify-content-start align-items-center my-1">
            <actor-category-select
              v-if="toolbarConfig.select"
              :cname="cname"
              :data-cy="`${cname.camelName}CategorySelect`"
              :select-options="selectOptions"
              :select-default="selectDefault"
              @change="emitSelect"
            />
          </mdb-col>
          <mdb-col col="6" class="d-flex justify-content-end my-1">
            <grid-two-radio-btn
              v-if="toolbarConfig.radio"
              :data-cy="`${cname.camelName}RadioBtn`"
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
import {mdbRow, mdbCol} from 'mdbvue'
import GridExportDropdown from '~/components/toolbars/gridToolbar/GridExportDropdown.vue'
import ActorCategorySelect from '~/components/toolbars/gridToolbar/ActorCategorySelect.vue'
import GridTwoRadioBtn from '~/components/toolbars/gridToolbar/GridTwoRadioBtn.vue'

export default {
  name: 'ActorGridToolbar',
  components: {
    mdbRow,
    mdbCol,
    ActorCategorySelect,
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
      this.$emit('onChange', choice)
    },
    emitSelect(selectedCode, selectedText) {
      console.log('emit select:', selectedCode, selectedText)
      this.$emit('onSelect', selectedCode, selectedText)
    },
    emitExport(params) {
      this.$emit('onExport', params)
    },
  },
}
</script>

