<template>
  <div :data-allow-drag="true" class="app-arena-hero">
    <div ref="frame" :data-allow-drag="true" class="app-arena-hero__wrapper grid">
      <div ref="webglMount" class="app-arena-hero__webgl" />
      <EEnterArena
        :class="{
          hide:
            !exteriorVisible || !exteriorArenaHovered || !exteriorFullscreen,
        }"
        @onEnterArena="onEnterArena"
      />
      <AtomsCornerPoints :size-points="12" />
      <EHeroInstructions :class="{ hide: !instructionsWebglVisible }" />
      <EInteriorZoneInformations :class="{ hide: exteriorVisible }" />
      <EInteriorInteractions :class="{ hide: exteriorVisible }" />
      <EInteriorFloorSelectorMobile :class="{ hide: exteriorVisible }" />
      <EScrollIndicator @click.native="scrollHero()" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  inject: {
    setWebglMount: { default: () => () => {} },
  },
  data() {
    return {
      alreadyAppearedOnce: false,
      transitionedToInterior: false,
      interiorInitialState: { id: 4, immediate: true },
    }
  },
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      exteriorVisible: (state) => state.exteriorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      exteriorArenaHovered: (state) => state.exteriorArenaHovered,
      exteriorFullscreen: (state) => state.exteriorFullscreen,
      instructionsWebglVisible: (state) => state.instructionsWebglVisible,
      webglInFlow: (state) => state.webglInFlow,
    }),
  },
  watch: {
    allLoadedFake(newVal) {
      if (!newVal) return

      if (this.$viewport.isMobile) {
        this.initInteriorView()
      } else {
        this.initExteriorView()
      }

      this.onToggle(this.scrollTrigger)
    },
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      this.setAllowScroll(true)
    },
  },
  mounted() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.$el,
      start: 'top bottom',
      end: 'bottom+=25% top',
      onToggle: (self) => this.onToggle(self),
    })

    if (this.allLoadedFake) {
      this.setAllowScroll(true)

      if (this.$route.params.enterArena || this.$viewport.isMobile) {
        this.initInteriorView()
      } else {
        this.initExteriorView()
      }
    }

    this.$nextTick(() => {
      if (this.$refs.webglMount && this.setWebglMount) {
        this.setWebglMount(this.$refs.webglMount)
      }
    })

    this.$raf.add(`arena-hero`, this.onFrame)
  },
  beforeDestroy() {
    if (this.setWebglMount) this.setWebglMount(null)
    this.scrollTrigger?.kill()

    this.$raf.remove(`arena-hero`, this.onFrame)
  },
  methods: {
    appearInterior() {
      const { layerPass, camera } = useWebGL()

      this.initInteriorView()
      this.onToggle(this.scrollTrigger)
      this.setExteriorVisible(false)
      this.setExteriorFullscreen(false)

      gsap
        .timeline({
          onComplete: () => {
            this.setAllowScroll(true)
          },
        })
        .addLabel('step-0')
        .fromTo(
          camera,
          { zoom: 25 },
          {
            zoom: this.$viewport.isMobile ? 8 : 12,
            duration: 1.25,
            ease: 'power2.inOut',
            onUpdate: () => {
              camera.updateProjectionMatrix()
            },
          },
          'step-0'
        )

        .addLabel('step-1', '<10%')
        .fromTo(
          this.$el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'step-1'
        )
        .fromTo(
          layerPass.material.uniforms.uOpacity,
          {
            value: 1,
          },
          {
            value: 0,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'step-1'
        )
    },
    disappearExterior() {
      const { layerPass, camera } = useWebGL()

      const params = {
        duration: 1.65,
        ease: 'power3.inOut',
      }

      gsap
        .timeline({
          delay: 0.35,
          onComplete: () => {
            this.appearInterior()
          },
        })
        .addLabel('step-0')
        .fromTo(
          this.$el,
          {
            opacity: 1,
          },
          {
            opacity: 0,
            duration: 1,
            ease: 'power3.inOut',
          },
          'step-0'
        )
        .to(
          camera.position,
          {
            y: 122,
            ...params,
          },
          'step-0'
        )
        .to(
          camera,
          {
            zoom: 35,
            ...params,
            onUpdate: () => {
              camera.updateProjectionMatrix()
            },
          },
          'step-0'
        )
        .addLabel('step-1', '<25%')
        .fromTo(
          layerPass.material.uniforms.uOpacity,
          {
            value: 0,
          },
          {
            value: 1,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'step-1'
        )
    },
    onEnterArena() {
      this.transitionedToInterior = true
      this.setAllowScroll(false)
      this.setAppCursor('initial')
      this.disappearExterior()
    },
    onToggle(self) {
      if (!this.allLoadedFake) return

      if (
        this.$route.params.enterArena ||
        this.transitionedToInterior ||
        this.$viewport.isMobile
      ) {
        this.setInteriorVisible(self.isActive)

        if (self.isActive) {
          const state =
            this.interiorInitialState === this.interiorIndexFloor ||
            !this.alreadyAppearedOnce
              ? this.interiorInitialState
              : this.interiorIndexFloor

          this.setInteriorIndexFloor({
            id: state.id,
            focus: state.focus === null || !state.focus ? null : state.focus,
            immediate: true,
          })

          this.alreadyAppearedOnce = true
        }
      } else if (
        !this.transitionedToInterior ||
        !this.$route.params.enterArena ||
        !this.$viewport.isMobile
      ) {
        this.setExteriorFullscreen(self.isActive)

        if (self.isActive) {
          this.initExteriorView()
        } else {
          const { exterior } = useWebGL()

          exterior.drag.enabled = false
          this.setExteriorVisible(self.isActive)
        }
      }
    },
    scrollHero() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-arena-paris-basket-club', {
        duration: 1.2,
      })
    },
    initInteriorView() {
      this.$nuxt.$emit('reset:interior')
    },
    initExteriorView() {
      const { exterior } = useWebGL()
      exterior.drag.enabled = true
      this.setInteriorVisible(false)

      this.$nuxt.$emit('reset:exterior')
    },
    onFrame() {
      if (
        !window.lenis &&
        (!this.interiorVisible || !this.exteriorVisible) &&
        !this.scrollTrigger.isActive
      )
        return

      const { interior, exterior, camera, scissors, renderer } = useWebGL()
      if (!this.$refs.frame) return

      if (this.webglInFlow) {
        const mount = this.$refs.webglMount || this.$refs.frame
        const w = Math.max(1, mount.clientWidth || 0)
        const h = Math.max(1, mount.clientHeight || 0)

        if (this.interiorVisible) interior.position.y = 0
        if (this.exteriorVisible) exterior.position.y = 0

        scissors.current = { x: 0, y: 0, width: w, height: h }
        renderer.setScissor(0, 0, w, h)
        renderer.setViewport(0, 0, w, h)

        const canvas = renderer.domElement
        if (canvas) {
          canvas.style.width = '100%'
          canvas.style.height = '100%'
          canvas.style.left = '0'
          canvas.style.top = '0'
        }
        return
      }

      const rect = this.$refs.frame.getBoundingClientRect()
      const viewportW = this.$viewport.width
      const viewportH = this.$viewport.height
      const _scroll = window.lenis?.scroll ? window.lenis.scroll : window.scrollY

      const x1 = Math.max(0, Math.floor(rect.left))
      const y1 = Math.max(0, Math.floor(rect.top))
      const x2 = Math.min(viewportW, Math.ceil(rect.right))
      const y2 = Math.min(viewportH, Math.ceil(rect.bottom))
      const width = Math.max(0, x2 - x1)
      const height = Math.max(0, y2 - y1)
      const scissorY = viewportH - y2

      if (this.interiorVisible || this.exteriorVisible) {
        if (this.interiorVisible) {
          interior.position.y = _scroll / (camera.zoom - camera.zoom * 0.125)
        }

        if (this.exteriorVisible) {
          exterior.position.y = _scroll / (camera.zoom - camera.zoom * 0.125)
        }

        scissors.current = { x: x1, y: scissorY, width, height }

        renderer.setScissor(
          scissors.current.x,
          scissors.current.y,
          scissors.current.width,
          scissors.current.height
        )
        renderer.setViewport(
          scissors.current.x,
          scissors.current.y,
          scissors.current.width,
          scissors.current.height
        )
      }
    },
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
      setExteriorFullscreen: 'setExteriorFullscreen',
      setInteriorVisible: 'setInteriorVisible',
      setInteriorIndexFloor: 'setInteriorIndexFloor',
      setAllowScroll: 'setAllowScroll',
      setAppCursor: 'setAppCursor',
    }),
  },
}
</script>

<style lang="scss">
.app-arena-hero {
  height: 100vh;
  padding: var(--layout-margin);
  position: relative;

  @include mobile {
    height: calc(100 * var(--vh, 1vh));
  }

  &__wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__webgl {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    contain: paint;
    isolation: isolate;

    canvas {
      position: absolute !important;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
