<template>
  <div :class="y" class="app-element-lottie" />
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'

export default {
  data() {
    return {
      initRafId: null,
      syncScrollRafId: null,
    }
  },
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
      default: 1,
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
        case 'Petite_Fleche_04':
          return require(`@/assets/lotties/Petite_Fleche_04.json`)
        case 'Petite_Fleche_05':
          return require(`@/assets/lotties/Petite_Fleche_05.json`)
        case 'Fleche_2':
          return require(`@/assets/lotties/Fleche_2.json`)
        case 'Fleche_3':
          return require(`@/assets/lotties/Fleche_3.json`)
        case 'Cadre_01':
          return require(`@/assets/lotties/Cadre_01.json`)
        case 'Cadre_02':
          return require(`@/assets/lotties/Cadre_02.json`)
        case 'Trait_3':
          return require(`@/assets/lotties/Trait_3.json`)
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
        case 'Circle_6':
          return require(`@/assets/lotties/Cercle_6.json`)
        case 'Fleche_Match':
          return require(`@/assets/lotties/Fleche_Match.json`)
        case '404_Fleche_Rouge_01':
          return require(`@/assets/lotties/404_Fleche_Rouge_01.json`)
        case '404_Fleche_Bleu_01':
          return require(`@/assets/lotties/404_Fleche_Bleu_01.json`)
        default:
          return null
      }
    },
  },
  mounted() {
    if (!this.src) return

    if (this.$viewport.isMobile) {
      this.animation = lottie.loadAnimation({
        container: this.$el,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: this.src,
      })

      this.animation.goToAndStop(this.animation.totalFrames - 1, true)


    } else {
      this.$nextTick(() => {
        this.initRafId = requestAnimationFrame(() => {
          this.initRafId = null
          if (this._isBeingDestroyed || this._isDestroyed || !this.$el) return
          if (!this.src) return
          this.LottieScrollTrigger({
            target: this.$el,
            start: this.start,
            end: this.end,
            scrub: this.scrub,
          })
        })
      })
    }
  },
  beforeDestroy() {
    if (this.initRafId != null) {
      cancelAnimationFrame(this.initRafId)
      this.initRafId = null
    }
    if (this.syncScrollRafId != null) {
      cancelAnimationFrame(this.syncScrollRafId)
      this.syncScrollRafId = null
    }
    this.tween?.kill()
    this.tween = null
  },
  methods: {
    syncFrameFromScrollTrigger(minFrame = 1) {
      if (!this.animation || !this.tween?.scrollTrigger) return

      const totalFrames = Math.max(1, this.animation.totalFrames - 1)
      const progress = Math.min(
        1,
        Math.max(0, this.tween.scrollTrigger.progress || 0)
      )
      const frame = Math.max(
        minFrame,
        Math.round(totalFrames * progress)
      )

      this.animation.goToAndStop(frame, true)
    },
    LottieScrollTrigger(vars) {
      if (this._isBeingDestroyed || this._isDestroyed || !this.$el) return

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
      this.animation.goToAndStop(1, true)

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

      if (this.syncScrollRafId != null) {
        cancelAnimationFrame(this.syncScrollRafId)
      }
      this.syncScrollRafId = requestAnimationFrame(() => {
        this.syncScrollRafId = null
        if (this._isBeingDestroyed || this._isDestroyed || !this.$el) return
        if (!this.tween || !this.animation) return
        this.tween.scrollTrigger?.refresh()
        ScrollTrigger.update()
        this.syncFrameFromScrollTrigger(1)
      })

      // Force une frame cohérente dès le chargement, avant le premier scroll utilisateur.
      requestAnimationFrame(() => {
        if (this._isBeingDestroyed || this._isDestroyed || !this.$el) return
        this.syncFrameFromScrollTrigger(1)
      })
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
