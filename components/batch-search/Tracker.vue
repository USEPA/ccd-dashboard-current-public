<template functional>
  <div id="batch-search-tracker" class="sticky">
    <div id="texts">
      <div v-for="(step, n) in props.steps" :key="n" class="step-text">
        Step {{ n + 1 }}
      </div>
    </div>

    <div id="steps">
      <div v-for="(step, n) in props.steps" :key="n" class="step">
        <div class="bar" :class="{active: n <= props.activeStep}">
          <div v-if="n !== 0" class="line" />
          <div class="ball" @click="listeners.stepClick(n)" />
        </div>
      </div>
    </div>
    <h2 class="subtitle has-text-centered is-3">
      {{ props.steps[props.activeStep] }}
    </h2>
  </div>
</template>

<script>
export default {
  name: 'Tracker',
  props: ['steps', 'activeStep'],
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 20;
  margin-bottom:30px;
  background-color:#f5f5f5;
}
#texts {
  display: flex;
  justify-content: space-between;
}

#steps {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;

  .step {
    width: 100%;
    &:first-child {
    width: auto;
    white-space: nowrap;
  }

  .bar {
    display: flex;
    align-items: center;

    .ball {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      background-color: black;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      z-index: 1;
    }

    .line {
    width: 100%;
    height: 6px;
    margin: 0 -3px;
    background-color: black;
    z-index: 0;
    }

    &.active {
    .line, .ball {
    background-color: limegreen;
    }
    }
  }
}
}
</style>
