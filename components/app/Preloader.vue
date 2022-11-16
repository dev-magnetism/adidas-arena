<template>
  <div :class="{ visible: !allLoadedTimeline }" class="app-preloader-layer">
    <!-- <div :class="{ visible: !allLoaded }" class="app-preloader-layer"> -->
    <div class="app-preloader-layer__informations">
      <p class="app-preloader-layer__informations__number left">
        {{ progressUIFormated }}
      </p>
      <div class="app-preloader-layer__bar">
        <div ref="barFront" class="app-preloader-layer__bar-front" />
      </div>
      <p class="app-preloader-layer__informations__number right">100</p>
    </div>
    <TH1 weight="bold" class="app-preloader-layer__title">Chargement</TH1>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { gsap } from 'gsap'

import loaderManager from '~/assets/js/loaderManager'

export default {
  data() {
    return {
      progressUI: 0,
    }
  },
  computed: {
    progressUIFormated() {
      // return ('0' + this.progressUI).slice(-2) // 00
      return ('00' + this.progressUI).slice(-3)
    },
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
      allLoadedTimeline: (state) => state.allLoadedTimeline,
      allLoaded: (state) => state.allLoaded,
    }),
  },
  watch: {},
  created() {},
  mounted() {
    this.tl = gsap.timeline({
      delay: 2,
      onUpdate: () => {
        this.progressUI = Math.round(this.tl.progress() * 100)
      },
      onComplete: () => {
        this.setAllLoadedTimeline(true)
      },
    })

    loaderManager.load(
      [
        { id: 'exterior', path: '/models/exterior.gltf' },
        { id: 'cloud', path: '/models/cloud.gltf' },
      ],
      this.onProgress,
      this.onComplete
    )
  },

  beforeDestroy() {
    this.tl?.clear()
  },

  methods: {
    onProgress({ normalized }, id) {
      this.tl.to(this.$refs.barFront, {
        scaleX: normalized,
        duration: 0.5,
      })

      if (id === 'exterior') {
        this.setModelExteriorLoaded(true)
      } else if (id === 'cloud') {
        this.setModelCloudLoaded(true)
      }
    },
    onComplete() {
      this.setAllLoaded(true)
    },
    loadingComplete() {
      this.tl.to(this.$refs.barFront, {
        scaleX: 1,
        duration: 3,
      })

      this.setModelExteriorLoaded(true)
      this.setModelCloudLoaded(true)
      this.setAllLoaded(true)
    },
    ...mapMutations({
      setAllLoadedTimeline: 'setAllLoadedTimeline',
      setAllLoaded: 'setAllLoaded',
      setModelExteriorLoaded: 'setModelExteriorLoaded',
      setModelCloudLoaded: 'setModelCloudLoaded',
    }),
  },
}
</script>

<style lang="scss">
.app-preloader-layer {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: var(--c-beige);
  z-index: 999;
  overflow: hidden;
  transform: translate3d(0, -100%, 0);
  transition: transform 2.5s var(--ease-out-expo);
  transition-delay: 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: end;

  &__informations {
    display: flex;
    justify-content: center;
    margin-bottom: desktop-vw(50px);
    align-items: center;

    &__number {
      width: desktop-vw(52px);
      @include font-tuskerGrotesk-medium();
      font-size: desktop-vw(42px);
      line-height: desktop-vw(42px);

      &.left {
        text-align: right;
      }
      &.right {
        text-align: left;
      }
    }
  }

  &__bar {
    width: desktop-vw(250px);
    height: 2px;
    background: var(--c-black);
    margin: 0px desktop-vw(30px);
    position: relative;
  }

  &__bar-front {
    position: absolute;
    left: 0;
    width: 100%;
    margin: 0;
    background: var(--c-red-adidas);
    top: 0;
    height: 100%;
    transform: scaleX(0);
    transform-origin: left center;
  }

  &__title.H1 {
    text-align: center;
  }

  &.visible {
    transform: translate3d(0, 0%, 0);
  }
}
</style>
