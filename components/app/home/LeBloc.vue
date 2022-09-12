<template>
  <div class="app-home-le-block grid-inner">
    <div class="placeholder-plan"></div>
  </div>
</template>

<style lang="scss">
.app-home-le-block {
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: desktop-vw(70px);
  margin-bottom: desktop-vw(130px);

  .placeholder-plan {
    background: red;
    grid-column: 1 / span 12;
    aspect-ratio: 1300 / 905;
  }
}
</style>
