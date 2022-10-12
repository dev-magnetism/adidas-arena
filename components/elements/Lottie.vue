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
    renderer: {
      type: String,
      default: 'svg',
      require: false,
    },
    start: {
      type: String,
      default: 'top center',
      require: false,
    },
    end: {
      type: String,
      default: 'center center',
      require: false,
    },
    ease: {
      type: String,
      default: 'none',
      require: false,
    },
    delay: {
      type: Number,
      default: 0,
      require: false,
    },
    scrub: {
      type: Number,
      default: 0.5,
      require: false,
    },
    duration: {
      type: Number,
      default: 1,
      require: false,
    },
    markers: {
      type: Boolean,
      default: false,
      require: false,
    },
  },
  computed: {
    src() {
      switch (this.id) {
        case 'Croix_circle':
          return require(`@/assets/lotties/Croix_circle.json`)
        case 'Valid_circle':
          return require(`@/assets/lotties/Valid_circle.json`)
        case 'Croix_01':
          return require(`@/assets/lotties/Croix_01.json`)
        case 'Petite_Fleche_01':
          return require(`@/assets/lotties/Petite_Fleche_01.json`)
        case 'Petite_Fleche_02':
          return require(`@/assets/lotties/Petite_Fleche_02.json`)
        case 'Petite_Fleche_03':
          return require(`@/assets/lotties/Petite_Fleche_03.json`)
        case 'Fleche_2':
          return require(`@/assets/lotties/Fleche_2.json`)
        case 'Cadre_01':
          return require(`@/assets/lotties/Cadre_01.json`)
        case 'Cadre_02':
          return require(`@/assets/lotties/Cadre_02.json`)
        case 'Trait_2':
          return require(`@/assets/lotties/Trait_2.json`)
        case 'Trait_1':
          return require(`@/assets/lotties/Trait_1.json`)
        case 'Cercle_1':
          return require(`@/assets/lotties/Cercle_1.json`)
        case 'Circle_2':
          return require(`@/assets/lotties/Cercle_2.json`)
        case 'Circle_3':
          return require(`@/assets/lotties/Cercle_3.json`)
        case 'Circle_4':
          return require(`@/assets/lotties/Cercle_4.json`)
        case 'Circle_5':
          return require(`@/assets/lotties/Cercle_5.json`)
        case 'Fleche_Match':
          return require(`@/assets/lotties/Fleche_Match.json`)
        default:
          return null
      }
    },
  },
  mounted() {
    this.LottieScrollTrigger({
      target: this.$refs.lottie,
      start: this.start,
      end: this.end,
      scrub: this.scrub,
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
        start: this.start,
        end: this.end,
        markers: this.markers,
        scrub: vars.scrub,
      }

      this.animation = lottie.loadAnimation({
        container: target,
        renderer: this.renderer,
        loop: false,
        autoplay: false,
        animationData: this.src,
      })

      for (const p in vars) {
        st[p] = vars[p]
      }

      this.tween = gsap.to(playhead, {
        duration: this.duration,
        delay: this.delay,
        frame: this.animation.totalFrames - 1,
        ease: this.ease,
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

  // svg,
  // canvas {
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   transform: translateY(-50%, -50%) !important;
  //   width: 100%;
  //   height: 100%;
  // }
}
</style>
