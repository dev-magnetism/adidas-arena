<template>
  <div :data-allow-drag="true" class="app-arena-hero">
    <div :data-allow-drag="true" class="app-arena-hero__wrapper grid">
      <EEnterArena
        :class="{
          hide: !exteriorVisible || !exteriorArenaHovered || !exteriorFullwidth,
        }"
        @onEnterArena="onEnterArena"
      />
      <AtomsCornerPoints :size-points="12" />
      <!-- <EHeroInstructions /> -->
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
      exteriorFullwidth: (state) => state.exteriorFullwidth,
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

    this.$raf.add(`arena-hero`, this.onFrame)
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()

    this.$raf.remove(`arena-hero`, this.onFrame)
  },
  methods: {
    appearInterior() {
      const { layerPass, camera } = useWebGL()

      this.initInteriorView()
      this.onToggle(this.scrollTrigger)
      this.setExteriorVisible(false)
      this.setExteriorFullwidth(false)

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
      } else {
        this.setExteriorFullwidth(self.isActive)

        if (self.isActive) {
          this.initExteriorView()
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

      if (this.interiorVisible) {
        interior.position.y =
          window.lenis.scroll / (camera.zoom - camera.zoom * 0.125)
      }

      if (this.exteriorVisible) {
        exterior.position.y =
          window.lenis.scroll / (camera.zoom - camera.zoom * 0.125)
      }

      scissors.current = { ...scissors.hero }

      scissors.current.y = window.lenis.scroll + scissors.hero?.y

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
      setExteriorFullwidth: 'setExteriorFullwidth',
      setInteriorVisible: 'setInteriorVisible',
      setInteriorIndexFloor: 'setInteriorIndexFloor',
      setAllowScroll: 'setAllowScroll',
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
}
</style>
