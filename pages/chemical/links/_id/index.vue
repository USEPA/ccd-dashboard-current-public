<template>
  <div class="mr-4" style="margin-top: 10px">
    <div v-if="errorMessage" data-cy="error-alert" class="alert mr-1 alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div v-else class="row">
      <ul id="General">
        <h2>General</h2>
        <li v-for="item in linkList.General" :key="item.name">
          <a v-if="item.visible === true" :href="cleanLink(item.url, item.name)" target="_blank">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </a>
          <span v-else class="no_url mb-0">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </span>
        </li>
      </ul>
      <ul id="Toxicology">
        <h2>Toxicology</h2>
        <li v-for="item in linkList.Toxicology" :key="item.name">
          <div v-if="item.name.indexOf('ACToR') === -1">
            <a v-if="item.visible === true" :href="cleanLink(item.url,item.name)" target="_blank">
              <span>
                <img :src="item.iconUrl" alt="">
              </span>
              <mdb-popover
                :append-to-body="true"
                size="sm"
                trigger="hover"
                :options="{ placement: 'top' }"
              >
                <span slot="body" v-html="item.description" />
                <span
                  slot="reference"
                  class="align-content-start popoverLabel"
                  v-html="item.name"
                />
              </mdb-popover>
            </a>
            <span v-else class="no_url mb-0">
              <span>
                <img :src="item.iconUrl" alt="">
              </span>
              <mdb-popover
                :append-to-body="true"
                size="sm"
                trigger="hover"
                :options="{ placement: 'top' }"
              >
                <span slot="body" v-html="item.description" />
                <span
                  slot="reference"
                  class="align-content-start popoverLabel"
                  v-html="item.name"
                />
              </mdb-popover>
            </span>
          </div>
        </li>
      </ul>
      <ul id="Publications">
        <h2>Publications</h2>
        <li v-for="item in linkList.Publications" :key="item.name">
          <a v-if="item.visible === true" :href="cleanLink(item.url, item.name)" target="_blank">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </a>
          <span v-else class="no_url mb-0">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </span>
        </li>
      </ul>
      <ul id="Analytics">
        <h2>Analytical</h2>
        <li v-for="item in linkList.Analytical" :key="item.name">
          <a v-if="item.visible === true" :href="cleanLink(item.url, item.name)" target="_blank">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </a>
          <span v-else class="no_url mb-0">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </span>
        </li>
      </ul>
      <ul id="Prediction">
        <h2>Prediction</h2>
        <li v-for="item in linkList.Prediction" :key="item.name">
          <a v-if="item.visible === true" :href="cleanLink(item.url, item.name)" target="_blank">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </a>
          <span v-else class="no_url mb-0">
            <span>
              <img :src="item.iconUrl" alt="">
            </span>
            <mdb-popover
              :append-to-body="true"
              size="sm"
              trigger="hover"
              :options="{ placement: 'top' }"
            >
              <span slot="body" v-html="item.description" />
              <span
                slot="reference"
                class="align-content-start popoverLabel"
                v-html="item.name"
              />
            </mdb-popover>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import {mdbPopover} from 'mdbvue';

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (
        currentChem.dtxsid === data.params.id ||
        currentChem.dtxcid === data.params.id
      ) {
        return true;
        // eslint-disable-next-line no-else-return
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical',
          data,
          data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'SelectedChemicalLinksView',
  components: {
    mdbPopover,
  },
  data() {
    return {
      active: 'links',
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
      linkList: state => state.links.Links,
    }),
  },
  async asyncData(context) {
    let errorMessage = null;
    try {
      const linksData = await context.app.$repositories.links.show(context.params.id);
      context.app.store.dispatch('links/loadLinks', linksData);
    } catch (err) {
      context.$sentry.captureMessage(`Error calling links API in chemical links page for. ${context.params.id} :  ${err}`);
    }
    return {errorMessage: errorMessage};
  },
  methods: {
    cleanLink(url, linkName) {
      if (linkName === 'CalEPA OEHHA') {
        const endPoint = url.lastIndexOf('/');
        const baseUrl = url.slice(0, endPoint);
        const chemIdentifier = url.slice(endPoint, url.length);
        return `${baseUrl}${chemIdentifier.replaceAll(' ', '-').replaceAll(',', '').replaceAll(')', '').replaceAll('(', '')
          .replaceAll(']', '')
          .replaceAll('[', '')
          .replaceAll('.', '')
          .replaceAll(':', '')
          .replaceAll('\'', '')
          .replaceAll('&', '')}`;
      }
      return url;
    },
  },
  head() {
    return {
      title: `${this.chemical.preferredName} - Links`,
      meta: [],
    };
  },
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";

h2 {
  font-weight: bold;
}
li {
  list-style-type: none;
}
a {
  font-size: 0.7rem;
}
.no_url {
  font-size: 0.7rem;
  display: none;
}
img {
  width: 1.1rem;
}
</style>
