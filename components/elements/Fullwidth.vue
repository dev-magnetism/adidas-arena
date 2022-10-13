<template>
  <div class="app-element-fullwidth">
    <nuxt-picture
      ref="picture"
      class="picture-absolute"
      src="imgs/fullwidth.webp"
      format="webp"
      alt="placeholder"
    />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  mounted() {
    gsap.to(this.$refs.picture.$el, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: this.$el,
        scrub: 0.5,
      },
    })
  },
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
    transform: translateY(10%) scale(1.35);
  }
}
</style>
