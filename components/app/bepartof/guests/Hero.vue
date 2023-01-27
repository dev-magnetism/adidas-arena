<template>
  <div class="app-guests-hero">
    <div class="app-guests-hero__wrapper">
      <AtomsCornerPoints :size-points="12" />
    </div>
  </div>
</template>

<script>
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

// import useWebGL from '~/hooks/webgl'

export default {
  computed: {
    ...mapState({
      exteriorVisible: (state) => state.exteriorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
    }),
  },
  watch: {
    // allLoadedFake() {
    //   const { exterior } = useWebGL()
    //   exterior.drag.enabled = true
    //   exterior.zoom.enabled = false
    //   this.setExteriorVisible(true)
    // },
  },
  mounted() {
    // if (!this.exteriorVisible) this.setExteriorVisible(true)
    // this.setExteriorFullwidth(true)
    // const { scissors, renderer, exterior } = useWebGL()
    // scissors.current = { ...scissors.hero }
    // renderer.setScissor(
    //   scissors.current.x,
    //   scissors.current.y,
    //   scissors.current.width,
    //   scissors.current.height
    // )
    // exterior.position.set(0, 0, 0)
    // ScrollTrigger.create({
    //   trigger: this.$el,
    //   start: 'top bottom',
    //   end: 'bottom+=25% top',
    //   onToggle: (self) => this.setExteriorVisible(self.isActive),
    // })
    // this.$viewport.events.on('resize', this.onResize)
    // this.$raf.add(`guests-hero`, this.onFrame)
  },
  beforeDestroy() {
    // this.$viewport.events.off('resize', this.onResize)
    // this.$raf.remove(`guests-hero`, this.onFrame)
  },
  methods: {
    // onResize() {
    //   const { scissors } = useWebGL()

    //   scissors.current.x = scissors.hero.x
    //   scissors.current.width = scissors.hero.width
    //   scissors.current.height = scissors.hero.height
    // },
    // onFrame() {
    //   if (!window.lenis && !this.exteriorVisible) return

    //   const { exterior, camera, scissors, renderer } = useWebGL()

    //   exterior.position.y =
    //     window.lenis.scroll / (camera.zoom - camera.zoom * 0.125)

    //   scissors.current.y = window.lenis.scroll + scissors.hero?.y

    //   renderer.setScissor(
    //     scissors.current.x,
    //     scissors.current.y,
    //     scissors.current.width,
    //     scissors.current.height
    //   )
    // },
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
      setExteriorFullwidth: 'setExteriorFullwidth',
    }),
  },
}
</script>

<style lang="scss">
.app-guests-hero {
  height: 100vh;
  padding: var(--layout-margin);
  position: relative;

  &__wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
