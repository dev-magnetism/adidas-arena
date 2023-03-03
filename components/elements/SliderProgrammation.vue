<template>
  <div class="app-element-programmation-slider">
    <div class="app-element-programmation-slider__heading grid-inner">
      <ERichText
        :split="true"
        :scrub="false"
        :overflow="true"
        class="app-element-programmation-slider__heading__title"
        :content="content.title"
        tag="h3"
      />
      <AtomsCTA
        href="/programmation"
        class="app-element-programmation-slider__cta"
      >
        {{ content.cta }}
      </AtomsCTA>
    </div>

    <div
      ref="wrapper"
      :class="{ hold: cursorSliderHold }"
      class="app-element-programmation-slider__wrapper"
      @mouseenter="setCursorState('slider')"
      @mouseleave="setCursorState('hide')"
      @click="onClickSlider"
    >
      <div class="app-element-programmation-slider__inner">
        <AppProgrammationSliderCard
          v-for="(card, index) in contentProgrammations"
          :key="'programmation slider' + index"
          :content="card"
          :theme="index % 3 === 0 ? 'grey' : index % 3 === 1 ? 'red' : 'blue'"
          :rotate-negative="!(index % 2)"
        />
      </div>
    </div>
    <AtomsCTA
      href="/programmation"
      class="app-element-programmation-slider__cta-mobile"
    >
      {{ content.cta }}
    </AtomsCTA>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import EmblaCarousel from 'embla-carousel'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      parallaxFactor: 10,
    }
  },
  computed: {
    ...mapState({
      cursorSliderHold: (state) => state.cursorSliderHold,
      cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
      programmationsContent: (state) => state.programmationsContent,
      allowScroll: (state) => state.allowScroll,
    }),
    contentProgrammations() {
      return this.programmationsContent.filter((el) => el.inside_slider)
    },
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
        s.querySelector('.app-programmation-slider-card__visual__picture')
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
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-element-programmation-slider {
  width: 100%;
  position: relative;
  margin-top: desktop-vw(130px);
  margin-bottom: desktop-vw(80px);
  display: flex;
  flex-direction: column;

  @include mobile {
    margin-top: mobile-vw(80px);
    margin-bottom: mobile-vw(100px);
    display: flex;
    flex-direction: column;
  }

  &__wrapper {
    // overflow: hidden;
  }

  &__inner {
    display: flex;
    column-gap: desktop-vw(60px);
    flex-direction: row;
    will-change: transform;

    @include mobile {
      column-gap: mobile-vw(30px);
    }
  }

  &__cta.app-atoms-cta {
    grid-column: 10 / span 3;
    align-self: center;
    width: 80%;
    margin-left: auto;

    @include mobile {
      display: none;
    }
  }

  &__cta-mobile.app-atoms-cta {
    width: 65%;
    margin-top: mobile-vw(85px);
    align-self: center;

    @include desktop {
      display: none;
    }
  }

  &__heading {
    margin-bottom: desktop-vw(85px);
    position: relative;

    @include mobile {
      row-gap: 0px;
      margin-bottom: mobile-vw(40px);
    }

    &__title {
      grid-column: 1 / span 8;

      .H2.medium {
        @include font-adihausDIN-cn-bold();
      }

      @include mobile {
        grid-column: 1 / span 6;
        grid-row: 1;
        width: 100%;
      }
    }
  }
}
</style>
