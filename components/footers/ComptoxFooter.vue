<template>
  <Footer color="default-color align-middle" data-cy="comptox-footer">
    <h1>
      CCD Chemicals Dashboard Footer
    </h1>
    <div id="environment">
      {{ applicationEnvironmentLabel }}
    </div>
  </Footer>
</template>


<script>
import {Footer} from 'mdbvue'

export default {
  name: 'ComptoxFooter',
  components: {
    Footer,
  },
  data() {
    return {
      isError: false,
      applicationEnvironmentLabel: process.env.APPLICATION_ENVIRONMENT_LABEL,
    }
  },
}
</script>

<style scoped>
footer {
  height: 65px !important;
  margin-top: 0 !important;
}

div #environment {
  display: block;
  visibility: hidden;
}
</style>
