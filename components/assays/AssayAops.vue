<template ref="aop">
  <div>
    <div v-if="aopRows.length > 0">
      <div class="buttons">
        <copy-text id="aops" :tip-text="'Copy aops'" :copy-data="aopRows" :copy-type="'assayDetails'" />
      </div>
      <div v-if="loading" class="h3">
        Loading...
      </div>
      <mdb-tbl v-else>
        <mdb-tbl-head>
          <tr>
            <th>AOP Id</th>
            <th>AOP Title</th>
          </tr>
        </mdb-tbl-head>
        <mdb-tbl-body>
          <tr v-for="record in aopRows" :key="record.id">
            <td>
              <mdb-popover trigger="hover" append-to-body :options="{placement: 'right'}">
                <div slot="body">
                  <span v-if="!getAopDat(record.id)">{{ loadingText }}</span>
                  <span v-else v-html="getAopDat(record.id)" style="dispay: block;" />
                </div>
                <a slot="reference" :href="aopUrl(record.id)" target="blank">{{ record.id }}</a>
              </mdb-popover>
            </td>
            <td> {{ record.title }} </td>
          </tr>
        </mdb-tbl-body>
      </mdb-tbl>
    </div>
    <div v-else class="h3">
      No Aops for this assay.
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex'
import {
  mdbTbl, mdbTblHead, mdbTblBody, mdbPopover,
} from 'mdbvue'

export default {
  name: 'AssayAops',
  components: {
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbPopover,
  },
  props: {
    aops: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {
      aid: 0,
      aopArray: [],
      aopHoverTexts: {},
      loadingText: 'Loading...',
      loading: true,
    }
  },
  computed: {
    ...mapGetters({
      getFiltered: 'aops/getFiltered',

    }),
    aopsComputed() {
      const aopsArr = this.getFiltered(this.aid)
      return aopsArr[0]
    },
    aopRows() {
      return this.aopArray
    },
  },
  created() {
    this.aopArray = this.aops.map((aop) => {
      this.aid = aop['Aop Id']
      const aopId = aop['Aop Id']
      const newArr = []
      const aopData = this.aopsComputed
      const newObj = {
        id: aopData.aop_id,
        title: aopData.aop_name,
        wiki: aopData.wiki_status,
        oecd: aopData.oecd_status,
        saaop: aopData.saaop_status,
      }
     // newArr.push({key: 'ID', value: aopId, key: 'DATA', value: newObj})
      return newObj
    })
    this.loading = false
  },
  methods: {
    aopUrl(aopId) {
      return `https://aopwiki.org/aops/${aopId}`
    },

    getAopDat(id) {
      const aop = this.aopArray.filter(aop => aop.id === id)[0]
      const link = this.aopUrl(id)
      const linkString =  `<span style="display: block">
      <a href="${link}" target="_blank">ID: ${aop.id}</a></span>`
      const titleString = `<span style="display: block">AOP TITLE ${aop.title}</span>`
      const wikiString = `<span style="display: block">AUTHOR STATUS ${aop.wiki} </span>`
      const oecdString = `<span style="display: block">OECD STATUS ${aop.oecd} </span>`
      const saaopString = `<span style="display: block">SAAOP STATUS ${aop.saaop} </span>`

      const displayString = `${linkString}${titleString}${wikiString}${oecdString}${saaopString}`
      return displayString
    },
  },
}
</script>
