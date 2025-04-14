<template>
  <div
    :id="chemical.gsid"
    class="operaTile"
    data-cy="OperaTile"
  >
    <div class="neighbor-order">
      {{ chemical.neighborNumber }}
    </div>
    <ChemicalImage
      :data="chemical"
      :small="true"
    />
    <div class="name">
      <a :title="chemical.preferredName" :href="detailLink">{{ chemical.preferredName }}</a><br>
    </div>
    <div class="chemical-data">
      <dl>
        <dt v-show="chemical.measured">
          Measured
        </dt>
        <dd v-show="chemical.measured">
          {{ chemical.measured }}
        </dd>
        <dt v-show="chemical.resultValue">
          Predicted
        </dt>
        <dd v-show="chemical.resultValue">
          {{ chemical.resultValue }}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import {
  mapState, mapMutations, mapGetters,
} from 'vuex'
import ChemicalImage from '~/components/results/ChemicalImage.vue'

export default {
  name: 'OperaTile',

  components: {
    ChemicalImage,
  },
  props: {
    chemical: {
      type: Object,
      default() {
        return { }
      },
    },
  },
  data() {
    return {
      selected: false,
      detailLink: `/dashboard/chemical/details/${this.chemical.dtxsid}`,

    }
  },
  computed: {
  },
  methods: {
    predictedValue(val) {
      if (Number.isNaN(val)) {
        return val
      }
      return val.toFixed(2)
    },
  },
}
</script>

<style scoped lang="scss">
@media screen {
  .operaTile {
  width: 235px;
  height: 275px;
  margin: 8px;
  box-sizing: border-box;
  position: relative;
  padding: 0.1em .5em;
  border: 1px solid lightgrey;
  border-radius: 3%;
  background-color:white;

    &.selected {
      &:after {
        color: #eee;
        background-color: #0e6993;
      }
    }

    &:hover,
    &:focus {
      border: 1px solid #525466;
      -webkit-box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.53);
      -moz-box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.53);
      box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.53);
    }
  }

  .name {
    color:#0e6993;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight:400;
    font-size:1.1em;
    text-align: center;
    margin-bottom: 3px;
    background-color:#efefef;
  }

  .chemicalImage {
    user-select: none;
    font-size: 2em;
    align-items: center;
    justify-content: center;
  }

  .chemical-data {
    font-size:11px;

    .sources{
      margin-top:5px;
      text-align:center;
    }

    .badge{
      font-size:11px;
      margin-right:4px;
      font-weight: 500;
      background-color:white!important;
      color:black;

      &.pink{
        border-left: 4px solid #ea5e7e;
      }
      &.indigo{
        border-left: 4px solid #6670ad!important;
      }
      &.orange{
        border-left: 4px solid #f7ac3f!important;
      }
      &.green{

        border-left: 4px solid #60cc77!important;
      }
    }

  }

  dl {
    display: flex;
    flex-flow: row wrap;
    margin:0;
  }
  dt {
    flex-basis: 35%;
    font-weight:500;
    padding: 0px 2px;
    text-align: right;
      &:after {
          content: ":";
      }
  }
  dd {
    flex-basis: 65%;
    flex-grow: 1;
    margin: 0;
    padding: 0px 2px;
  }

  .magnify{
    position: absolute;
    top:130px !important;
    left:12px;
    color:#bbb;
    font-size:16px;
    cursor: pointer;
    z-index: 900;
  }
  .neighbor-order{
    position: absolute;
    top:10px !important;
    left:12px;
    color: black !important;
    font-size:16px;
    cursor: pointer;
    z-index: 900;
  }
}

 @media print {
  .operaTile {
    width: 550px;
    height: 650px;
    margin: 8px;
    box-sizing: border-box;
    position: relative;
    padding: 0.1em .5em;
    border: 1px solid lightgrey;
    border-radius: 3%;
    background-color:white;
  }
 }
</style>
