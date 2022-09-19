<template>
  <div class="app-arena-gallery">
    <div class="app-arena-gallery__inner">
      <TH1 class="app-arena-gallery__title">Gallerie</TH1>
    </div>
    <AppArenaGalleryPicture
      v-for="i in 12"
      :key="i"
      ref="pictures"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />
    <span ref="target" class="app-arena-gallery__target" />
  </div>
</template>

<script>
import { InteractionManager } from 'three.interactive'

import { Observer } from 'gsap/Observer'

import useWebGL from '~/hooks/webgl'

export default {
  data() {
    return {
      scroll: {
        ease: this.ease || 0.065,
        current: 0,
        target: 0,
        last: 0,
        speed: 3,
        wheelSpeed: 3,
      },
    }
  },
  mounted() {
    this.observer = Observer.create({
      target: this.$el,
      type: 'wheel,touch,pointer',
      onChangeX: this.onScrollObserver,
      //   onWheel: this.onScroll,
      //   onDrag: this.onScroll,
      dragMinimum: 5,
      onStopDelay: 0.1,
      wheelSpeed: this.wheelSpeed,
      debounce: false,
    })

    this.$raf.add(`arena-gallery`, this.onFrame)

    this.$nuxt.$on('app:scroll', this.onScrollApp)

    const { renderer, camera } = useWebGL()

    this.interactionManager = new InteractionManager(renderer, camera, this.$el)
  },

  beforeDestroy() {
    this.observer.kill()

    this.$raf.remove(`arena-gallery`, this.onFrame)

    this.$nuxt.$off('app:scroll', this.onScrollApp)

    this.interactionManager.dispose()
  },
  methods: {
    onScrollApp({ scroll, limit, velocity, direction, progress }) {
      const { gallery } = useWebGL()
      gallery.position.y = scroll
    },
    onScrollObserver(self) {
      console.log(self, 'scroll')

      const delta = self.isDragging ? self.deltaX * -2 : self.deltaY
      this.scroll.target += delta * 0.5

      console.log(delta)
    },
    onFrame() {
      //   if (!this.scrollEnabled || !this.scrollTickEnabled) return

      //   this.scroll.target += this.scroll.speed

      this.scroll.current = this.lerp(
        this.scroll.current,
        this.scroll.target,
        this.scroll.ease
      )

      if (this.scroll.current > this.scroll.last) {
        this.direction = 'down'
        this.speed = this.speed * 1
      } else if (this.scroll.current < this.scroll.last) {
        this.direction = 'up'
        this.speed = this.speed * -1
      }

      this.interactionManager.update()

      this.$refs.pictures.forEach((layer) => {
        layer.update({ scroll: this.scroll })
      })

      this.scroll.last = this.scroll.current
    },
    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },
  },
}
</script>

<style lang="scss">
.app-arena-gallery {
  width: 100%;
  margin-top: desktop-vw(130px);
  margin-bottom: desktop-vw(235px);
  height: desktop-vw(1440px);
  //   min-height: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &__target {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 1px;
    height: 1px;
    background: transparent;
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
  }

  &__inner {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  &__title {
    font-size: desktop-vw(290px);
    line-height: desktop-vw(400px);
    pointer-events: none;
    user-select: none;
  }

  .app-arena-gallery-picture {
    position: absolute;

    &:nth-of-type(1) {
      aspect-ratio: 290 / 190;
      width: columns(2.85);
      left: desktop-vw(-40px);
      top: desktop-vw(30px);
    }
    &:nth-of-type(2) {
      aspect-ratio: 205 / 245;
      width: columns(2);
      left: desktop-vw(390px);
      top: desktop-vw(210px);
    }
    &:nth-of-type(3) {
      aspect-ratio: 260 / 270;
      width: columns(2.25);
      left: desktop-vw(730px);
      top: desktop-vw(0px);
    }
    &:nth-of-type(4) {
      aspect-ratio: 410 / 270;
      width: columns(4);
      left: desktop-vw(1165px);
      top: desktop-vw(185px);
    }
    &:nth-of-type(5) {
      aspect-ratio: 135 / 170;
      width: columns(1.25);
      left: desktop-vw(920px);
      top: desktop-vw(330px);
      z-index: 1;
    }
    &:nth-of-type(6) {
      aspect-ratio: 255 / 170;
      width: columns(2.25);
      left: desktop-vw(720px);
      top: desktop-vw(400px);
    }
    &:nth-of-type(7) {
      aspect-ratio: 230 / 134;
      width: columns(2.2);
      left: desktop-vw(140px);
      top: desktop-vw(540px);
    }
    &:nth-of-type(8) {
      aspect-ratio: 300 / 360;
      width: columns(2.65);
      left: desktop-vw(-30px);
      top: desktop-vw(860px);
    }
    &:nth-of-type(9) {
      aspect-ratio: 230 / 185;
      width: columns(2.25);
      left: desktop-vw(385px);
      top: desktop-vw(1130px);
    }
    &:nth-of-type(10) {
      aspect-ratio: 670 / 680;
      width: columns(6);
      right: desktop-vw(40px);
      top: desktop-vw(780px);
    }
    &:nth-of-type(11) {
      aspect-ratio: 280 / 380;
      width: columns(3);
      left: desktop-vw(-400px);
      top: desktop-vw(480px);
    }
    &:nth-of-type(12) {
      aspect-ratio: 280 / 380;
      width: columns(3);
      right: desktop-vw(-350px);
      top: desktop-vw(480px);
    }
  }
}
</style>
