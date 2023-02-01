<template>
  <div class="app-element-slider">
    <div class="app-element-slider__heading grid-inner">
      <ERichText
        :split="true"
        :scrub="false"
        :overflow="true"
        class="app-element-slider__heading__title"
        :content="contents.title"
      />
      <EPartnersTotal
        class="app-element-slider__heading__spaces"
        :total="contents.items.length"
        :text="contents.totalText"
      />
    </div>

    <div
      ref="wrapper"
      :class="{ cursorSliderHold }"
      class="app-element-slider__wrapper"
      @mouseenter="setCursorState('slider')"
      @mouseleave="setCursorState('hide')"
      @click="onClickSlider"
    >
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
              :src="item.picture"
              format="webp"
              :alt="`slider-visual-${index}`"
            />
          </div>

          <div class="app-element-slider__item__content">
            <TH4 class="app-element-slider__item__content__title">{{
              item.title
            }}</TH4>
            <TP2 class="app-element-slider__item__content__text">
              {{ item.paragraph }}
            </TP2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
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
    }
  },
  computed: {
    ...mapState({
      cursorSliderHold: (state) => state.cursorSliderHold,
      cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
    }),
  },
  watch: {
    cursorSliderLeftZone() {
      this.handleDisabledCursor()
    },
  },
  mounted() {
    this.embla = EmblaCarousel(this.$refs.wrapper, {
      // skipSnaps: false
      dragFree: true,
      containScroll: 'keepSnaps',
      speed: 10,
      breakpoints: {
        '(max-width: 800px)': { dragFree: false, skipSnaps: false, speed: 10 },
      },
    })

    this.embla.on('init', this.setParallax)
    this.embla.on('scroll', this.onScroll)
    this.embla.on('resize', this.setParallax)
    this.embla.on('select', this.onSelect)
    this.embla.on('pointerUp', this.onPointerUp)
    this.embla.on('pointerDown', this.onPointerDown)
  },
  beforeDestroy() {
    this.embla?.off('init', this.setParallax)
    this.embla?.off('scroll', this.onScroll)
    this.embla?.off('resize', this.setParallax)
    this.embla?.off('select', this.onSelect)
    this.embla?.off('pointerUp', this.onPointerUp)
    this.embla?.off('pointerDown', this.onPointerDown)

    this.embla?.destroy()
  },
  methods: {
    onClickTest() {
      console.log('onClickTest')
    },
    onClickSlider(e) {
      console.log('click')
      // this.setCursorSliderHold(false)

      const isLeft = e.clientX < this.$viewport.width / 2
      const canScrollPrev = this.embla.canScrollPrev()
      const canScrollNext = this.embla.canScrollNext()

      if (isLeft && canScrollPrev) {
        this.embla.scrollPrev()
      } else if (!isLeft && canScrollNext) {
        this.embla.scrollNext()
      }
    },
    onScroll() {
      // this.setCursorSliderHold(true)

      this.setParallax()
    },
    onSelect(e) {
      this.handleDisabledCursor()
    },
    onPointerDown() {
      // this.setCursorSliderHold(true)

      console.log('onPointerDown')
    },

    onPointerUp() {
      // console.log('onPointerUp')
      // this.setCursorSliderHold(false)
    },
    handleDisabledCursor() {
      const canScrollPrev = this.embla.canScrollPrev()
      const canScrollNext = this.embla.canScrollNext()

      if (
        (this.cursorSliderLeftZone && !canScrollPrev) ||
        (!this.cursorSliderLeftZone && !canScrollNext)
      ) {
        this.setCursorSliderDisabled(true)
      } else {
        this.setCursorSliderDisabled(false)
      }
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
      const parallaxTransforms = this.calculateParallaxTransforms()

      parallaxTransforms.forEach((transform, index) => {
        layers[index].style.transform = `translateX(${transform}%)`
      })
    },
    ...mapMutations({
      setCursorState: 'setCursorState',
      setCursorSliderHold: 'setCursorSliderHold',
      setCursorSliderDisabled: 'setCursorSliderDisabled',
    }),
  },
}
</script>

<style lang="scss">
.app-element-slider {
  width: 100%;
  position: relative;

  @include mobile {
    margin-bottom: mobile-vw(120px);
  }

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
    margin-bottom: desktop-vw(85px);
    position: relative;

    @include mobile {
      row-gap: 0px;
    }

    &__title {
      grid-column: 1 / span 8;

      @include mobile {
        grid-column: 1 / span 6;
        grid-row: 1;
        width: 85%;
      }
    }

    &__spaces {
      grid-column: 12 / span 1;
      align-self: center;
      position: absolute;

      @include mobile {
        grid-column: 1 / span 6;
        position: relative;
        grid-row: 2;
      }
    }
  }

  &__inner {
    display: flex;
    column-gap: desktop-vw(25px);
    flex-direction: row;
    will-change: transform;

    @include mobile {
      column-gap: mobile-vw(25px);
    }
  }

  &__item {
    flex: 0 0 45%;
    display: flex;
    flex-direction: column;

    @include mobile {
      flex: 0 0 77.5%;
    }

    &:first-child {
      margin-left: var(--layout-margin);
    }
    &:last-child {
      margin-right: var(--layout-margin);
    }

    &__content {
      margin-top: desktop-vw(40px);
      display: flex;
      flex-direction: row;
      align-items: center;

      @include mobile {
        margin-top: mobile-vw(25px);
        flex-direction: column;
        align-items: flex-start;
      }

      &__title.H4 {
        flex: 2;
        margin-right: desktop-vw(40px);
        font-size: desktop-vw(48px);
        line-height: desktop-vw(62px);

        @include mobile {
          font-size: mobile-vw(40px);
          line-height: mobile-vw(40px);
          margin-right: 0px;
          margin-bottom: mobile-vw(15px);
        }
      }
      &__text.P2 {
        flex: 3;
        margin-right: desktop-vw(60px);

        @include mobile {
          text-transform: uppercase;
          margin-right: mobile-vw(0px);
          margin-left: mobile-vw(40px);
        }
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
      @include noise();

      img {
        transition: transform 0.95s var(--ease-out-quart);

        transform: scale(1.45);
      }
    }
  }
}
</style>
