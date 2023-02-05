<template>
  <div
    :class="{
      invisible: !fontsLoaded,
      'hide-inner': hideInner,
      hide: preloaderHidden,
    }"
    class="app-preloader"
  >
    <video
      ref="video"
      class="app-preloader__video"
      autoplay
      loop
      muted
      playsinline
    >
      <source src="/videos/preloader.mp4" type="video/mp4" />
    </video>

    <TH1
      tag="span"
      ref="progress"
      class="app-preloader__progress"
      weight="bold"
    >
      {{ progressUIFormated }}
    </TH1>
    <div ref="layerBlue" class="app-preloader__layer blue" />
    <div ref="layerRed" class="app-preloader__layer red" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import loaderManager from '~/assets/js/loaderManager'

export default {
  data() {
    return {
      progressUI: 0,
      hideInner: false,
      videoLoaded: false,
    }
  },
  computed: {
    progressUIFormated() {
      return ('00' + this.progressUI).slice(-3)
    },
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
      allLoadedFake: (state) => state.allLoadedFake,
      allLoadedActual: (state) => state.allLoadedActual,
      preloaderHidden: (state) => state.preloaderHidden,
    }),
  },
  watch: {
    videoLoaded(payload) {
      if (!payload) return

      this.loadModels()
    },
  },
  mounted() {
    this.initTimeline()
    this.loadFonts()
  },

  methods: {
    hidePreloader() {
      this.tlHidePreloader = gsap
        .timeline({
          delay: 1,
          onComplete: () => {
            this.setPreloaderHidden(true)
            this.tlLoading?.clear()
            this.tlLoading?.kill()

            this.tlHidePreloader?.clear()
            this.tlHidePreloader?.kill()
          },
        })
        .to(this.$refs.layerBlue, {
          scaleY: 1,
          duration: 1,
          ease: 'power3.out',
        })
        .to(
          this.$refs.layerRed,
          {
            scaleY: 1,
            duration: 1,
            ease: 'power3.out',
          },
          '<10%'
        )
        .to([this.$refs.layerRed, this.$refs.layerBlue], {
          scaleY: 0,
          transformOrigin: 'center bottom',
          duration: 1.2,
          onStart: () => {
            this.$refs.video.pause()
            this.$refs.video.currentTime = 0

            this.$refs.video.removeEventListener(
              'canplaythrough',
              this.onVideoLoaded
            )

            this.setInitialHeroDisplayed(true)
            this.hideInner = true
          },
          ease: 'power3.out',
        })
    },
    onVideoLoaded() {
      this.videoLoaded = true
    },
    loadFonts() {
      const FontFaceObserver = require('fontfaceobserver')

      const fontData = {
        'AdihausDIN Cn': { weight: 400 },
        'AdihausDIN Cn Medium': { weight: 400 },
        'AdihausDIN Cn Bold': { weight: 400 },
        AdihausDIN: { weight: 400 },
        'AdihausDIN Medium': { weight: 400 },
        'AdihausDIN Bold': { weight: 400 },
      }

      const observers = []

      Object.keys(fontData).forEach((family) => {
        const data = fontData[family]
        const obs = new FontFaceObserver(family, data)
        observers.push(obs.load())
      })

      Promise.all(observers)
        .then((fonts) => {
          this.$refs.video.addEventListener(
            'canplaythrough',
            this.onVideoLoaded
          )
          this.setFontsLoaded(true)
          ScrollTrigger.refresh()
        })
        .catch((err) => {
          console.warn('Some critical font are not available:', err)
        })
    },

    initTimeline() {
      this.tlLoading = gsap.timeline({
        onUpdate: () => {
          const progress = this.tlLoading.progress()

          if (progress >= 0.925) this.setModelsPreviewed(true)
        },
        onComplete: () => {
          if (!this.allLoadedActual) return

          this.setAllLoadedFake(true)
          this.hidePreloader()
        },
      })
    },

    loadModels() {
      loaderManager.load(
        [
          { id: 'exterior', path: '/models/exterior.gltf' },
          { id: 'cloud', path: '/models/cloud.gltf' },
          { id: 'interior', path: '/models/interior.gltf' },
        ],
        this.onProgressLoader,
        this.onCompleteLoader
      )
    },

    onProgressLoader({ normalized, percentage }, id) {
      this.tlLoading.set(this, {
        progressUI: Math.round(percentage),
        delay: this.genRand(0.75, 1.5, 2),
      })

      if (id === 'exterior') {
        this.setModelExteriorLoaded(true)
      } else if (id === 'cloud') {
        this.setModelCloudLoaded(true)
      } else if (id === 'interior') {
        this.setModelInteriorLoaded(true)
      }
    },

    onCompleteLoader() {
      this.setAllLoadedActual(true)
    },

    ...mapMutations({
      setAllLoadedFake: 'setAllLoadedFake',
      setAllLoadedActual: 'setAllLoadedActual',
      setModelExteriorLoaded: 'setModelExteriorLoaded',
      setModelInteriorLoaded: 'setModelInteriorLoaded',
      setModelCloudLoaded: 'setModelCloudLoaded',
      setFontsLoaded: 'setFontsLoaded',
      setPreloaderHidden: 'setPreloaderHidden',
      setModelsPreviewed: 'setModelsPreviewed',
      setInitialHeroDisplayed: 'setInitialHeroDisplayed',
    }),

    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
  },
}
</script>

<style lang="scss">
.app-preloader {
  position: fixed;
  width: 100vw;
  height: calc(100 * var(--vh, 1vh));
  background-color: var(--c-grey);
  z-index: 999;
  overflow: hidden;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  // opacity: 0.5;

  &.invisible {
    .app-preloader__progress.H1,
    .app-preloader__video {
      opacity: 0;
    }
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  &.hide-inner {
    background-color: transparent;
    .app-preloader__progress.H1,
    .app-preloader__video {
      opacity: 0;
      transition: none;
    }
  }

  &__video {
    height: auto;
    max-height: 75%;
    width: 25%;
    aspect-ratio: 350 / 620;
    opacity: 1;
    pointer-events: none;
    mix-blend-mode: darken;
    transition: opacity 0.85s 0.65s var(--ease-out-expo);

    @include mobile {
      width: 85%;
    }
  }

  &__layer {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    transform: scaleY(0);
    transform-origin: center top;

    &.red {
      background: var(--c-red-adidas);
    }
    &.blue {
      background: var(--c-blue-adidas);
    }
  }

  &__progress.H1 {
    position: absolute;
    bottom: desktop-vw(30px);
    right: desktop-vw(40px);
    opacity: 1;
    transition: opacity 0.85s 0.65s var(--ease-out-expo);
  }
}
</style>
