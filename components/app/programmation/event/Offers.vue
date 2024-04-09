<template>

  <div class="app-programmation-event-orders block-inner">

    <TH2 weight="bold" class="app-programmation-event-orders__title">
      Les offres
    </TH2>

    <div 
      class="app-programmation-event-orders-slider"
      >
      <div
        ref="wrapper"
        :class="{ hold: cursorSliderHold, 'slide-init' : (event.offers?.length > ($viewport.isLargeDesktop?4:3)) }"
        class="app-programmation-event-orders-slider__wrapper"
        @mouseenter="(event.offers?.length > ($viewport.isLargeDesktop?4:3))?setCursorState('slider'):null"
        @mouseleave="(event.offers?.length > ($viewport.isLargeDesktop?4:3))?setCursorState('hide'):null"
        @click="(event.offers?.length > ($viewport.isLargeDesktop?4:3))?onClickSlider:null"
        >
        <div 
          class="app-programmation-event-orders-slider__inner"
          >

          <div 
            v-for="(offer, index) in event.offers"
            :key="index"
            class="app-programmation-event-orders__item-container"
            >
            <div class="app-programmation-event-orders__item">
              <picture class="app-programmation-event-orders__item__visual">
                <nuxt-img
                  provider="directus"
                  :src="offer.visual"
                  :alt="offer.title"
                  format="webp"
                  loading="lazy"
                  sizes="sm:320 md:874"
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
                  ref="cta"
                  @mouseenter.native="onMouseEnter"
                  @mouseleave.native="onMouseLeave"
                  >
                  {{offer.cta_label}}
                </AtomsCTA>
              </div>
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
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
        this.handleDisabledCursor()
      }
    },
  },
  mounted() {
    const _limit = this.$viewport.isLargeDesktop?4:3;
    if(this.event.offers?.length > _limit){
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
    const _limit = this.$viewport.isLargeDesktop?4:3;

    if(this.event.offers?.length > _limit){
      this.embla?.off('pointerUp', this.onPointerUp)
      this.embla?.off('pointerDown', this.onPointerDown)

      if (!this.$viewport.isMobile) {
        if(this.event.offers?.length > _limit){
          this.embla?.off('init', this.onScroll)
          this.embla?.off('scroll', this.onScroll)
          this.embla?.off('resize', this.onScroll)
          this.embla?.off('select', this.onSelect)
        }
      }

      this.embla?.destroy()
    }
  },methods: {
    onMouseEnter() {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
        if (this.$viewport.isMobile) return

        this.setCursorState('hide')
      }
    },
    onMouseLeave() {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
        if (this.$viewport.isMobile) return

        this.setCursorState('slider')
      }
    },
    onClickSlider(e) {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
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
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
       this.setParallax()
      }
    },
    onSelect(e) {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
        this.handleDisabledCursor()
      }
    },
    onPointerDown() {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
        if (this.allowScroll) {
          this.setAllowScroll(false)
        }

       this.setCursorSliderHold(true)
      }
    },
    onPointerUp() {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
        if (!this.allowScroll) {
          this.setAllowScroll(true)
        }

        this.setCursorSliderHold(false)
      }
    },
    handleDisabledCursor() {
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
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
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
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
      const _limit = this.$viewport.isLargeDesktop?4:3;
      if(this.event.offers?.length > _limit){
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
      display: block;
      width: 100%;
      padding: 0;

      &.slide-init{
        overflow: hidden;

        .app-programmation-event-orders-slider__inner{
          will-change: transform;
        }

        .app-programmation-event-orders__item-container{
          flex: 0 0 33.333%;

          @include mobile {
            flex: 0 0 85%;
          }

          @include desktop-l {
            flex: 0 0 25%;
          }
        }
      }

      @include mobile {
        padding: 0;
      }
    }

    &__inner {
      display: flex;
      flex-direction: row;
      margin: 0 desktop-vw(-10px);
      //  column-gap: desktop-vw(20px);

      @include mobile {
        //  column-gap: mobile-vw(20px);
      }

      @include desktop-l {
        //  column-gap: desktop-vw(16px);
      }
    }
  }

  &__item-container {
    display: block;
    flex: 0 0 33.333%;
    padding: 0 desktop-vw(10px);

    @include mobile {
      flex: 0 0 85%;
      padding: 0 mobile-vw(10px);
    }

    @include desktop-l {
      flex: 0 0 25%;
    }
  }

  &__item {
    display: block;
    width: 100%;
    background: var(--c-white);
    border: 1px solid var(--c-black);


    &__visual {
      position: relative;
      //  aspect-ratio: 435 / 300;
      padding: 68.65% 0 0;
      width: 100%;
      height: 0;
      display: block;
      overflow: hidden;

      @include mobile {
        //  aspect-ratio: 340 / 300;
      }

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: translate(-50%, -50%);
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

        @include desktop-l {
          font-size: desktop-vw(48px);
          line-height: desktop-vw(42px);
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
