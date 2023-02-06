<template>
  <div class="app-arena-hero">
    <div class="app-arena-hero__wrapper">
      <AtomsCornerPoints :size-points="12" />
      <EFloorSelector />
      <EFloorSelectorMobile />
      <ESceneSelector />
      <ELegendZones />
      <EScrollIndicator @click.native="scrollHero()" />
      <EInteriorTags />
    </div>
  </div>
</template>

<script>
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
    }),
  },
  watch: {
    allLoadedFake() {
      this.initInteriorView()
    },
  },
  mounted() {
    if (this.allLoadedFake) {
      this.initInteriorView()
    }

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.$el,
      start: 'top bottom',
      end: 'bottom+=25% top',
      onToggle: (self) => this.setInteriorVisible(self.isActive),
    })

    this.$viewport.events.on('resize', this.onResize)
    this.$raf.add(`arena-hero`, this.onFrame)
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()

    this.$viewport.events.off('resize', this.onResize)
    this.$raf.remove(`arena-hero`, this.onFrame)
  },
  methods: {
    scrollHero() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-arena-paris-basket-club', {
        duration: 1.2,
      })
    },
    initInteriorView() {
      this.$nuxt.$emit('reset:interior')

      this.setInteriorIndexFloor({ id: 4, immediate: true })

      this.onResize()
    },
    onResize() {
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
      if (!window.lenis && !this.interiorVisible) return

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
