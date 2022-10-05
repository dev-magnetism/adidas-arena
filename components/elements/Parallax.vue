<template>
  <div class="app-parallax">
    <div ref="trigger" class="app-parallax__inner">
      <slot />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    speed: {
      default: 1,
      require: false,
      type: Number,
    },
    id: {
      default: 'parallax',
      require: false,
      type: String,
    },
    scrub: {
      default: 1,
      require: false,
      type: Number,
    },
    position: {
      default: '',
      require: false,
      type: String,
    },
  },
  mounted() {
    const y = this.$viewport.width * this.speed * 0.1

    this.setY = gsap.quickSetter(this.$refs.trigger, 'y', 'px')

    this.tl = gsap.timeline({
      scrollTrigger: {
        id: this.id,
        trigger: this.$refs.trigger,
        scrub: this.scrub,
        // markers: true,
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
  },
  beforeDestroy() {
    this.tl?.kill()
  },
}
</script>

<style lang="scss">
.app-parallax {
  // position: relative;
  width: 100%;
  // display: block;
  // align-items: center;
  // justify-content: center;

  &__inner {
    height: 100%;
    width: 100%;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    will-change: transform;
  }
}
</style>
