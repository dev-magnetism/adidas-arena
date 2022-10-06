<template>
  <div class="app-element-slider">
    <div class="app-element-slider__heading grid-inner">
      <TH1 class="app-element-slider__heading__title"
        >Lorem IPSUM DOLOR SIT AMET</TH1
      >

      <div class="app-element-slider__heading__spaces">
        <TH1 class="app-element-slider__heading__spaces__total">XX</TH1>
        <TH4 class="app-element-slider__heading__spaces__text" weight="medium"
          >Espaces</TH4
        >
      </div>
    </div>

    <div ref="inner" class="app-element-slider__wrapper">
      <div class="app-element-slider__inner">
        <div
          v-for="i in 15"
          :key="i"
          ref="items"
          class="app-element-slider__item"
        >
          <div class="app-element-slider__item__wrapper-visual">
            <nuxt-picture
              class="app-element-slider__item__visual"
              src="imgs/placeholder.png"
              format="webp"
              alt="placeholder"
            />
          </div>

          <div class="app-element-slider__item__content">
            <TH4 class="app-element-slider__item__content__title">SKYBAR</TH4>
            <TP2 class="app-element-slider__item__content__text"
              >Situé en face de la scène – ou dans la longueur du terrain en
              configuration basket – le SkyBar est un grand espace de 150
              m2.</TP2
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmblaCarousel from 'embla-carousel'

import useGUI from '~/hooks/gui'

export default {
  data() {
    return {
      parallaxFactor: 2.5,
    }
  },
  mounted() {
    this.embla = EmblaCarousel(this.$refs.inner, {
      skipSnaps: true,
      align: 'start',
      slidesToScroll: 1,
      speed: 12,
      inViewThreshold: 1,
    })

    this.embla.on('init', this.setParallax)
    this.embla.on('scroll', this.setParallax)
    this.embla.on('resize', this.setParallax)

    // this.initGUI()
  },
  beforeDestroy() {
    this.embla.off('init', this.setParallax)
    this.embla.off('scroll', this.setParallax)
    this.embla.off('resize', this.setParallax)

    this.embla?.destroy()

    this.gui?.dispose()
  },
  methods: {
    calculateParallaxTransforms() {
      const engine = this.embla.internalEngine()
      const scrollProgress = this.embla.scrollProgress()

      return this.embla.scrollSnapList().map((scrollSnap, index) => {
        if (!this.embla.slidesInView().includes(index)) return 0
        let diffToTarget = scrollSnap - scrollProgress

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.getTarget()
            if (index === loopItem.index && target !== 0) {
              const sign = Math.sign(target)
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          })
        }
        return diffToTarget * (-1 / this.parallaxFactor) * 100
      })
    },
    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Slider` })

      this.gui
        .addInput(this, 'parallaxFactor', {
          min: 1,
          max: 5,
          step: 0.1,
          label: 'Parallax factor',
        })
        .on('change', (e) => {
          this.parallaxFactor = e.value
          this.setParallax()
        })
    },
    setParallax() {
      const slides = this.embla.slideNodes()
      const layers = slides.map((s) =>
        s.querySelector('.app-element-slider__item__visual')
      )
      const parallaxTransforms = this.calculateParallaxTransforms(this.embla)

      parallaxTransforms.forEach((transform, index) => {
        layers[index].style.transform = `translateX(${transform}%)`
      })
    },
  },
}
</script>

<style lang="scss">
.app-element-slider {
  &__wrapper {
    overflow: hidden;
    padding-left: desktop-vw(40px);
  }

  &__heading {
    margin-bottom: desktop-vw(70px);

    &__title.H1 {
      grid-column: 1 / span 6;
    }
    &__spaces {
      grid-column: 11 / span 1;
      align-self: center;

      &__text.H4 {
        font-size: desktop-vw(24px);
        line-height: desktop-vw(24px);

        opacity: 0.25;
      }
    }
  }

  &__inner {
    display: inline-flex;
    column-gap: var(--layout-columns-gap);
    flex-direction: row;
    will-change: transform;
  }

  &__item {
    width: desktop-vw(640px);
    display: flex;
    flex-direction: column;

    &__content {
      margin-top: desktop-vw(40px);
      display: flex;
      flex-direction: row;
      align-items: center;

      &__title.H4 {
        margin-right: desktop-vw(100px);
        font-size: desktop-vw(48px);
        line-height: desktop-vw(62px);
      }
      &__text.P2 {
        width: 60%;
      }
    }

    &__wrapper-visual {
      aspect-ratio: 670 / 680;
      display: block;
      width: 100%;
      height: auto;
      position: relative;
      overflow: hidden;
    }

    &__visual {
      @include noise();
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      // transition: transform 0.2s linear;
      will-change: transform;

      img {
        transform: scale(1.25);
      }
    }
  }
}
</style>
