<template>
  <div v-if=" params.columnType === 'link'">
    <a
      v-if="link"
      :href="link"
      :title="link"
    >
      {{ display }}
    </a>
    <span v-else>
      No DTXSID associated with this comment.
    </span>
  </div>
  <div v-else>
    <div v-if="image && !imageLoadError" style="height:98px">
      <img height="97px" :src="image" @error="handleImageError">
    </div>
    <div v-if="image && imageLoadError" class="related-cell">
      No chemical image associated with this comment.
    </div>
    <div v-if="!image" class="related-cell">
      No chemical image associated with this comment.
    </div>
  </div>
</template>

<script>

export default {
  name: 'CommentDtxsidLink',
  components: {
  },
  data() {
    return {
      imageLoadError: false,
    };
  },

  computed: {
    display() {
      if (this.params.data.dtxsid && typeof this.params.data.dtxsid !== 'undefined') { return `${this.params.data.dtxsid}`; }
      return `${this.params.data.dtxsid}`;
    },
    image() {
      if (this.params.data.dtxsid) {
        return `${process.env.APPLICATION_BASE_API}${this.apiSettings().CHEMICAL_IMAGE_API}by-dtxsid/${this.params.data.dtxsid}`;
      }
      if ((!this.params.data.dtxsid || typeof this.params.data.dtxsid == 'undefined')) {
        return false;
      }
      return `${this.params.data.dtxsid}`;
    },
    link() {
      if (!this.params.data.dtxsid) { return false; }
      if (this.params.data.dtxsid) {
        return `/dashboard/chemical/details/${this.params.data.dtxsid}`;
      }
      return false;
    },
  },
  methods: {
    handleImageError() {
      this.imageLoadError = true;
    },
  },
};
</script>
