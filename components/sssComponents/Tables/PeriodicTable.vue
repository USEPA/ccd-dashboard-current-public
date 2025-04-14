<template>
  <b-modal
    :id="modalId"
    size="lg"
    @ok="handleOk"
  >
    <table class="mb-2">
      <tr
        v-for="(row, row_index) in periodicTable.getRows()"
        :key="`r-${row_index}`"
      >
        <td
          v-for="(element, element_index) in row"
          :key="`e-${row_index}-${element_index}`"
          :class="[element.color, element.disabled ? 'disabled': '']"
        >
          <label
            v-if="element.name !==''"
            @click="onElementClick(element)"
          >
            <img
              v-if="element.checked"
              src="~/assets/img/ic_check_box_black_24px.svg"
            >
            <img
              v-else
              src="~/assets/img/ic_check_box_outline_blank_black_24px.svg"
            >
            {{ element.name }}
          </label>
          {{ element.text }}
        </td>
      </tr>
    </table>
    <p><b>Selected elements</b></p>
    {{ periodicTable.exportSelectedElementsToString() }}
  </b-modal>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import PeriodicTable from '~/assets/scripts/periodictable'

const eventBus = new Vue()

export default {
  props: {
    modalId: {
      type: String,
      default: null,
    },
    emitEvent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      periodicTable: new PeriodicTable(),
      inputElements: '',
      disabledElements: '',
    }
  },

  created() {
    eventBus.$on('EVENT_PERIODIC_ELEMENTS', (data) => {
      this.inputElements = data.included
      this.disabledElements = data.excluded

      this.periodicTable.clearTable()

      if (this.inputElements && this.inputElements.length > 0) {
        this.periodicTable.importElementsFromString(this.inputElements)
      }

      if (this.disabledElements && this.disabledElements.length > 0) {
        this.periodicTable.importDisabledElementsFromString(this.disabledElements)
      }
    })
  },

  methods: {
    onElementClick(tableElement) {
      if (!tableElement.disabled) {
        tableElement.checked = !tableElement.checked
      }
    },

    handleOk() {
      this.$emit(this.emitEvent, {
        elements: this.periodicTable.exportSelectedElementsToString(),
      })
    },
  },
}
</script>


<style lang="scss">
td {
    text-align: center;
    width: 50px;

    input {
        display: block;
        margin: 0 auto;
    }

    label {
        display: block;
        padding: 5px;
        font-weight: bold;
        margin-bottom: 0;
        cursor: pointer;
    }
}

.lightGray, .yellow, .pink, .blue, .lightBlue, .green, .lightGreen, .blueGray, .gray, .orange {
    border: 1px solid #cccccc;

    &.disabled label {
        opacity: .25;
        cursor: no-drop;
    }
}

.lightGray {
    background-color: #A3C7D2;
}

.yellow {
    background-color: #EADA24;
}

.pink {
    background-color: #FBC9E5;
}

.blue {
    background-color: #5BC2E7;
}

.lightBlue {
    background-color: #BFEAEC;
}

.green {
    background-color: #A2D34D;
}

.lightGreen {
    background-color: #CEDC00;
}

.blueGray {
    background-color: #A3C7D2;
}

.gray {
    background-color: #B5B9BA;
}

.orange {
    background-color: #EAB37F;
}
</style>
