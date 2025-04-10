<template>
  <div :data-allow-drag="true" class="app-business-map__webview__container" id="app-business-map">
    <div :data-allow-drag="true" class="app-business-map__webview__container__wrapper">
      <AtomsCornerPoints :size-points="12" />
      <EInteriorZoneInformations />
      <EInteriorInteractions />
      <EHeroInstructions
        :class="{
          hide: hideInstructions || !instructionsWebglVisible,
        }"
      />
      <EInteriorFloorSelectorMobile />
      <EScrollIndicator @click.native="scrollHero()" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      hideInstructions: true,
    }
  },
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      allLoadedActual: (state) => state.allLoadedActual,
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      instructionsWebglVisible: (state) => state.instructionsWebglVisible,
      interiorTimelineFloorsInProgress: (state) =>
        state.interiorTimelineFloorsInProgress,
    }),
  },

  watch: {
    allLoadedFake(newVal) {
      if (!newVal) return

      this.initInteriorView(2200)
      this.onToggle(this.scrollTrigger)
    },
    initialHeroDisplayed() {
      this.setAllowScroll(true)
    },
    interiorTimelineFloorsInProgress(newVal) {
      if (!newVal && this.instructionsWebglVisible) {
        this.hideInstructions = false
      }
    },
  },
  mounted() {
    if (this.allLoadedFake) {
      this.initInteriorView(900)
      this.setAllowScroll(true)
    }

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.$el,
      start: 'top bottom',
      end: 'bottom+=25% top',
      onToggle: (self) => this.onToggle(self),
    })

    setTimeout(() => {
      this.setMapPosition()
    }, 300)

    window.addEventListener('resize', this.setMapPosition)
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()

    window.removeEventListener('resize', this.setMapPosition)

    gsap.set('.app-webgl', {
      position: 'fixed',
      top: 0
    })
  },
  methods: {
    onToggle(self) {
      if (!this.allLoadedFake) return

      this.setInteriorVisible(self.isActive)
    },
    setMapPosition() {
      gsap.set('.app-webgl', {
        position: 'absolute',
        top: document.querySelector('.app-business-map__webview').offsetTop
      })
    },
    scrollHero() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-business-experience', {
        duration: 1.2,
      })
    },
    initInteriorView(delay) {
      this.$nuxt.$emit('reset:interior')

      this.setInteriorIndexFloor({ id: 0, immediate: true })

      setTimeout(() => {
        this.setInteriorIndexFloor({ id: 4, immediate: false })
      }, delay)
    },
    ...mapMutations({
      setInteriorVisible: 'setInteriorVisible',
      setExteriorFullscreen: 'setExteriorFullscreen',
      setInteriorIndexFloor: 'setInteriorIndexFloor',
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-business-map__webview__container {
  height: 100vH;
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
