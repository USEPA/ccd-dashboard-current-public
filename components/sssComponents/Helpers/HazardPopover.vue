<template>
  <b-popover
    :delay="delay"
    :target="target"
    :triggers="triggers"
    custom-class="hazard-popover"
  >
    <template v-slot:title>
      {{ (chemical.name || chemical.casrn) + (score && score.hazardName ? ' | ' + score.hazardName : '') }}
    </template>
    <b-table-lite
      :fields="scoreRecordFields"
      :items="items"
      :stacked="hazardCategory && firstOnly"
      borderless
      small
    >
      <template #[`cell(${scoreField})`]="data">
        <span
          :class="{
            'table-secondary': data.value === 'I',
            'table-warning': data.value === 'M',
            'table-success': data.value === 'L',
            'table-danger': data.value === 'VH',
            'table-orange': data.value === 'H',
            'authoritative': (data.item.authority || data.item.finalAuthority) === 'Authoritative',
            'screening': (data.item.authority || data.item.finalAuthority) === 'Screening',
            'predicted': (data.item.authority || data.item.finalAuthority) === 'QSAR Model',
          }"
          class="px-2"
        >{{ data.value }}</span>
      </template>
      <template #cell()="data">
        <div class="text-left">
          {{ data.value }}
        </div>
      </template>
      <template #cell(note)="data">
        <span {{ data.value }} />
      </template>
      <template #cell(rationale)="data">
        <span {{ data.value }} />
      </template>
    </b-table-lite>
  </b-popover>
</template>
<script>
export default {
  props: {
    target: {
      type: String,
      required: true,
    },
    triggers: {
      type: String,
      default: 'hover',
    },
    delay: {
      type: Number,
      default: 500,
    },
    firstOnly: {
      type: Boolean,
      default: true,
    },
    hazardChemical: {
      type: [Object, Promise],
      required: true,
    },
    hazardCategory: {
      type: String,
      default: null,
    },
    scoreRecordFields: {
      type: Array,
      default() {
        if (!this.hazardCategory) {
          return [
            'hazardName',
            'finalScore',
            'finalScoreSource',
          ]
        }
        if (this.firstOnly) {
          return [
            {key: 'source', sortable: true},
            {key: 'authority', sortable: true},
            {key: 'score', sortable: true},
            {key: 'route', sortable: true},
            {key: 'category', sortable: true},
            {key: 'hazardCode', sortable: true},
            {key: 'hazardStatement'},
            {key: 'rationale'},
            {key: 'note'},
          ]
        }
        return [
          {key: 'source', sortable: true},
          {key: 'authority', sortable: true},
          {key: 'score', sortable: true},
        ]
      },
    },
  },

  data() {
    return {
      chemical: {
        name: null,
        casrn: null,
      },
      score: {
        hazardName: null,
        records: [],
      },
      scores: null,
    }
  },

  computed: {
    items() {
      if (this.hazardCategory) { return this.firstOnly ? this.score.records.slice(0, 1) : this.score.records }
      return this.scores
    },
    scoreField() {
      return this.hazardCategory ? 'score' : 'finalScore'
    },
  },

  created() {
    Promise.resolve(this.hazardChemical)
      .then((hc) => {
        this.chemical = hc.chemical
        if (this.hazardCategory) { this.score = hc.scores.find(s => s.hazardId === this.hazardCategory) } else { this.scores = hc.scores }
      })
  },

  methods: {},
}
</script>

<style lang="scss">
.hazard-popover {
    max-width: 800px !important;
    min-width: 600px;
    width: max-content !important;
}
</style>
