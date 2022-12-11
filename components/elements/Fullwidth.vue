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
    if (this.$viewport.isMobile) return

    const speed = 0.35

    const y = this.$viewport.width * speed * 0.1

    this.setY = gsap.quickSetter(this.$refs.picture.$el, 'y', 'px')

    this.tl = gsap.timeline({
      scrollTrigger: {
        id: this.id,
        trigger: this.$refs.picture.$el,
        scrub: true,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (e) => {
          if (this.position === 'top') {
            this.setY(e.progress * y)
          } else {
            this.setY(-gsap.utils.mapRange(0, 1, -y, y, e.progress))
          }
        },
      },
    })

    // gsap.to(this.$refs.picture.$el, {
    //   yPercent: -8.5,
    //   ease: 'none',
    //   scrollTrigger: {
    //     trigger: this.$el,
    //     scrub: 0.25,
    //   },
    // })
  },
  beforeDestroy() {
    this.tl?.kill()
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

  @include mobile {
    aspect-ratio: 375 / 300;
    margin-top: mobile-vw(95px);
  }

  &::before {
    content: '';
    opacity: 0.1;
  }

  picture {
    transform: scale(1.2);

    @include mobile {
      transform: none;
    }
  }
}
</style>
