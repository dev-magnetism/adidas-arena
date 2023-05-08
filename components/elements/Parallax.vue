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
      default: 0.5,
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
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.kill()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const y = this.$viewport.width * this.speed * 0.1

        const setY = gsap.quickSetter(this.$refs.trigger, 'y', 'px')

        const tl = gsap.timeline({
          scrollTrigger: {
            id: this.id,
            trigger: this.$refs.trigger,
            scrub: this.scrub,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (e) => {
              if (this.position === 'top') {
                setY(e.progress * y)
              } else {
                setY(-gsap.utils.mapRange(0, 1, -y, y, e.progress))
              }
            },
          },
        })

        return () => {
          tl?.kill()
          setY(0)
        }
      })
    },
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
