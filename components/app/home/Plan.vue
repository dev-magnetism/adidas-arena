<template>
  <div class="app-home-plan">
    <div class="app-home-plan__inner grid">
      <div class="placeholder-plan"></div>
    </div>
  </div>
</template>

<style lang="scss">
.app-home-plan {
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(50% 50% at 50% 50%, #3a4f68 0%, #15191e 100%);
  margin-top: desktop-vw(200px);
  margin-bottom: desktop-vw(70px);

  &__inner {
    height: 100%;
    width: 100%;
    padding-top: desktop-vw(135px);
    padding-bottom: desktop-vw(135px);
  }

  .placeholder-plan {
    background: red;
    grid-column: 2 / span 10;
    aspect-ratio: 1165 / 730;
  }
}
</style>
