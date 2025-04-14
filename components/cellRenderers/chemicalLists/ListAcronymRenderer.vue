<template>
  <div>
    <nuxt-link
      v-if="params.value"
      :title="`Go to ${params.data.label}`"
      :to="`/chemical-lists/${params.value}`"
    >
      {{ params.value }}
    </nuxt-link>
  </div>
</template>

<script>

export default {
  name: 'ListAcronymRenderer',
}
</script>
