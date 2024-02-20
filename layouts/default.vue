<template>
  <div
    class="app"
    :style="{
      cursor: `${appCursor} !important`,
      prod: devToolsHidden,
    }"
  >
    <div ref="layerBlue" class="app-transition-layer blue" />
    <div ref="layerRed" class="app-transition-layer red" />
    <AppCursor />
    <AppPreloader />
    <AppCookie />
    <!-- AppPopinNewsletter / -->
    <AppHeader />
    <AppMenu v-if="this.webview !== 'ok'" />
    <AppScrollbar />
    <nuxt class="app-main" />
    <AppScene />
    <WebglScene />
    <!-- <WebglInfo /> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import useGUI from '~/hooks/gui'

export default {
  layout: 'DefaultLayout',
  computed: {
    ...mapState({
      cursorState: (state) => state.cursorState,
      appCursor: (state) => state.appCursor,
      webview: (state) => state.webview
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
    
    this.setWebview(this.$route.query.webview);

    window.addEventListener('load', this.handleSmartBanner)

    

  },

  beforeDestroy() {},
  methods: {
    ...mapMutations({
      setWebview: 'setWebview',
    }),
    handleSmartBanner(){
      if(this.$route.query.webview !== 'ok'){
        smartbanner.publish();
      }
    }

  },
}
</script>

<style lang="scss">
.app {
  height: 100%;
  width: 100%;
  /*
  max-width: $desktop-xl-width;
  margin: 0 auto;
  */
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
