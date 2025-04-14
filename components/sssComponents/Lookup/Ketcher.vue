<template>
  <div>
    <lookup-bar
      :disabled="disabled"
      @searchcompleted="applyLookupResult"
      @chemResult="setRecord"
    />
    <div v-if="disabled" class="disabled" />
    <iframe
      id="ketcher-frame"
      ref="ketcherFrame"
      class="ketcher-frame"
      :src="ketcherSrc"
      @load="loadFrame"
    />

    <div class="container info">
      <div class="row no-gutter">
        <div class="col-7 pr-0 chemical-text">
          {{ record ? record.preferredName : "" }}
        </div>
        <div class="col-2 chemical-text">
          {{ record ? record.casrn : "" }}
        </div>
        <div class="col-3 pl-0 text-right chemical-text">
          <b-link
            v-if="record && record.dtxsid"
            :href="`${lookupLink()}${record.dtxsid}`"
            target="_blank"
          >
            {{ record.dtxsid }}
          </b-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LookupBar from '~/components/sssComponents/Lookup/LookupBar.vue';

export default {
  name: 'Ketcher',
  components: {
    'lookup-bar': LookupBar,
  },
  props: {
    molecule: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ketcherInstance: null,
      record: null,
      searchSelected: null,
      smile: '',
      ketcherSrc: `${process.env.APPLICATION_ROUTER_BASE}ketcher-2-3/index.html`,
    };
  },
  mounted() {
    const watchKetcher = setInterval(() => {
      this.trackClick();
    }, 1000);
  },

  methods: {
    loadFrame() {
      if (this.$refs.ketcherFrame) {
        const ketcherIntervalId = setInterval(() => {
          const {ketcher} = this.$refs.ketcherFrame.contentWindow;
          if (ketcher) {
            clearInterval(ketcherIntervalId);
            this.ketcherInstance = ketcher;
            this.$emit('ketcherLoaded', ketcher);
          }
        }, 500);
      }
    },
    async trackClick() {
      if (document.activeElement === document.querySelector('#ketcher-frame')) {
        await this.onStructureChanged();
        document.querySelector('#__nuxt').focus();
      }
    },
    async onStructureChanged() {
      const self = this;
      if (self.ketcherInstance) {
        let smiles = await self.ketcherInstance.getSmilesAsync();
        if (this.smiles !== smiles && smiles.length > 0) {
          this.$emit('structureChanged', smiles);
          this.smiles = smiles;
          const smilesEncoded = encodeURIComponent(smiles);
          this.$axios
            .get(`${process.env.APPLICATION_BASE_API}similar-compound/structure/?smiles=${smilesEncoded}`)
            .then((response) => {
              // eslint-disable-next-line prefer-destructuring
              response && response.data && response.data[0] && response.data.length > 0 ?
                (this.record = response.data[0]) :
                (this.record = null);
            })
            .catch((error) => {
              console.error(JSON.stringify(error));
              this.record = null;
            });
        }
        if (smiles.length === 0) {
          this.record = null;
        }
      }
    },
    setRecord(results) {
      this.searchSelected = results;
      this.smile = results.smile;
      this.record = results;
    },

    lookupLink() {
      const link = `${process.env.APPLICATION_EXTERNAL_LINK_URL}${process.env.APPLICATION_ROUTER_BASE}chemical/details/`;
      return link;
    },

    applyLookupResult(searchData) {
      if (searchData.length > 0) {
        this.ketcherInstance.setMolecule(searchData);
        let iframe = document.getElementById('ketcher-frame');
        iframe.focus();
      }
    },

    getMol() {
      return this.ketcherInstance.getMolfile();
    },

    getSmiles() {
      return this.ketcherInstance.getSmilesAsync();
    },

    setMolecule(mol) {
      this.ketcherInstance.setMolecule(mol);
    },
  },
  unmounted() {
    clearInterval(watchKetcher);
  },
};
</script>
<style scoped lang="scss">
iframe {
  width: 100%;
  min-height: 665px;
}
.info {
  max-width: 100% !important;
  box-shadow: 0px 3px 1px -2px rgb(144, 144, 144), 0px 2px 2px 0px rgb(144, 144, 144),
    0px 1px 5px 0px rgb(144, 144, 144);
}

.chemical-text {
  font-size: 16px;
  font-weight: 400;
  height: 40px !important;
  line-height: 40px;
}

.disabled {
  display: block;
  background: black;
  opacity: 0.1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
