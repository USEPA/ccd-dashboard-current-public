<template>
  <mdb-container style="max-width: 98% !important;" fluid>
    <div v-if="noLists" class="row">
      <div class="col-12 pt-2 pb-1 ml-0 pl-2">
        <span>No information available</span>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-12 pt-2 pb-1">
        <mdb-card v-for="type in listTypes" :key="type.id" style="width: 100%;">
          <mdb-tooltip :key="type.label" trigger="hover" :append-to-body="true" :options="{placement: 'top'}">
            <span v-if="type.shortDescription" slot="tip" v-html="type.shortDescription" />
            <span v-else slot="tip" v-html="'N/A'" />
            <mdb-card-header slot="reference" class="blue lighten-5">
              {{ type.label }}
            </mdb-card-header>
          </mdb-tooltip>
          <mdb-card-body>
            <div v-if="type.lists.length === 0">
              None.
            </div>
            <span v-else class="list">
              <span v-if="!type.lists[0].label">
                None
              </span>
              <mdb-tooltip
                v-for="list in type.lists"
                v-else
                :key="list.id"
                trigger="hover"
                :append-to-body="true"
                :options="{placement: 'top'}"
              >
                <span v-if="list.shortDescription" slot="tip" v-html="list.shortDescription" />
                <span v-else slot="tip" v-html="'N/A'" />
                <mdb-badge
                  slot="reference"
                  tag="a"
                  color="primary"
                  :target="'_blank'"
                  :class="type.name"
                  @click.native="$router.push({path: `/chemical-lists/${list.name}`})"
                >{{ list.label }}</mdb-badge>
              </mdb-tooltip>
            </span>
          </mdb-card-body>
        </mdb-card>
      </div>
    </div>
  </mdb-container>
</template>

<script>
import {
  mdbContainer, mdbCard, mdbCardBody, mdbCardHeader, mdbBadge, mdbTooltip,
} from 'mdbvue';

export default {
  name: 'ListPresence',
  components: {
    mdbContainer,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbBadge,
    mdbTooltip,
  },
  props: {
    listTypes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    noLists() {
      return !this.listTypes || !this.listTypes.length;
    },
  },
  mounted() {
  },
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/config-variables.scss";
@import "~/assets/styles/imported-variables.scss";
@import "~/assets/styles/_custom-variables.scss";
md-accordion {
   margin-top: .1rem;
   height:max-content !important;
   width: 98% !important;
    .card {
      margin-top: 0px;
      margin-bottom: 5px !important;
        .card-header {
          border-radius: calc(.25rem - 1px) calc(.25rem - 1px) 0 0;
          background-color: #e2edf2 !important;
          padding: .5rem 1.5rem !important;
          margin-top: 0px !important;
          margin-bottom: 0px !important;
          h5 {
            background-color: #e2edf2 !important;
            color: white !important;
            font-size: 1rem;
            font-weight: 400;
          }
        }
       .collapse-item.card-body {
         margin-bottom: .2rem;
         padding: .3rem !important;
         height: max-content !important;
         overflow-y: visible !important;
         .row {
            height: 40px !important;
          }
         .ml-3 {
          margin-bottom: .2rem !important;
          height: fit-content;
        }
        .wiki {
         min-height: 5rem;
         height: max-content !important;
         overflow-y: visible !important;
         overflow: visible !important;
        }
      }
    }
  .collapse-item {
   overflow: visible !important;
  }
 }
.md-accordion .card .card-header {
  background-color: #e2edf2 !important;
}

.is-dashed {
  border-color: white;
}

.buttons span {
  margin-bottom: .5rem;
}

.list span:not(:last-child) {
  margin-right: .5rem;

}

.federal {
  border-color: #F8D292 !important;
  background-color: #F8D292 !important;
  color: slategrey !important;
  padding: .5rem !important;
  margin-bottom: .5rem !important;
}

.state {
  border-color: #D0E3A4 !important;
  background-color: #D0E3A4 !important;
  color: slategrey !important;
  padding: .5rem !important;
  margin-bottom: .5rem !important;
}

.international {
  border-color: #9CDBFF !important;
  background-color: #9CDBFF !important;
  color: slategrey !important;
  padding: .5rem !important;
  margin-bottom: .5rem !important;
}

.other {
  border-color: #F6B3D9 !important;
  background-color: #F6B3D9 !important;
  color: slategrey !important;
  padding: .5rem !important;
  margin-bottom: .5rem !important;
}
</style>
