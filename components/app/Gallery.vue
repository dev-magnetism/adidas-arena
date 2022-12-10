<template>
  <div class="app-arena-gallery">
    <TH2 weight="bold" class="app-arena-gallery__title">Galerie</TH2>
    <div class="app-arena-gallery__pictures">
      <AppGalleryPicture
        v-for="(item, index) in contents.items"
        :key="index"
        ref="pictures"
        :index="index"
        :src="item.picture"
        format="webp"
        :alt="item.picture_alt"
        @test="onTest"
      />
    </div>
  </div>
</template>

<script>
import { InteractionManager } from 'three.interactive'

import { Observer } from 'gsap/Observer'

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
        // ease: 0.04,
        ease: 1,
        current: 0,
        target: 0,
        last: 0,
        speed: 0.8,
        wheelSpeed: 1,
        // wheelSpeed: 4,
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

    // this.$refs.pictures.forEach((element) => {
    //   console.log(element.$el.getBoundingClientRect())
    //   console.log(element.boundingRect.left)
    // })

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
    onTest(index) {
      console.log('here', index)
      const test = Math.min(
        ...this.$refs.pictures.map(
          (el) => el.boundingRect.xThree - el.boundingRect.width / 2
        )
      )
      console.log(test)

      const testbis = Math.max(
        ...this.$refs.pictures.map(
          (el) => el.boundingRect.xThree + el.boundingRect.width / 2
        )
      )
      console.log(testbis)
    },
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
      // if (!this.pictureIsSelected) {
      // if (this.directionDrag === 'x') this.scroll.target += this.scroll.speed
      // else this.scroll.target -= this.scroll.speed
      // } else {
      // this.scroll.target = this.scroll.last
      // }

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
        min: 0.1,
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
    left: 50%;
    height: 100%;
    transform: translate(-50%, 0px);
    grid-template-columns: repeat(36, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
    display: grid;
  }

  &__title.H2 {
    font-size: desktop-vw(290px);
    line-height: desktop-vw(400px);
    pointer-events: none;
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
