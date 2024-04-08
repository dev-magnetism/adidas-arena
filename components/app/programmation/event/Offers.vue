<template>

  <div class="app-programmation-event-orders block-inner">

    <TH2 weight="bold" class="app-programmation-event-orders__title">
      Les offres
    </TH2>

    <div class="app-programmation-event-orders__items grid">

      

    </div>

    <div class="app-programmation-event-orders-slider">
      <div
        ref="wrapper"
        :class="{ hold: cursorSliderHold }"
        class="app-programmation-event-orders-slider__wrapper"
        @mouseenter="event.offers?.length > 3?setCursorState('slider'):null"
        @mouseleave="event.offers?.length > 3?setCursorState('hide'):null"
        @click="event.offers?.length > 3?onClickSlider:null"
        >
        <div class="app-programmation-event-orders-slider__inner">

          <div 
            v-for="(offer, index) in event.offers"
            :key="index"
            class="app-programmation-event-orders__item"
            >
            <picture class="app-programmation-event-orders__item__visual">
              <nuxt-img
                provider="directus"
                :src="offer.visual"
                :alt="offer.title"
                format="webp"
                loading="lazy"
                sizes="sm:20vw md:10vw"
                />
            </picture>
            <div class="app-programmation-event-orders__item__content">
              <TH2Bis>{{offer.title}}</TH2Bis>
              <TP1>
                {{offer.description}}
              </TP1>
              <AtomsCTA
                :href="offer.cta_url"
                target="_blank"
                >
                {{offer.cta_label}}
              </AtomsCTA>
            </div>
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
    event: {
      type: Object,
      default: () => {},
    },
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
      if(this.event.offers?.length > 3){
        this.handleDisabledCursor()
      }
    },
  },
  mounted() {
    if(this.event.offers?.length > 3){
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
    }
  },
  beforeDestroy() {

    if(this.event.offers?.length > 3){
      this.embla?.off('pointerUp', this.onPointerUp)
      this.embla?.off('pointerDown', this.onPointerDown)

      if (!this.$viewport.isMobile) {
        if(this.event.offers?.length > 3){
          this.embla?.off('init', this.onScroll)
          this.embla?.off('scroll', this.onScroll)
          this.embla?.off('resize', this.onScroll)
          this.embla?.off('select', this.onSelect)
        }
      }

      this.embla?.destroy()
    }
  },methods: {
    onClickSlider(e) {

      if(this.event.offers?.length > 3){
        if (this.$viewport.isMobile) return

        const isLeft = e.clientX < this.$viewport.width / 2
        const canScrollPrev = this.embla.canScrollPrev()
        const canScrollNext = this.embla.canScrollNext()

        if (isLeft && canScrollPrev) {
          this.embla.scrollPrev()
        } else if (!isLeft && canScrollNext) {
          this.embla.scrollNext()
        }
      }
    },

    onScroll() {
      if(this.event.offers?.length > 3){
       this.setParallax()
      }
    },
    onSelect(e) {
      if(this.event.offers?.length > 3){
        this.handleDisabledCursor()
      }
    },
    onPointerDown() {
      if(this.event.offers?.length > 3){
        if (this.allowScroll) {
          this.setAllowScroll(false)
        }

       this.setCursorSliderHold(true)
      }
    },
    onPointerUp() {
      if(this.event.offers?.length > 3){
        if (!this.allowScroll) {
          this.setAllowScroll(true)
        }

        this.setCursorSliderHold(false)
      }
    },
    handleDisabledCursor() {
      if(this.event.offers?.length > 3){
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
      }
    },
    calculateParallaxTransforms() {
      if(this.event.offers?.length > 3){
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
      }
    },
    setParallax() {
      if(this.event.offers?.length > 3){
        const slides = this.embla.slideNodes()

        const layers = slides.map((s) =>
          s.querySelector('.app-programmation-event-orders__item__visual')
        )

        const parallaxTransforms = this.calculateParallaxTransforms()

        parallaxTransforms.forEach((transform, index) => {
          layers[index].style.transform = `translateX(${transform}%)`
        })
      }
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
.app-programmation-event-orders {
  margin-top: desktop-vw(75px);

  @include mobile {
    margin-top: mobile-vw(65px);
  }

  &__title {
    margin-bottom: desktop-vw(30px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &-slider {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;

    @include mobile {
      display: flex;
      flex-direction: column;
    }

    &__wrapper {
      width: 100%;
      overflow: hidden;
      padding: 0;

      @include mobile {
        padding: 0;
      }
    }

    &__inner {
      display: flex;
      column-gap: desktop-vw(20px);
      flex-direction: row;
      will-change: transform;

      @include mobile {
        column-gap: mobile-vw(20px);
      }
    }
  }

  &__items {
  }

  &__item {
    display: flex;
    flex-direction: column;
    flex: 0 0 32.3%;
    background: var(--c-white);
    border: 1px solid var(--c-black);

    @include mobile {
      flex: 0 0 85%;
    }

    &__visual {
      aspect-ratio: 435 / 300;
      width: 100%;
      height: auto;
      display: block;

      @include mobile {
        aspect-ratio: 340 / 300;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &__content {
      padding: desktop-vw(25px) desktop-vw(25px) 0 desktop-vw(25px);
      border-top: 1px solid var(--c-black);
      display: flex;
      flex-direction: column;

      @include mobile {
        padding: mobile-vw(25px) mobile-vw(25px) 0 mobile-vw(25px);
      }

      .app-atoms-cta {
        align-self: flex-end;
        margin-right: desktop-vw(-25px);
        border-right: none;
        border-bottom: none;
        min-width: 60%;

        @include mobile {
          margin-right: mobile-vw(-25px);
        }
      }

      .H2-bis {
        margin-bottom: desktop-vw(15px);

        @include mobile {
          margin-bottom: mobile-vw(25px);
        }
      }

      .P1 {
        margin-bottom: desktop-vw(50px);

        @include mobile {
          margin-bottom: mobile-vw(50px);
        }
      }
    }
  }
}
</style>
