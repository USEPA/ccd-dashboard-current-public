<template>
  <b-card
    v-b-tooltip.hover
    :img-src="_getImageUrl(item)"
    :title="item.error || item.name || item.casrn || item.sid"
    class="text-center card-with-check"
    img-top
    no-body
  >
    <div
      v-if="onZoomClick"
      class="left-btn"
      @click="_onZoomClick(item)"
    >
      <b-button
        size="sm"
        variant="link"
      >
        <font-awesome-icon icon="search" />
      </b-button>
    </div>

    <div
      v-if="onCheckClick"
      class="card-item-checkbox"
    >
      <label>
        <input
          :checked="item.checked"
          type="checkbox"
          @input="_onCheckClick(item)"
        >
      </label>
    </div>

    <div
      v-b-tooltip.hover
      :title="item.name"
      class="m-1 text-truncate"
    >
      {{ item.name }}
    </div>

    <div
      v-b-tooltip.hover
      :title="item.casrn"
      class="m-1 text-truncate"
    >
      {{ item.casrn }}
    </div>

    <div
      v-b-tooltip.hover
      :title="item.error"
      class="m-1 text-truncate"
    >
      {{ item.error }}
    </div>

    <div
      v-if="item.similarity"
      class="m-1 block-badge"
    >
      {{ roundup(Number.parseFloat(item.similarity), 2) }}
    </div>
  </b-card>
</template>
<script>
/* eslint-disable vue/require-valid-default-prop */
/* eslint-disable-next-line import/extensions */
import {getStructureImageUrl} from '~/static/links.js'

export default {
  props: {
    getImageUrl: {
      type: Function,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    onZoomClick: {
      type: Function,
      default: () => {},
    },
    onCheckClick: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    _getImageUrl(item) {
      if (this.getImageUrl && typeof (this.getImageUrl) === 'function') { return this.getImageUrl(item) }
      return getStructureImageUrl(item)
    },

    _onZoomClick(item) {
      if (this.onZoomClick && typeof (this.onZoomClick) === 'function') { this.onZoomClick(item) }
    },

    _onCheckClick(item) {
      if (this.onCheckClick && typeof (this.onCheckClick) === 'function') { this.onCheckClick(item) }
    },

    roundup(value, digits) {
      // eslint-disable-next-line no-restricted-properties
      const round = Math.round(Math.pow(10, digits))
      return Math.round((value + Number.EPSILON) * round) / round
    },

    getStructureImageUrl(structure, width, height) {
      return getStructureImageUrl(structure, width, height)
    },
  },
}
</script>

<style lang="scss">

.card-with-check {
    position: relative;
    width: 150px;

    &:hover .left-btn {
        opacity: 1;
    }

    .left-btn {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
        text-align: left;
    }

    .card-item-checkbox {
        position: absolute;
        right: 0;
        top: 0;
        padding: 4px;
    }

    .block-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 2px;
        background: rgba(#efefef, 0.5);
    }
}

</style>
