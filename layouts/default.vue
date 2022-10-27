<template>
  <div class="app">
    <AppHeader />
    <nuxt />
    <AppScene />
    <AppPreloadLayer />
    <AppCursor v-if="!$device.isMobile" />
  </div>
</template>

<script>
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'DefaultLayout',
  // scrollToTop: true,
  data() {
    return {}
  },
  computed: {
    ...mapState({}),
  },

  watch: {},

  mounted() {
    this.preloadFonts()

    this.$nuxt.$on('app:beforeEnter', this.onBeforeEnter)
  },

  beforeDestroy() {},
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

    onBeforeEnter() {
      ScrollTrigger.refresh()
    },

    ...mapMutations({
      setFontsLoaded: 'setFontsLoaded',
    }),
  },
}
</script>

<style lang="scss">
.app {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: var(--c-beige);
}
</style>
