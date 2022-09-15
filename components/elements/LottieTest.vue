<template>
  <div class="app-element-lottie">
    <slot />
    <div ref="lottie" class="app-element-lottie-test" />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'

export default {
  mounted() {
    const lottieAnimation = require(`@/assets/lotties/circle.json`)

    this.LottieScrollTrigger({
      target: this.$refs.lottie,
      animation: lottieAnimation,
      start: 'top center+=25%',
      end: 'bottom center',
      scrub: 0.5,
    })
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

      const animation = lottie.loadAnimation({
        container: target,
        // renderer: vars.renderer || 'svg',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: vars.animation,
      })

      for (const p in vars) {
        st[p] = vars[p]
      }
      gsap.to(playhead, {
        duration: vars.duration || 0.5,
        delay: vars.delay || 0,
        frame: animation.totalFrames - 1,
        ease: vars.ease || 'none',
        onUpdate: () => animation.goToAndStop(playhead.frame, true),
        scrollTrigger: st,
      })

      // in case there are any other ScrollTriggers on the page and the loading of this Lottie asset caused layout changes
      ScrollTrigger.sort()
      ScrollTrigger.refresh()

      return animation
    },
  },
}
</script>

<style lang="scss">
.app-element-lottie {
  position: relative;
  display: inline-flex;
  z-index: 9;

  canvas {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-25%);
  }
}
</style>
