<template>
  <div class="app" :class="{ 'cursor-custom': cursorState === 'slider' }">
    <div ref="layerBlue" class="app-transition-layer blue" />
    <div ref="layerRed" class="app-transition-layer red" />
    <AppCursor />
    <AppPreloader />
    <AppCookie />
    <AppLogo />
    <AppHeader />
    <AppMenu />
    <AppScrollbar v-if="!$viewport.isMobile" />
    <nuxt class="app-main" />
    <AppScene />
    <WebglScene />
    <!-- <WebglInfo v-if="!$viewport.isMobile" /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

import useGUI from '~/hooks/gui'

export default {
  layout: 'DefaultLayout',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      cursorState: (state) => state.cursorState,
    }),
  },
  watch: {},

  mounted() {
    const gui = useGUI()

    if (this.$viewport.isMobile) {
      gui.hidden = false
    }
  },

  beforeDestroy() {},
  methods: {},
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
    z-index: 1;
  }

  &-transition-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
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
