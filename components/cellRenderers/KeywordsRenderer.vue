<template>
  <div>
    <span v-for="(w, i) in keywordsList" :key="w">
      <span v-if="i != 0 && i < keywordsList.length - 1">&nbsp;</span>
      <a :title="getTitle(w)" @click="onClick(w)">{{ w }}</a>
      <span v-if="i < keywordsList.length - 1">,</span>
    </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'RangeFormat',
  computed: {
    keywordsList() {
      return this.params.data.keywords.map(kw => kw.keyword)
    },
  },
  methods: {
    onClick(keyword) {
      this.params.goToCategorySearch(keyword)
    },
    getTitle(keyword) {
      return this.params.data.keywords.find(k => k.keyword === keyword).description
    },
  },
}
</script>
