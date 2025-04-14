<template>
  <div class="propFamily">
    <div class="custom-control custom-checkbox" data-cy="checkboxInput">
      <input
        :id="name"
        v-model="familySelect"
        checked="true"
        type="checkbox"
        class="custom-control-input"
      >
      <label :for="name" class="custom-control-label" data-cy="propertyHeaderLabel">
        {{ name === "Toxicological_properties" ? "Toxicological properties" : "Physical properties" }}
      </label>
    </div>
    <ul>
      <li v-for="prop in family" :key="prop.name">
        <div class="custom-control custom-checkbox">
          <input
            :id="prop.code"
            v-model="prop.selected"
            class="custom-control-input"
            :class="name"
            type="checkbox"
            data-cy="checkboxInput"
            @change="checkBox"
          >
          <label class="custom-control-label" :for="prop.code" :title="prop.description" data-cy="propertyLabel">
            {{ prop.name }}
          </label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  mapMutations, mapGetters,
} from 'vuex';

export default {
  name: 'Properties',
  props: {
    family: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    familySelect: {
      get() {
        return this.family.filter(p => p.selected).length > 0;
      },
      set(val) {
        const filters = [];
        this.family.forEach((p) => {
          if (!val) {
            this.addFilter(p.code);
          } else {
            this.removeFilter(p.code);
          }
          p.selected = val;
          if (p.selected) { filters.push(p); }
        });
      },
    },
  },
  methods: {
    ...mapMutations({
      setProperties: 'predictions/setProperties',
      setProviders: 'predictions/setProviders',
      addFilter: 'predictions/addFilter',
      removeFilter: 'predictions/removeFilter',
    }),
    ...mapGetters({getProperties: 'predictions/getProperties'}),
    checkBox(el) {
      if (!el.target.checked) {
        this.addFilter(el.target.id);
      } else {
        this.removeFilter(el.target.id);
      }
    },
  },

};
</script>

<style scoped lang="scss">
.propFamily {
  padding: 0.5rem;
  text-align: left;
  ul {
    padding-left: 1.5em;
    list-style: none;
  }
}
.custom-control-input {
  z-index: 100 !important;
}
label.property {
  font-weight: normal;
  white-space: nowrap;
}
</style>
