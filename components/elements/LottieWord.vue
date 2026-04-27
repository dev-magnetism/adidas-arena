<template>
  <div ref="lottie" class="app-element-lottie-word">
    <div ref="animationContainer" class="app-element-lottie-word__animation" />
    <slot />
  </div>
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
      waitForDeferredTrigger: false,
      hasStartedDeferredAnimation: false,
      deferredPlayhead: null,
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
    deferredDraw: {
      type: Boolean,
      default: false,
    },
    deferredDuration: {
      type: Number,
      default: 1.6,
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
        case 'Cercle_2':
          return require(`@/assets/lotties/Cercle_2.json`)
        case 'Cercle_3':
          return require(`@/assets/lotties/Cercle_3.json`)
        case 'Cercle_4':
          return require(`@/assets/lotties/Cercle_4.json`)
        case 'Cercle_5':
          return require(`@/assets/lotties/Cercle_5.json`)
        case 'Cercle_6':
          return require(`@/assets/lotties/Cercle_6.json`)
        case 'Fleche_Match':
          return require(`@/assets/lotties/Fleche_Match.json`)
        default:
          return null
      }
    },
  },
  mounted() {
    if (!this.$refs.animationContainer || !this.src) return

    const isInCchapelleIntro = !!this.$el?.closest(
      '.page-cchapelle__introduction'
    )
    const shouldUseDeferredDraw = this.deferredDraw || isInCchapelleIntro

    if (shouldUseDeferredDraw) {
      this.waitForDeferredTrigger = true
      this.$nuxt?.$on(
        'centralChapelle:triggerLottieAnimation',
        this.onDeferredDrawTrigger
      )
      this.initDeferredDrawAnimation()
      return
    }

    if (this.$viewport.isMobile) {
      this.animation = lottie.loadAnimation({
        container: this.$refs.animationContainer,
        // renderer: vars.renderer || 'svg',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: this.src,
      })

      this.animation.goToAndStop(this.animation.totalFrames - 1, true)
    } else {
      // Après navigation client, layout / scroll (Lenis) pas encore stables au 1er tick.
      this.$nextTick(() => {
        this.initRafId = requestAnimationFrame(() => {
          this.initRafId = null
          if (this._isBeingDestroyed || this._isDestroyed || !this.$el) return
          if (!this.$refs.animationContainer) return
          this.LottieScrollTrigger({
            target: this.$refs.animationContainer,
            animation: this.src,
            start: 'top bottom-=10%',
            end: 'top center',
            scrub: 1,
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
    // Ne pas appeler animation.destroy() ici : ça vide le SVG tout de suite pendant
    // la transition de sortie. Voir destroyed().
    if (this.waitForDeferredTrigger) {
      this.$nuxt?.$off(
        'centralChapelle:triggerLottieAnimation',
        this.onDeferredDrawTrigger
      )
      this.waitForDeferredTrigger = false
    }
    this.tween?.kill()
    this.tween = null
  },
  methods: {
    initDeferredDrawAnimation() {
      if (!this.$refs.animationContainer || !this.src) return

      this.animation = lottie.loadAnimation({
        container: this.$refs.animationContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: this.src,
      })

      this.deferredPlayhead = { frame: 0 }
      this.animation.goToAndStop(0, true)
    },
    onDeferredDrawTrigger() {
      if (!this.waitForDeferredTrigger || this.hasStartedDeferredAnimation) return
      if (!this.animation) return

      const maxFrame = Math.max(1, this.animation.totalFrames - 1)
      this.hasStartedDeferredAnimation = true

      this.tween = gsap.to(this.deferredPlayhead, {
        frame: maxFrame,
        duration:
          Number.isFinite(this.deferredDuration) && this.deferredDuration > 0
            ? this.deferredDuration
            : 1.6,
        ease: 'power2.out',
        onUpdate: () =>
          this.animation?.goToAndStop(this.deferredPlayhead?.frame || 0, true),
      })

      this.$nuxt?.$off(
        'centralChapelle:triggerLottieAnimation',
        this.onDeferredDrawTrigger
      )
      this.waitForDeferredTrigger = false
    },
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
      if (!target) return

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
      this.animation.goToAndStop(1, true)

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

      // La toute première valeur d'un scrub peut rester à 0 tant qu'aucun scroll n'a lieu.
      // On synchronise explicitement la frame avec le progress calculé à l'init.
      requestAnimationFrame(() => {
        if (this._isBeingDestroyed || this._isDestroyed || !this.$el) return
        this.syncFrameFromScrollTrigger(1)
      })
    },
  },
}
</script>

<style lang="scss">
.app-element-lottie-word {
  position: relative;
  display: inline-flex;
  z-index: 9;
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

  &__animation {
    position: absolute;
    inset: 0;
  }

  &__animation svg,
  &__animation canvas {
    position: absolute;
    left: 0;
    width: 100%;
    height: auto !important;
  }
}
</style>
