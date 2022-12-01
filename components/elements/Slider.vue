<template>
  <div class="app-element-slider">
    <div class="app-element-slider__heading grid-inner">
      <ERichText
        class="app-element-slider__heading__title"
        :content="contents.title"
      />
      <div class="app-element-slider__heading__spaces">
        <div class="app-element-slider__heading__spaces__total">
          <TH1
            v-for="(char, index) in totalFinal"
            :key="index"
            ref="numbers"
            weight="bold"
            >{{ char }}</TH1
          >
        </div>

        <TH4 class="app-element-slider__heading__spaces__text" weight="medium"
          >Espaces</TH4
        >
      </div>
    </div>

    <div ref="wrapper" :class="{ hold }" class="app-element-slider__wrapper">
      <div class="app-element-slider__inner">
        <div
          v-for="(item, index) in contents.items"
          :key="index"
          ref="items"
          class="app-element-slider__item"
        >
          <div class="app-element-slider__item__wrapper-visual">
            <nuxt-picture
              provider="directus"
              class="app-element-slider__item__visual"
              :src="item.hospitalite_slider_picture"
              format="webp"
              :alt="`slider-visual-${index}`"
            />
          </div>

          <div class="app-element-slider__item__content">
            <TH4 class="app-element-slider__item__content__title">{{
              item.hospitalite_slider_title
            }}</TH4>
            <TP2 class="app-element-slider__item__content__text">
              {{ item.hospitalite_slider_paragraph }}
            </TP2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmblaCarousel from 'embla-carousel'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      parallaxFactor: 2.5,
      hold: false,
    }
  },
  computed: {
    totalFinal() {
      const value = ('0' + this.contents.items.length).slice(-2)
      return value.split('')
    },
  },
  mounted() {
    this.embla = EmblaCarousel(this.$refs.wrapper, {
      // skipSnaps: true,
      dragFree: true,
      containScroll: 'keepSnaps',
      speed: 5,
    })

    this.embla.on('init', this.setParallax)
    this.embla.on('scroll', this.setParallax)
    this.embla.on('resize', this.setParallax)
    this.embla.on('pointerUp', this.onPointerUp)
    this.embla.on('pointerDown', this.onPointerDown)
  },
  beforeDestroy() {
    this.embla.off('init', this.setParallax)
    this.embla.off('scroll', this.setParallax)
    this.embla.off('resize', this.setParallax)
    this.embla.off('pointerUp', this.onPointerUp)
    this.embla.off('pointerDown', this.onPointerDown)

    this.embla?.destroy()
  },
  methods: {
    onPointerUp() {
      this.hold = false
    },
    onPointerDown() {
      this.hold = true
    },
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
    // padding-left: desktop-vw(40px);
    // padding-right: desktop-vw(40px);

    &.hold {
      .app-element-slider__item__visual {
        img {
          transform: scale(1.35);
        }
      }
    }
  }

  &__heading {
    margin-bottom: desktop-vw(70px);
    position: relative;

    &__title {
      grid-column: 1 / span 6;
    }
    &__spaces {
      grid-column: 11 / span 1;
      align-self: center;
      position: absolute;

      &__total {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        .H1 {
          display: inline-block;

          &:first-child {
            -webkit-text-stroke: 1.5px var(--c-black);
            -webkit-text-fill-color: transparent;
          }
        }
      }

      &__text.H4 {
        font-size: desktop-vw(24px);
        line-height: desktop-vw(24px);

        opacity: 0.25;
      }
    }
  }

  &__inner {
    display: flex;
    column-gap: desktop-vw(25px);
    flex-direction: row;
    will-change: transform;
  }

  &__item {
    flex: 0 0 45%;
    display: flex;
    flex-direction: column;

    &:first-child {
      margin-left: desktop-vw(40px);
    }
    &:last-child {
      margin-right: desktop-vw(40px);
    }

    &__content {
      margin-top: desktop-vw(40px);
      display: flex;
      flex-direction: row;
      align-items: center;

      &__title.H4 {
        flex: 2;
        margin-right: desktop-vw(40px);
        font-size: desktop-vw(48px);
        line-height: desktop-vw(62px);
      }
      &__text.P2 {
        flex: 3;
        margin-right: desktop-vw(60px);
      }
    }

    &__wrapper-visual {
      aspect-ratio: 670 / 680;
      display: block;
      width: 100%;
      height: auto;
      position: relative;
      overflow: hidden;
      max-height: 85vh;
    }

    &__visual {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      will-change: transform;

      img {
        transition: transform 0.95s var(--ease-out-quart);

        transform: scale(1.45);
      }
    }
  }
}
</style>
