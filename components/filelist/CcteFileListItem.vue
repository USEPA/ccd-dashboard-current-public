<template>
  <div class="downloadItem">
    <mdb-row>
      <mdb-col col="10" class="px-0">
        <h5 class="font-weight-bolder">
          {{ item.title }}
        </h5>
        <div class="font-italic">
          Last Updated: <span class="ml-2" v-text="$moment(item.lastModifiedDate).format('LL')" />
        </div>
      </mdb-col>
      <mdb-col col="2" class="d-flex justify-content-end">
        <mdb-btn
          tag="a"
          :href="item.url"
          class="text-white d-flex justify-content-center align-items-center download-btn"
          data-cy="DownloadBtn"
          size="sm"
          @click.native.prevent="gaDownloadFile(item)"
        >
          <mdb-icon icon="download" class="px-1" />
          Download
        </mdb-btn>
      </mdb-col>
    </mdb-row>
    <mdb-row>
      <mdb-col col="12" class="px-0" v-html="item.longDescription" />
    </mdb-row>
  </div>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbIcon,
} from 'mdbvue';

export default {
  name: 'FileListItem',
  components: {
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbIcon,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          name: '',
          label: '',
          title: '',
          url: '',
          shortDscription: '',
          longDescription: '',
          tags: [],
          createdDate: '',
          lastModifiedDate: '',
        };
      },
    },
  },
  data() {
    return {
      error: null,
    };
  },
  methods: {
    gaDownloadFile(file) {
      this.$ga.event({
        eventCategory: 'downloads',
        eventAction: 'download',
        eventLabel: file.url,
      });
      window.open(`${file.url}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
.download-btn {
   background-color: $blue-accent-4 !important;
 }
@media (max-width: 991.98px) {

}
</style>
