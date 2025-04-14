<template>
  <mdb-btn-fixed
    id="btnBackToTop"
    color="primary"
    icon="arrow-up"
    size="md"
    :class="{ scrolled: isScrolled}"
    data-cy="backToTopBtn"
    @click.native.prevent="pageUp"
  />
</template>
<script>
import {mdbBtnFixed} from 'mdbvue'

export default {
  name: 'BackToTop',
  components: {
    mdbBtnFixed,
  },
  data() {
    return {
      active: false,
      isScrolled: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    pageUp() {
      window.scroll({
        top: 95, left: 0, behavior: 'smooth',
      })
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 120
    },
  },
}
</script>
<style>
#btnBackToTop {
    position: fixed; /* Fixed/sticky position */
    bottom: 30px; /* Place the button at the bottom of the page */
    right: 20px; /* Place the button 30px from the right */
    z-index: 99; /* Make sure it does not overlap */
    transition: opacity 0.2s ease-out;
    opacity: 0;
}
.scrolled {
    opacity: 1 !important;
}
</style>
