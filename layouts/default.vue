<template>
  <div class="app">
    <div ref="layerBlue" class="app-transition-layer blue" />
    <div ref="layerRed" class="app-transition-layer red" />

    <!-- <AppCursor v-if="!$viewport.isMobile" /> -->
    <!-- <AppPreloader /> -->
    <AppMenu />
    <AppHeader />
    <nuxt class="app-main" />
    <AppScene />
    <WebglInfo v-if="!$viewport.isMobile" />
  </div>
</template>

<script>
import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

import useGUI from '~/hooks/gui'

export default {
  layout: 'DefaultLayout',

  data() {
    return {}
  },
  computed: {
    ...mapState({}),
  },

  watch: {},

  mounted() {
    const gui = useGUI()

    if (this.$viewport.isMobile) {
      gui.hidden = true
    }

    this.$nuxt.$on('transition:run', this.onTransitionRun)
  },

  beforeDestroy() {
    this.$nuxt.$off('transition:run', this.onTransitionRun)
  },
  methods: {
    onTransitionRun(done) {
      this.tl = gsap
        .timeline({})
        .fromTo(
          this.$refs.layerBlue,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.85,
            ease: 'power3.out',
          }
        )
        .fromTo(
          this.$refs.layerRed,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          '<10%'
        )

        .to([this.$refs.layerRed, this.$refs.layerBlue], {
          scaleY: 0,
          transformOrigin: 'center bottom',
          duration: 1,
          ease: 'power3.out',
          onComplete: () => {
            done()
          },
        })
    },
    ...mapMutations({
      // setFontsLoaded: 'setFontsLoaded',
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

  &-main {
    z-index: 0;
  }

  &-transition-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transform: scaleY(0);
    transform-origin: center top;
    will-change: transform;

    &.blue {
      background-color: var(--c-blue-adidas);
      z-index: 9;
    }
    &.red {
      background-color: var(--c-red-adidas);
      z-index: 10;
    }
  }
}
</style>
