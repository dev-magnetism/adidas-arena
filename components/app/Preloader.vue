<template>
  <div
    :class="{ invisible: !fontsLoaded, visible: !allLoadedTimeline }"
    class="app-preloader"
  >
    <div ref="video" class="app-preloader__video" />

    <video src="/videos/preloader.mp4"></video>

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
    <div ref="layerBlue" class="app-preloader__layer blue" />
    <div ref="layerRed" class="app-preloader__layer red" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import loaderManager from '~/assets/js/loaderManager'

import useWebGL from '~/hooks/webgl'

import vertexShader from '~/assets/webgl/preloader/vertex.glsl'
import fragmentShader from '~/assets/webgl/preloader/fragment.glsl'

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
      if (!payload) return

      // this.initPreloaderVideo()
      this.loadModels()
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

    if (!this.fontsLoaded) {
      this.loadFonts()
    }
  },

  beforeDestroy() {
    // const { preloader } = useWebGL()

    // preloader.remove(this.meshVideo)

    this.resizeObserver.unobserve(this.$refs.video)

    this.tl?.kill()
  },

  methods: {
    loadFonts() {
      const FontFaceObserver = require('fontfaceobserver')

      const fontData = {
        'TuskerGrotesk-Bold': { weight: 400 },
        'TuskerGrotesk-Medium': { weight: 400 },
        'AdihausDIN Cn Bold': { weight: 400 },
        'AdihausDIN Bold': { weight: 400 },
        'AdihausDIN Medium': { weight: 400 },
        AdihausDIN: { weight: 400 },
      }

      const observers = []

      Object.keys(fontData).forEach((family) => {
        const data = fontData[family]
        const obs = new FontFaceObserver(family, data)
        observers.push(obs.load())
      })

      Promise.all(observers)
        .then((fonts) => {
          this.setFontsLoaded(true)
          ScrollTrigger.refresh()
        })
        .catch((err) => {
          console.warn('Some critical font are not available:', err)
        })
    },
    onResizeVideo(entries) {
      const contentRect = entries[0].contentRect

      this.meshVideo.scale.set(contentRect.width, contentRect.height, 1)

      this.meshVideo.material.uniforms.uRatio.value = new THREE.Vector2(
        this.textureVideo.image.videoWidth,
        this.textureVideo.image.videoHeight
      )

      this.meshVideo.material.uniforms.uResolutionEl.value = new THREE.Vector2(
        contentRect.width,
        contentRect.height
      )

      // console.log('resize', contentRect)
    },
    async initPreloaderVideo() {
      const { preloader } = useWebGL()
      const geometry = new THREE.PlaneGeometry(1, 1, 1)

      this.textureVideo = await this.loadVideo('/videos/preloader.mp4')

      const materialVideo = new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: {
            value: 0,
          },
          uMap: {
            value: this.textureVideo,
          },
          uRatio: {
            value: new THREE.Vector2(0, 0),
          },
          uResolutionEl: {
            value: new THREE.Vector2(0, 0),
          },
        },
        vertexShader,
        fragmentShader,
      })

      this.meshVideo = new THREE.Mesh(geometry, materialVideo)

      preloader.add(this.meshVideo)

      gsap.to(this.meshVideo.material.uniforms.uOpacity, {
        value: 1,
        duration: 5,
      })

      this.resizeObserver = new ResizeObserver(this.onResizeVideo)

      this.resizeObserver.observe(this.$refs.video)
    },
    loadModels() {
      loaderManager.load(
        [
          { id: 'exterior', path: '/models/exterior.gltf' },
          { id: 'cloud', path: '/models/cloud.gltf' },
        ],
        this.onProgressLoader,
        this.onCompleteLoader
      )
    },

    onProgressLoader({ normalized }, id) {
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

    onCompleteLoader() {
      this.tl.to(this.$refs.layerBlue, {
        scaleY: 1,
      })
      this.tl.to(this.$refs.layerRed, {
        scaleY: 1,
      })
      this.setAllLoaded(true)
    },

    ...mapMutations({
      setAllLoadedTimeline: 'setAllLoadedTimeline',
      setAllLoaded: 'setAllLoaded',
      setModelExteriorLoaded: 'setModelExteriorLoaded',
      setModelCloudLoaded: 'setModelCloudLoaded',
      setFontsLoaded: 'setFontsLoaded',
    }),
    loadVideo(src) {
      return new Promise((resolve) => {
        const video = document.createElement('video')

        video.src = src
        video.crossOrigin = 'anonymous'
        video.muted = true
        video.playsInline = true
        video.loop = true
        video.autoplay = false

        video.onloadeddata = () => {
          const texture = new THREE.VideoTexture(video)
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          texture.needsUpdate = true
          texture.image.play()

          // this.texture.image.pause()
          // this.texture.image.currentTime = 0

          resolve(texture)
        }
      })
    },
    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
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
  // transform: translate3d(0, -100%, 0);
  transition: transform 2.5s var(--ease-out-expo);
  transition-delay: 0.5s;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  &__video {
    height: auto;
    max-height: 75%;
    width: 25%;
    aspect-ratio: 350 / 620;
    opacity: 0;
    pointer-events: none;
  }

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
    transform-origin: center top;

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
