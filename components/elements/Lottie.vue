<template>
  <div ref="lottie" :class="y" class="app-element-lottie">
    <slot />
    <!-- <div ref="lottie" class="app-element-lottie-wrapper" /> -->
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'

export default {
  props: {
    y: {
      type: String,
      default: 'center',
    },
    id: {
      type: String,
      default: null,
      require: true,
    },
  },
  computed: {
    src() {
      switch (this.id) {
        case 'crossArrowCircle':
          return require(`@/assets/lotties/crossArrowCircle.json`)
        case 'arrow':
          return require(`@/assets/lotties/arrow.json`)
        // case 3:
        //   return "It's wednesday"
        // case 4:
        //   return "It's thursday"
        // case 5:
        //   return "It's friday"
        // case 6:
        //   return "It's saturday"
        // case 7:
        //   return "It's sunday"
        default:
          return null
      }
    },
  },
  mounted() {
    this.LottieScrollTrigger({
      target: this.$refs.lottie,
      animation: this.src,
      start: 'top center+=25%',
      end: 'bottom top',
      // markers: true,
      scrub: 0.5,
    })
  },
  beforeDestroy() {
    this.animation.destroy()
    this.tween?.kill()
  },
  methods: {
    LottieScrollTrigger(vars) {
      const playhead = { frame: 0 }
      const target = gsap.utils.toArray(vars.target)[0]

      const st = {
        trigger: target,
        start: vars.start || 'top center',
        end: vars.end || 'bottom center',
        // markers: true,
        scrub: vars.scrub,
      }

      this.animation = lottie.loadAnimation({
        container: target,
        // renderer: vars.renderer || 'svg',
        renderer: 'canvas',
        loop: false,
        autoplay: false,
        animationData: vars.animation,
      })

      for (const p in vars) {
        st[p] = vars[p]
      }
      this.tween = gsap.to(playhead, {
        duration: vars.duration || 0.5,
        delay: vars.delay || 0,
        frame: this.animation.totalFrames - 1,
        ease: vars.ease || 'none',
        onUpdate: () => this.animation.goToAndStop(playhead.frame, true),
        scrollTrigger: st,
      })

      // in case there are any other ScrollTriggers on the page and the loading of this Lottie asset caused layout changes
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    },
  },
}
</script>

<style lang="scss">
.app-element-lottie {
  position: relative;
  display: inline-flex;
  z-index: 9;
  width: 100%;
  height: 100%;

  &.center {
    svg {
      top: 50%;
      transform: translateY(-50%) !important;
    }
  }

  &.bottom {
    svg {
      bottom: 0;
    }
  }

  &.bottom {
    svg {
      bottom: 0;
    }
  }

  svg,
  canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100% !important;
  }
}
</style>
