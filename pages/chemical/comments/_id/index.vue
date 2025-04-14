<template>
  <div class="container-fluid left-fullwidth-container content pt-3">
    <ccte-help-text
      data-cy="comments"
      label-type="h2"
      :heading-text="`Comments`"
      help-key="Comments"
    />
    <div v-if="comments.length >0">
      <div
        v-for="(comment, index) in comments"

        :key="index"
        class="row mt-2"
      >
        <div class="col">
          <show-comment
            :key="index"
            :comment="comment"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <strong>
        There have been no responses to comments regarding {{ chemical.preferredName }}
      </strong>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {
  mapState,
} from 'vuex';
import ShowComment from '~/components/chemical/Comment.vue';

export default {
  async validate(data) {
    if (data.params.id.includes('DTXSID') || data.params.id.includes('DTXCID')) {
      const currentChem = data.app.store.state.results.activeChemical;
      if (currentChem.dtxsid === data.params.id || currentChem.dtxcid === data.params.id) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        const chem = await data.app.store.dispatch('results/asyncActiveChemical', data, data);
        if (!Array.isArray(chem)) {
          return true;
        }
        return false;
      }
    }
    return false;
  },
  layout: 'chemicaldetails',
  name: 'ChemicalComments',
  components: {
    ShowComment,
  },
  data() {
    return {
      cname: {
        camelName: 'commentsLists',
        hyphenName: 'comments-lists',
        baseName: 'Comments Lists',
      },
    };
  },
  computed: {
    ...mapState({
      chemical: state => state.results.activeChemical,
    }),
  },
  async asyncData(context) {
  //  console.log(context.app.$repositories)
    try {
      const commentData = await context.app.$repositories.comments.index(`/search/by-dtxsid?id=${context.params.id}`);
      const comments = commentData;
      return {comments};
    } catch (err) {
      console.error(`ERROR ${err}`);
      return {comments: []};
    }
  },
  head() {
    return {
      title: `${process.env.APPLICATION_TITLE} ${this.chemical.preferredName} - Comments`,
      meta: [
        {
          hid: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} ${this.chemical.preferredName} - Chemical Comments`,
          name: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE}${this.chemical.preferredName} - Chemical Comments`,
          content: `United States Environmental Protection Agency ${process.env.APPLICATION_TITLE} ${this.chemical.preferredName} - Chemical Comments`,
        },
      ],
    };
  },
};
</script>
