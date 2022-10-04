<template>
  <!-- <div class="app-element-fullwidth"> -->
  <EParallax :speed="0.25" :scrub="2" class="app-element-fullwidth">
    <nuxt-picture
      ref="picture"
      class="picture-absolute"
      src="imgs/fullwidth.webp"
      format="webp"
      alt="placeholder"
    />
  </EParallax>
  <!-- </div> -->
</template>

<script>
// import { gsap } from 'gsap'

export default {
  mounted() {},
}
</script>

<style lang="scss">
.app-element-fullwidth {
  width: 100%;
  aspect-ratio: 1440 / 680;
  position: relative;
  overflow: hidden;

  @include noise();

  picture {
    transform: scale(1.35);
  }
}
</style>
