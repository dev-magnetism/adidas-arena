<template>
  <div
    :class="{ 'image-selected': imageSelected }"
    class="app-arena-gallery"
    @mouseenter="onMouseEnterGallery"
    @mouseleave="onMouseLeaveGallery"
    @click="onSelectImage($event)"
  >
    <TH2 tag="p" weight="bold" class="app-arena-gallery__title">Galerie</TH2>
    <div ref="grid" class="app-arena-gallery__pictures">
      <AppGalleryPicture
        v-for="(item, index) in contents.items"
        :key="index"
        ref="pictures"
        :index="index"
        :content="item"
      />
    </div>
  </div>
</template>

<script>
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapMutations, mapState } from 'vuex'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      scroll: {
        ease: 0.04,
        current: 0,
        target: 0,
        last: 0,
        autoSpeed: 0.8,
        speed: this.$viewport.isMobile ? 8 : 4,
      },
      directionDrag: 'x',
      leftmostImage: null,
      rightmostImage: null,
      currentIntersect: null,
      imageSelected: false,
      lastImageSelectedId: null,
      onDragProgress: false,
      galleryVisible: false,
    }
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
    }),
  },
  watch: {
    allLoadedFake(newVal) {
      if (!newVal) return

      this.onToggle(this.scrollTrigger)
    },
  },
  mounted() {
    this.observer = Observer.create({
      axis: 'x',
      target: this.$el,
      type: 'touch,pointer',
      onDrag: this.onScrollObserver,
      onStopDelay: 0.25,
      onStop: () => {
        this.onDragProgress = false
      },
      onDragStart: (e) => {
        this.onDragProgress = true

        if (e.axis === 'x') {
          this.setAllowScroll(false)
        }
      },
      onPress: () => {
        if (this.$viewport.isMobile) return

        this.setCursorSliderHold(true)
      },
      onRelease: () => {
        if (this.$viewport.isMobile) return

        this.setCursorSliderHold(false)
      },
      onDragEnd: (e) => {
        if (e.axis === 'x') {
          if (!this.$viewport.isMobile) this.setCursorSliderHold(false)
          this.setAllowScroll(true)
        }
      },
      dragMinimum: 10,
      lockAxis: true,
      tolerance: 5,
    })

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.$el,
      start: 'top-=25% bottom',
      end: 'bottom+=25% top',
      onToggle: (self) => this.onToggle(self),
    })

    if (this.scrollTrigger.isActive && this.allLoadedFake) {
      this.onToggle(this.scrollTrigger)
    }

    this.$raf.add(`arena-gallery`, this.onFrame)

    this.$viewport.events.on('resize', this.onResize)

    window.addEventListener('keyup', this.onKeyUp)

    this.initGUI()
  },

  beforeDestroy() {
    this.observer?.kill()
    this.scrollTrigger?.kill()

    this.$viewport.events.off('resize', this.onResize)

    this.$raf.remove(`arena-gallery`, this.onFrame)

    window.removeEventListener('keyup', this.onKeyUp)

    this.gui?.dispose()
  },
  methods: {
    onMouseEnterGallery() {
      if (this.imageSelected) return

      this.setCursorSliderDisabled(false)
      this.setCursorState('slider')
      this.setAppCursor('none')
    },
    onMouseLeaveGallery() {
      this.setCursorState('hide')
      this.setAppCursor('initial')
    },
    onKeyUp(e) {
      if (e.key === 'Escape') {
        if (this.imageSelected) this.onSelectImage()
      }
    },
    onResize() {
      if (!this.galleryVisible && !this.scrollTrigger.isActive) return

      this.calcEndsGrid()

      const { scissors, renderer, camera } = useWebGL()

      scissors.current = { ...scissors.fullscreen }

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )

      camera.position.set(0, 0, 500)
      camera.rotation.set(0, 0, 0)
      camera.zoom = 1

      camera.updateProjectionMatrix()
    },
    onToggle(self) {
      this.galleryVisible = self.isActive
      this.setWebglInFront(self.isActive)

      this.$refs.pictures.forEach((picture) => {
        if (!picture.texture?.isVideoTexture || !picture.content.isVideo) return

        self.isActive
          ? picture.texture?.image?.play()
          : picture.texture?.image?.pause()
      })

      this.onResize()
    },
    calcEndsGrid() {
      const gridOffset = this.$refs.grid.getBoundingClientRect().left

      this.$refs.pictures.forEach((picture) => {
        const rect = picture.$el.getBoundingClientRect()

        const position = rect.left - gridOffset

        if (!this.leftmostImage || position < this.leftmostImage.position) {
          this.leftmostImage = { picture, position }
        }

        if (
          !this.rightmostImage ||
          rect.right - gridOffset > this.rightmostImage.position
        ) {
          this.rightmostImage = { picture, position: rect.right - gridOffset }
        }
      })
    },
    onScrollObserver(self) {
      if (this.imageSelected) return

      if (Math.sign(self.deltaX) === 1) {
        this.directionDrag = 'x'
      } else {
        this.directionDrag = '-x'
      }

      const delta = self.deltaX * this.scroll.speed

      this.scroll.target += delta
    },
    onSelectImage(e) {
      if (this.onDragProgress) return

      if (this.currentIntersect && !this.imageSelected) {
        const idPicture = this.currentIntersect.object.idComponent
        const picture = this.$refs.pictures[idPicture]
        picture.open = true

        this.lastImageSelectedId = idPicture
        this.imageSelected = true

        const imagesNotSelected = this.$refs.pictures.filter(
          (picture, index) => index !== idPicture
        )

        imagesNotSelected.forEach((picture) => {
          picture.hidePicture()
        })

        this.setAllowScroll(false)
      } else if (
        (!this.currentIntersect && this.imageSelected) ||
        (this.currentIntersect && this.imageSelected)
      ) {
        const picture = this.$refs.pictures[this.lastImageSelectedId]
        picture.open = false

        const imagesNotSelected = this.$refs.pictures.filter(
          (picture, index) => index !== this.lastImageSelectedId
        )

        imagesNotSelected.forEach((picture) => {
          picture.appearPicture()
        })

        this.imageSelected = false
        this.lastImageSelectedId = null

        this.setAllowScroll(true)
      } else if (
        !this.currentIntersect &&
        !this.imageSelected &&
        !this.$viewport.isMobile
      ) {
        const isLeft = e.clientX < this.$viewport.width / 2

        if (isLeft) {
          this.scroll.target -= 500
          this.directionDrag = '-x'
        } else {
          this.scroll.target += 500
          this.directionDrag = 'x'
        }
      }
    },
    onMouseLeave() {
      if (this.imageSelected) return

      this.setAppCursor('none')
      this.setCursorState('slider')
    },
    onMouseEnter() {
      this.setCursorState('hide')
      this.setAppCursor('pointer')
    },
    onFrame() {
      if ((!this.leftmostImage && !this.rightmostImage) || !this.galleryVisible)
        return

      const { raycaster, gallery } = useWebGL()

      const intersects = raycaster.intersectObject(gallery)

      if (intersects.length) {
        if (
          (!this.currentIntersect ||
            intersects[0].object.idComponent !==
              this.currentIntersect?.object?.idComponent) &&
          !this.imageSelected
        ) {
          if (this.currentIntersect) {
            this.onMouseLeave(this.currentIntersect.object)
          }

          this.onMouseEnter(intersects[0].object)
        }

        this.currentIntersect = intersects[0]
      } else {
        if (this.currentIntersect) {
          this.onMouseLeave(this.currentIntersect.object)
        }

        this.currentIntersect = null
      }

      if (this.imageSelected) {
        this.scroll.target = this.scroll.last
      }

      if (this.directionDrag === 'x' && !this.imageSelected) {
        this.scroll.target += this.scroll.autoSpeed
      } else if (this.directionDrag === '-x' && !this.imageSelected) {
        this.scroll.target -= this.scroll.autoSpeed
      }

      this.scroll.current = this.lerp(
        this.scroll.current,
        this.scroll.target,
        this.scroll.ease
      )

      this.$refs.pictures?.forEach((layer) => {
        layer.update({
          scroll: this.scroll,
          velocity: this.observer.velocityX,
          xMin: this.leftmostImage,
          xMax: this.rightmostImage,
        })
      })

      this.scroll.last = this.scroll.current
    },

    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Gallery` })

      this.gui.addInput(this.scroll, 'autoSpeed', {
        min: 0.1,
        max: 20,
        step: 0.1,
        label: 'Auto-scroll speed',
      })

      this.gui.addInput(this.scroll, 'speed', {
        min: 1,
        max: 20,
        step: 0.1,
        label: 'Drag speed',
      })

      this.gui.addInput(this.scroll, 'ease', {
        min: 0,
        max: 0.2,
        step: 0.001,
        label: 'Drag ease',
      })
    },
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
      setWebglInFront: 'setWebglInFront',
      setCursorState: 'setCursorState',
      setCursorSliderHold: 'setCursorSliderHold',
      setCursorSliderDisabled: 'setCursorSliderDisabled',
      setAppCursor: 'setAppCursor',
    }),
    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },
  },
}
</script>

<style lang="scss">
.app-arena-gallery {
  width: 100%;
  height: desktop-vw(1440px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: desktop-vw(100px);
  overflow: hidden;

  @include mobile {
    height: mobile-vw(375px);
    margin-bottom: mobile-vw(100px);
  }

  &.image-selected {
    .app-arena-gallery__title.H2 {
      opacity: 0.35;
    }
  }

  &__pictures {
    width: 300vw;
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    transform: translate(-50%, 0px);
    grid-template-columns: repeat(36, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
    display: grid;
    pointer-events: none;
  }

  &__title.H2 {
    font-size: desktop-vw(290px);
    line-height: desktop-vw(290px);
    pointer-events: none;
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s var(--ease-in-out-cubic);

    @include mobile {
      font-size: mobile-vw(88px);
      line-height: mobile-vw(128px);
    }
  }
}
</style>
