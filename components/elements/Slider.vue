<template>
  <div class="app-element-slider">
    <div class="app-element-slider__heading grid-inner">
      <ERichText
        :split="true"
        :scrub="false"
        :overflow="true"
        class="app-element-slider__heading__title"
        :content="contents.title"
        tag="h2"
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
              sizes="sm:50vw md:85vw"
              loading="lazy"
            />
          </div>

          <div class="app-element-slider__item__content">
            <TH4 tag="h3" class="app-element-slider__item__content__title">{{
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
      parallaxFactor: 5,
    }
  },
  computed: {
    ...mapState({
      cursorSliderHold: (state) => state.cursorSliderHold,
      cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
      allowScroll: (state) => state.allowScroll,
    }),
  },
  watch: {
    cursorSliderLeftZone() {
      this.handleDisabledCursor()
    },
  },
  mounted() {
    this.embla = EmblaCarousel(this.$refs.wrapper, {
      dragFree: true,
      containScroll: 'keepSnaps',
      speed: 7.5,
      slidesToScroll: 1,
      breakpoints: {
        '(max-width: 800px)': { dragFree: false, skipSnaps: false, speed: 10 },
      },
    })

    this.embla.on('pointerUp', this.onPointerUp)
    this.embla.on('pointerDown', this.onPointerDown)

    if (!this.$viewport.isMobile) {
      this.embla.on('init', this.onScroll)
      this.embla.on('scroll', this.onScroll)
      this.embla.on('resize', this.onScroll)
      this.embla.on('select', this.onSelect)
    }
  },
  beforeDestroy() {
    this.embla?.off('pointerUp', this.onPointerUp)
    this.embla?.off('pointerDown', this.onPointerDown)

    if (!this.$viewport.isMobile) {
      this.embla?.off('init', this.onScroll)
      this.embla?.off('scroll', this.onScroll)
      this.embla?.off('resize', this.onScroll)
      this.embla?.off('select', this.onSelect)
    }

    this.embla?.destroy()
  },
  methods: {
    onClickSlider(e) {
      if (this.$viewport.isMobile) return

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
      this.setParallax()
    },
    onSelect(e) {
      this.handleDisabledCursor()
    },
    onPointerDown() {
      if (this.allowScroll) {
        this.setAllowScroll(false)
      }

      this.setCursorSliderHold(true)
    },
    onPointerUp() {
      if (!this.allowScroll) {
        this.setAllowScroll(true)
      }

      this.setCursorSliderHold(false)
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
      setAllowScroll: 'setAllowScroll',
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
      align-items: flex-start;

      @include mobile {
        margin-top: mobile-vw(25px);
        flex-direction: column;
      }

      &__title.H4 {
        flex: 2;
        margin-right: desktop-vw(40px);
        font-size: desktop-vw(48px);
        line-height: desktop-vw(48px);

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
        text-transform: uppercase;

        @include mobile {
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
