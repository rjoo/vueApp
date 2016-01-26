<template>
  <div class="progress">
    <div class="progress-meter" v-bind:style="{ 'width': progress }">
      <div class="progress-meter-text">{{ progressText }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['progress', 'progressText']
  }
</script>

<style lang="sass">
  .progress {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  .progress-meter {
    transition: width 0.25s;

    .progress-meter-text {
      text-transform: uppercase;
      font-size: 11px;
      font-weight: normal;
    }
  }
  
  .progress-label {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    text-transform: uppercase;
    white-space: nowrap;
  }
</style>