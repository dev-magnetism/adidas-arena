<template>
  <div ref="lottie" class="app-element-lottie-word">
    <slot />
    <!-- <div ref="lottie" class="app-element-lottie-word-wrapper" /> -->
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
        case 'Cercle_2':
          return require(`@/assets/lotties/Cercle_2.json`)
        case 'Cercle_3':
          return require(`@/assets/lotties/Cercle_3.json`)
        case 'Cercle_4':
          return require(`@/assets/lotties/Cercle_4.json`)
        case 'Fleche_Match':
          return require(`@/assets/lotties/Fleche_Match.json`)
        default:
          return null
      }
    },
  },
  mounted() {
    this.LottieScrollTrigger({
      target: this.$el,
      animation: this.src,
      start: 'top bottom-=10%',
      end: 'top center',
      scrub: 1,
    })
  },
  destroyed() {
    this.tween?.kill()
    // this.animation?.destroy()
  },
  methods: {
    LottieScrollTrigger(vars) {
      const playhead = { frame: 0 }
      const target = gsap.utils.toArray(vars.target)[0]

      const st = {
        trigger: target,
        start: vars.start || 'top center',
        end: vars.end || 'bottom center',
        scrub: vars.scrub,
      }

      this.animation = lottie.loadAnimation({
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
.app-element-lottie-word {
  position: relative;
  display: inline-flex;
  z-index: 999;
  pointer-events: none;

  &.Cercle_1 {
    svg {
      width: 110% !important;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) !important;
    }
  }

  &.Trait_1 {
    svg {
      width: 100% !important;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 100%) !important;
    }
  }

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

  svg,
  canvas {
    position: absolute;
    left: 0;
    width: 100%;
    height: auto !important;
  }
}
</style>
