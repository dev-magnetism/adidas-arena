<template>
  <div
    :class="{ invisible: !fontsLoaded, visible: !allLoadedTimeline }"
    class="app-preloader"
  >
    <!-- <div class="app-preloader__informations">
      <p class="app-preloader__informations__number left">
        {{ progressUIFormated }}
      </p>
      <div class="app-preloader__bar">
        <div ref="barFront" class="app-preloader__bar-front" />
      </div>
      <p class="app-preloader__informations__number right">100</p>
    </div>
    <TH1 weight="bold" class="app-preloader__title">Chargements</TH1> -->
    <TH1 class="app-preloader__progress" weight="bold">
      {{ progressUIFormated }}
    </TH1>
    <div class="app-preloader__layer blue" />
    <div class="app-preloader__layer red" />
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
      tweenValue: 0,
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
  watch: {
    fontsLoaded(payload) {
      if (payload) this.loadModels()
    },
  },
  created() {},
  mounted() {
    this.tl = gsap.timeline({
      delay: 1,
      onUpdate: () => {
        this.progressUI = Math.round(this.tl.progress() * 100)
      },
      onComplete: () => {
        this.setAllLoadedTimeline(true)
      },
    })
  },

  beforeDestroy() {
    this.tl?.kill()
  },

  methods: {
    loadModels() {
      loaderManager.load(
        [
          { id: 'exterior', path: '/models/exterior.gltf' },
          { id: 'cloud', path: '/models/cloud.gltf' },
        ],
        this.onProgress,
        this.onComplete
      )
    },
    onProgress({ normalized }, id) {
      this.tl.to(this, {
        tweenValue: normalized,
        duration: this.randomIntFromInterval(2, 4),
        ease: 'power3.inOut',
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

    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
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
.app-preloader {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: var(--c-beige);
  z-index: 999;
  overflow: hidden;
  transform: translate3d(0, -100%, 0);
  transition: transform 2.5s var(--ease-out-expo);
  transition-delay: 0.5s;
  // display: flex;
  // flex-direction: column;
  // justify-content: end;

  &.invisible {
    .app-preloader__informations,
    .app-preloader__title,
    .app-preloader__progress.H1 {
      opacity: 0;
    }
  }

  &__layer {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    transform: scaleY(0);
    transform-origin: center bottom;

    &.red {
      background: var(--c-red-adidas);
    }
    &.blue {
      background: var(--c-blue-adidas);
    }
  }

  &__progress.H1 {
    position: absolute;
    bottom: desktop-vw(30px);
    right: desktop-vw(40px);
  }

  &__informations,
  &__title,
  &__progress.H1 {
    opacity: 1;
    transition: opacity 0.85s 0.65s var(--ease-out-expo);
  }

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
