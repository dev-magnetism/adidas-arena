<template>
  <div class="app-element-slider">
    <div class="app-element-slider__inner">
      <nuxt-picture
        v-for="i in 8"
        :key="i"
        ref="picture"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
    </div>
  </div>
</template>

<style lang="scss">
.app-element-slider {
  &__inner {
    display: inline-flex;
    column-gap: var(--layout-columns-gap);
  }

  picture {
    aspect-ratio: 670 / 680;
    width: desktop-vw(670px);
  }
}
</style>
