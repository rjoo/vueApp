<template>
  <div class="loader">
  </div>
</template>

<style lang="sass">
  $color: blue;

  .loader {
    position: relative;
    width: 12px;
    height: 12px;

    top: 46%;
    top: -webkit-calc(50% - 6px);
    top: calc(50% - 6px);
    left: 46%;
    left: -webkit-calc(50% - 6px);
    left: calc(50% - 6px);
    
    border-radius: 12px;
    background-color: $color;
    transform-origin:  50% 50% ;
    animation: loader 1s ease-in-out infinite;

    &:before {
      content: "";
      position: absolute;
      background-color: rgba($color, .5);
      top: 0px;
      left: -25px;
      height: 12px;
      width: 12px;
      border-radius: 12px;
    }

    &:after {
      content: "";
      position: absolute;
      background-color: rgba($color, .5);
      top: 0px;
      left: 25px;
      height: 12px;
      width: 12px;
      border-radius: 12px;
    }
  }

  @keyframes loader{
    0%{transform:rotate(0deg);}
    50%{transform:rotate(180deg);}
    100%{transform:rotate(180deg);}
  }
</style>