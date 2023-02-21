<template>
  <div
    class="app"
    :class="{
      'cursor-slider': cursorState === 'slider',
      'cursor-hover': cursorState === 'hover',
      prod: devToolsHidden,
    }"
  >
    <div ref="layerBlue" class="app-transition-layer blue" />
    <div ref="layerRed" class="app-transition-layer red" />
    <AppCursor />
    <AppPreloader />
    <AppCookie />
    <AppPopinNewsletter />
    <AppHeader />
    <AppMenu />
    <AppScrollbar />
    <nuxt class="app-main" />
    <AppScene />
    <WebglScene />
    <WebglInfo />
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    devToolsHidden() {
      return process.env.NODE_ENV !== 'development'
    },
  },
  watch: {},

  mounted() {
    const gui = useGUI()

    if (this.$viewport.isMobile) {
      gui.hidden = true
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

  &.prod {
    .app-renderer-info {
      display: none;
      visibility: hidden;
    }
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
      z-index: 98;
    }

    &.red {
      background-color: var(--c-red-adidas);
      z-index: 99;
    }
  }
}
</style>
