<template>
  <div :data-allow-drag="true" class="app-arena-hero">
    <div :data-allow-drag="true" class="app-arena-hero__wrapper">
      <AtomsCornerPoints :size-points="12" />
      <!-- <EHeroInstructions /> -->
      <EInteriorZoneInformations />
      <EInteriorInteractions />
      <EInteriorFloorSelectorMobile />
      <EScrollIndicator @click.native="scrollHero()" />
    </div>
  </div>
</template>

<script>
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  data() {
    return {
      alreadyAppearedOnce: false,
      interiorInitialState: { id: 4, immediate: true },
    }
  },
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
  },
  watch: {
    allLoadedFake(newVal) {
      if (!newVal) return

      this.initInteriorView()
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
      this.initInteriorView()
    }

    this.$viewport.events.on('resize', this.onResize)
    this.$raf.add(`arena-hero`, this.onFrame)
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()

    this.$viewport.events.off('resize', this.onResize)
    this.$raf.remove(`arena-hero`, this.onFrame)
  },
  methods: {
    onToggle(self) {
      if (!this.allLoadedFake) return

      this.setInteriorVisible(self.isActive)

      if (self.isActive) {
        this.onResize()

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
    onResize() {
      if (!this.interiorVisible && !this.scrollTrigger.isActive) return

      const { scissors, renderer } = useWebGL()

      scissors.current = { ...scissors.hero }

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    onFrame() {
      if (!window.lenis || !this.interiorVisible) return

      const { interior, camera, scissors, renderer } = useWebGL()

      interior.position.y =
        window.lenis.scroll / (camera.zoom - camera.zoom * 0.125)

      scissors.current.y = window.lenis.scroll + scissors.hero?.y

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    ...mapMutations({
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
