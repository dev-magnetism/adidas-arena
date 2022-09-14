<template>
  <div ref="lottie" class="app-element-lottie-test"></div>
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
      speed: 'fast',
      start: 'top center+=10%',
      end: 'bottom center-=25%',
      scrub: 0.5,
    })
  },
  methods: {
    LottieScrollTrigger(vars) {
      const playhead = { frame: 0 }
      const target = gsap.utils.toArray(vars.target)[0]
      // const speeds = { slow: '+=2000', medium: '+=1000', fast: '+=500' }

      const st = {
        trigger: target,
        start: vars.start || 'top center',
        end: vars.end || '+=1000',
        // markers: true,
        scrub: vars.scrub,
      }

      const animation = lottie.loadAnimation({
        container: target,
        renderer: vars.renderer || 'svg',
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
.app-element-lottie-test {
  width: 200px;
  height: 100px;
}
</style>
