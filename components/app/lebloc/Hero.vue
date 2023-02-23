<template>
  <div :data-allow-drag="true" class="app-le-bloc-hero">
    <div :data-allow-drag="true" class="app-le-bloc-hero__wrapper">
      <AtomsCornerPoints :size-points="$viewport.isMobile ? 6 : 12" />
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
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
  },
  watch: {
    allLoadedFake() {
      this.initInteriorView()
    },
    initialHeroDisplayed() {
      this.setAllowScroll(true)
    },
  },
  mounted() {
    if (this.allLoadedFake) {
      this.initInteriorView()
      this.setAllowScroll(true)
    }

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.$el,
      start: 'top bottom',
      end: 'bottom+=25% top',
      onToggle: (self) => this.setInteriorVisible(self.isActive),
    })

    this.$viewport.events.on('resize', this.onResize)
    this.$raf.add(`le-bloc-hero`, this.onFrame)
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()

    this.$viewport.events.off('resize', this.onResize)
    this.$raf.remove(`le-bloc-hero`, this.onFrame)
  },
  methods: {
    scrollHero() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-two-columns-stick', {
        duration: 1.2,
      })
    },
    initInteriorView() {
      this.$nuxt.$emit('reset:interior')

      this.setInteriorIndexFloor({
        id: 2,
        focus: 'PUBLIC_Cantine',
        immediate: true,
      })

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
.app-le-bloc-hero {
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
