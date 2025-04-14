<template functional>
  <div>
    <div v-if="props.method.active !== null">
      {{ props.method.active }}
    </div>
    <div v-else>
      <div v-if="props.method.molarLog !== null">
        {{ props.method.molarLog }}
        {{ props.method.molarLogUnit }}
      </div>
      <div v-if="props.method.mass !== null">
        {{ props.method.mass }}
        {{ props.method.massUnit }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MethodData',
}
</script>
