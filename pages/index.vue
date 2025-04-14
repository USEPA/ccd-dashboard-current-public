<template>
  <div class="center-container content">
    <mdb-card class="card-image jtBackgroundImage mt-3">
      <div class="text-white jtTextOver text-center rgba-stylish-strong py-5 px-4">
        <div class="py-4">
          <h1 class="h1 white-text">
            {{ applicationTitle }}
          </h1>
          <h2 class="mb-4 pb-2 px-md-5 mx-md-5 white-text">
            Search {{ chemicalCount }} Chemicals
          </h2>
          <search-tabs data-cy="search-tabs" />
        </div>
      </div>
    </mdb-card>
    <client-only>
      <h2 data-cy="news-header" class="mt-5">
        <a href="https://www.epa.gov/chemical-research/comptox-chemicals-dashboard-latest-news" class="pure-link" rel="noopener noreferrer" title="Open new window to see the latest Comptox Dashboad news" target="_blank">
          Latest News
        </a>
      </h2>
      <h3 data-cy="more-news-link" class="mt-0">
        The CompTox Chemicals Dashboard is periodically updated. Please see the <a href="https://www.epa.gov/chemical-research/comptox-chemicals-dashboard-release-notes" class="pure-link" title="Open new window to see the latest Comptox Dashboad release notes" target="_blank">
          latest release notes </a> for current version information and any <a href="https://www.epa.gov/comptox-tools/comptox-chemicals-dashboard-release-notes#Known%20Issues " class="pure-link" title="Open new window to see known issues" target="_blank">known issues</a>.
      </h3>
    </client-only>
  </div>
</template>

<script>
import {
  mdbCard,
} from 'mdbvue';

import SearchTabs from '~/components/homepageSearch/SearchTabs.vue';

export default {
  name: 'ComptoxHome',
  layout: 'homepage',
  components: {
    mdbCard,
    SearchTabs,
  },
  data() {
    return {
      applicationTitle: process.env.APPLICATION_TITLE,
    };
  },
  head() {
    return {
      title: process.env.APPLICATION_TITLE,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${process.env.APPLICATION_TITLE} Explore ${this.chemicalCount} Chemicals`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      const response = await context.app.$repositories.totalChemicalCount.count();
      return {chemicalCount: response.toLocaleString('en')};
    } catch (e) {
      console.error({e});
      return false;
    }
  },
};
</script>

