<template>
  <div class="app-element-fullwidth">
    <nuxt-picture
      ref="picture"
      provider="directus"
      class="picture-absolute"
      :src="contents.src"
      format="webp"
      :alt="contents.alt"
    />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    gsap.to(this.$refs.picture.$el, {
      yPercent: -8.5,
      ease: 'none',
      scrollTrigger: {
        trigger: this.$el,
        scrub: true,
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

  &::before {
    content: '';
    opacity: 0.1;
  }

  picture {
    transform: translateY(10%) scale(1.2);
  }
}
</style>
