<template>
  <div class="app-arena-gallery">
    <div class="app-arena-gallery__inner">
      <TH1 weight="bold" class="app-arena-gallery__title">Gallerie</TH1>
    </div>
    <div class="app-arena-gallery__pictures">
      <AppArenaGalleryPicture
        v-for="i in 25"
        :key="i"
        ref="pictures"
        :index="i - 1"
        src="imgs/placeholder.png"
        format="webp"
        :alt="`placeholder-${i}`"
      />
    </div>
    <span ref="target" class="app-arena-gallery__target" />
  </div>
</template>

<script>
import { InteractionManager } from 'three.interactive'

import { Observer } from 'gsap/Observer'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

export default {
  data() {
    return {
      scroll: {
        ease: 0.065,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        wheelSpeed: 3,
      },
      pictureIsSelected: false,
      pictureSelected: null,
      pictureIndexSelected: null,
      onDrag: false,
      directionDrag: 'x',
    }
  },
  mounted() {
    this.observer = Observer.create({
      target: this.$el,
      type: 'touch,pointer',
      onDrag: this.onScrollObserver,
      onDragStart: () => {
        this.onDrag = true
      },
      dragMinimum: 5,
      tolerance: 5,
      onStopDelay: 0.25,
      onStop: () => {
        this.onDrag = false
      },
    })

    this.$raf.add(`arena-gallery`, this.onFrame)

    this.$nuxt.$on('app:scroll', this.onScrollApp)

    const { renderer, camera } = useWebGL()

    this.interactionManager = new InteractionManager(renderer, camera, this.$el)

    this.initGUI()
  },

  beforeDestroy() {
    this.observer.kill()

    const { gallery } = useWebGL()

    gallery.position.y = 0

    this.$raf.remove(`arena-gallery`, this.onFrame)

    this.$nuxt.$off('app:scroll', this.onScrollApp)

    this.interactionManager.dispose()

    this.gui.dispose()
  },
  methods: {
    onScrollApp({ scroll, limit, velocity, direction, progress }) {
      const { gallery } = useWebGL()

      gallery.position.y = scroll
    },

    onScrollObserver(self) {
      if (this.pictureIsSelected) return

      if (Math.sign(self.deltaX) === 1) {
        this.directionDrag = 'x'
      } else {
        this.directionDrag = '-x'
      }

      const delta = self.isDragging
        ? self.deltaX * this.scroll.wheelSpeed
        : self.deltaY

      this.scroll.target += delta * 0.5
    },

    onFrame({ deltaTime }) {
      if (!this.pictureIsSelected) {
        if (this.directionDrag === 'x') this.scroll.target += this.scroll.speed
        else this.scroll.target -= this.scroll.speed
      } else {
        this.scroll.target = this.scroll.last
      }

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
        layer.update({ scroll: this.scroll, velocity: this.observer.velocityX })
      })

      this.scroll.last = this.scroll.current
    },

    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Gallery` })

      this.gui.addInput(this.scroll, 'speed', {
        min: 1,
        max: 20,
        step: 0.1,
        label: 'Auto-scroll speed',
      })

      this.gui.addInput(this.scroll, 'wheelSpeed', {
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
  margin-bottom: desktop-vw(165px);
  height: desktop-vw(1440px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  // padding-bottom: desktop-vw(300px);

  &__pictures {
    width: 300vw;
    position: absolute;
    top: 0;
    left: 0;
    // background: blue;
    height: 100%;
    transform: translateX(-100vw);
    grid-template-columns: repeat(36, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
    display: grid;

    // &::after {
    //   content: '';
    //   width: 100%;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   background: blue;
    //   height: 100%;
    //   display: block;
    // }
  }

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
    z-index: 1;

    &:nth-of-type(1) {
      aspect-ratio: 215/260;
      top: desktop-vw(240px);
      grid-column: 16 / span 2;
      width: 100%;
    }
    &:nth-of-type(2) {
      aspect-ratio: 260/270;
      width: 100%;
      left: desktop-vw(50px);
      top: desktop-vw(125px);
      grid-column: 18 / span 2;
    }
    &:nth-of-type(3) {
      aspect-ratio: 410/270;
      left: desktop-vw(50px);
      top: desktop-vw(185px);
      grid-column: 22 / span 3;
      width: 100%;
    }
    &:nth-of-type(4) {
      aspect-ratio: 290/190;
      grid-column: 12 / span 3;
      width: 85%;
      left: desktop-vw(0px);
      top: desktop-vw(90px);
    }
    &:nth-of-type(5) {
      aspect-ratio: 255/170;
      top: desktop-vw(430px);
      z-index: 1;
      grid-column: 19 / span 2;
      width: 100%;
    }
    &:nth-of-type(6) {
      grid-column: 20 / span 2;
      width: 55%;
      aspect-ratio: 118/142;
      left: desktop-vw(60px);
      top: desktop-vw(380px);
      z-index: 9;
    }
    &:nth-of-type(7) {
      aspect-ratio: 230 / 135;
      grid-column: 14 / span 2;
      width: 100%;
      left: desktop-vw(70px);
      top: desktop-vw(540px);
    }
    &:nth-of-type(8) {
      width: 100%;
      aspect-ratio: 685 / 715;
      grid-column: 19 / span 6;
      bottom: desktop-vw(0px);
    }
    &:nth-of-type(9) {
      grid-column: 12 / span 3;
      width: 100%;
      aspect-ratio: 335/390;
      bottom: desktop-vw(220px);
    }
    &:nth-of-type(10) {
      width: 100%;
      grid-column: 16 / span 2;
      aspect-ratio: 230 / 190;
      bottom: desktop-vw(120px);
    }
    &:nth-of-type(11) {
      width: 100%;
      grid-column: 8 / span 3;
      aspect-ratio: 340/510;
      top: desktop-vw(300px);
    }
    &:nth-of-type(12) {
      width: 100%;
      grid-column: 6 / span 3;
      aspect-ratio: 330/225;
      top: desktop-vw(150px);
    }
    &:nth-of-type(13) {
      width: 100%;
      grid-column: 1 / span 3;
      aspect-ratio: 330/220;
      top: desktop-vw(150px);
    }
    &:nth-of-type(14) {
      width: 100%;
      grid-column: 2 / span 3;
      aspect-ratio: 330/435;
      top: desktop-vw(550px);
    }
    &:nth-of-type(15) {
      width: 100%;
      grid-column: 5 / span 3;
      aspect-ratio: 330/195;
      bottom: desktop-vw(275px);
    }
    &:nth-of-type(16) {
      width: 100%;
      grid-column: 4 / span 2;
      aspect-ratio: 215/290;
      bottom: desktop-vw(25px);
    }
    &:nth-of-type(17) {
      width: 100%;
      grid-column: 9 / span 2;
      aspect-ratio: 215/140;
      bottom: desktop-vw(165px);
    }
    &:nth-of-type(18) {
      aspect-ratio: 120 / 165;
      width: 55%;
      grid-column: 27 / span 2;
      top: desktop-vw(80px);
    }
    &:nth-of-type(19) {
      aspect-ratio: 330 / 220;
      grid-column: 29 / span 3;
      width: 100%;
      top: desktop-vw(315px);
    }
    &:nth-of-type(20) {
      width: 100%;
      aspect-ratio: 325 / 420;
      grid-column: 33 / span 3;
      top: desktop-vw(35px);
    }
    &:nth-of-type(21) {
      width: 100%;
      aspect-ratio: 330/215;
      grid-column: 26 / span 3;
      top: desktop-vw(600px);
    }
    &:nth-of-type(22) {
      width: 100%;
      aspect-ratio: 235/160;
      grid-column: 31 / span 2;
      top: desktop-vw(650px);
    }
    &:nth-of-type(23) {
      width: 100%;
      aspect-ratio: 210/275;
      grid-column: 33 / span 2;
      top: desktop-vw(680px);
      left: desktop-vw(-60px);
    }
    &:nth-of-type(24) {
      width: 100%;
      aspect-ratio: 210/275;
      grid-column: 28 / span 2;
      bottom: desktop-vw(265px);
    }
    &:nth-of-type(25) {
      width: 100%;
      aspect-ratio: 475/315;
      grid-column: 32 / span 4;
      bottom: desktop-vw(100px);
      left: desktop-vw(-60px);
    }
  }
}
</style>
