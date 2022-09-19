<template>
  <div :class="{ visible: !fontsLoaded }" class="app-preload-layer" />
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  computed: {
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
    }),
  },
  mounted() {
    this.preloadFonts()
  },
  methods: {
    preloadFonts() {
      const FontFaceObserver = require('fontfaceobserver')

      const fontData = {
        'TuskerGrotesk-Bold': { weight: 400 },
        'TuskerGrotesk-Medium': { weight: 400 },
        'AdihausDIN Cn Bold': { weight: 400 },
        'AdihausDIN Bold': { weight: 400 },
        'AdihausDIN Medium': { weight: 400 },
        AdihausDIN: { weight: 400 },
      }

      const observers = []

      Object.keys(fontData).forEach((family) => {
        const data = fontData[family]
        const obs = new FontFaceObserver(family, data)
        observers.push(obs.load())
      })

      Promise.all(observers)
        .then((fonts) => {
          this.setFontsLoaded(true)
          ScrollTrigger.refresh()
        })
        .catch((err) => {
          console.warn('Some critical font are not available:', err)
        })
    },
    ...mapMutations({
      setFontsLoaded: 'setFontsLoaded',
    }),
  },
}
</script>

<style lang="scss">
.app-preload-layer {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: var(--c-beige);
  z-index: 999;
  overflow: hidden;
  transform: translate3d(0, -100%, 0);
  transition: transform 2.5s var(--ease-out-expo);
  transition-delay: 0.5s;

  &.visible {
    transform: translate3d(0, 0%, 0);
  }
}
</style>
