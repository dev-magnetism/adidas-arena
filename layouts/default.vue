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
    <AppScene v-show="!webglInFlow" ref="appScene" />
    <WebglScene />
    <AppFacilitiButton />
    <!-- <WebglInfo /> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import useGUI from '~/hooks/gui'
import useWebGL from '~/hooks/webgl'

export default {
  layout: 'DefaultLayout',
  provide() {
    return {
      setWebglMount: this.setWebglMount,
    }
  },
  computed: {
    ...mapState({
      cursorState: (state) => state.cursorState,
      appCursor: (state) => state.appCursor,
      webview: (state) => state.webview,
      webglInFlow: (state) => state.webglInFlow,
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
      setWebglInFlow: 'setWebglInFlow',
    }),
    setWebglMount(el) {
      const webgl = useWebGL()
      const canvas = webgl.renderer.domElement
      const defaultContainer = this.$refs.appScene?.$el
      if (!canvas || !defaultContainer) return
      const target = el || defaultContainer
      if (target.contains(canvas)) return
      target.appendChild(canvas)
      if (el) {
        const w = Math.max(1, el.clientWidth || 0)
        const h = Math.max(1, el.clientHeight || 0)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        if (w > 0 && h > 0) {
          webgl.renderer.setSize(w, h, false)
          if (webgl.composer) webgl.composer.setSize(w, h)
          webgl.camera.left = -w / 2
          webgl.camera.right = w / 2
          webgl.camera.top = h / 2
          webgl.camera.bottom = -h / 2
          webgl.camera.updateProjectionMatrix()
          webgl.renderer.setScissor(0, 0, w, h)
          webgl.renderer.setViewport(0, 0, w, h)
        }
      } else {
        canvas.style.left = ''
        canvas.style.top = ''
        canvas.style.position = ''
        canvas.style.width = ''
        canvas.style.height = ''
        const w = this.$viewport?.width ?? window.innerWidth
        const h = this.$viewport?.height ?? window.innerHeight
        webgl.renderer.setSize(w, h)
        if (webgl.composer) webgl.composer.setSize(w, h)
        webgl.camera.left = -w / 2
        webgl.camera.right = w / 2
        webgl.camera.top = h / 2
        webgl.camera.bottom = -h / 2
        webgl.camera.updateProjectionMatrix()
        webgl.renderer.setScissor(0, 0, w, h)
      }
      this.setWebglInFlow(!!el)
    },
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
