<template>
  <div class="app-actualites-block-slider grid-inner">
    <div class="app-actualites-block-slider__wrapper">
      <TH4 class="app-actualites-block-slider__title" weight="bold">
        Block Slider
      </TH4>
    </div>
  </div>
</template>

<style lang="scss">
.app-actualites-block-slider {
  &__wrapper {
    grid-column: 4 / span 6;
  }

  &__title {
    margin-bottom: desktop-vw(30px);
  }
}
</style>
