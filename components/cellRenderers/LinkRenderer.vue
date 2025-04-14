<template>
  <a
    v-if="showLink"
    :title="title"
    target="_blank"
    rel="noopener noreferrer"
    style="text-decoration: underline; text-decoration-style: dashed;"
    :href="link"
  >
    {{ displayText }}
    <i class="fa fa-external-link" aria-hidden="true" style="color: black;" />
  </a>
  <div v-else>
    {{ displayText }}
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    showLink() {
      return this.link && this.link !== '-';
    },
    link() {
      return this.params?.url;
    },
    displayText() {
      return this.params?.text;
    },
    title() {
      return `Link to the source url (${this.link}). Note: The urls provided may no longer be maintained.`;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
