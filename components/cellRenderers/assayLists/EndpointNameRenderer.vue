<template>
  <div>
    <nuxt-link
      v-if="params.value"
      :to="`/assay-endpoints/${params.value}`"
    >
      {{ params.value }}
    </nuxt-link>
  </div>
</template>

<script>

export default {
  name: 'EndpointNameRenderer',
}
</script>
