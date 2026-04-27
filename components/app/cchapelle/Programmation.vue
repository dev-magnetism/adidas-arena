<template>
	<div class="page-cchapelle__programmation-slider">
		<div class="page-cchapelle__programmation-slider__heading grid-inner">
			<ERichText
				:split="true"
				:scrub="false"
				:overflow="true"
				class="page-cchapelle__programmation-slider__heading__title"
				:content="contents.title"
				tag="h2"
			/>
			<AtomsCTA
				:href="contents.cta_link"
        target="_blank"
				class="page-cchapelle__programmation-slider__cta"
			>
				{{ contents.cta_label }}
			</AtomsCTA>

		</div>

		<div
			ref="wrapper"
			:class="{ hold: cursorSliderHold }"
			class="page-cchapelle__programmation-slider__wrapper"
			@mouseenter="onSliderMouseEnter"
			@mouseleave="onSliderMouseLeave"
			@click="onClickSlider"
		>
			<div class="page-cchapelle__programmation-slider__inner">
				<AppCchapelleProgrammationCard
					v-for="(event, index) in contents.list"
					:key="`programmation-slider-${event.id || index}`"
					:event="event"
					:theme="index % 3 === 0 ? 'grey' : index % 3 === 1 ? 'red' : 'blue'"
					:rotate-negative="!(index % 2)"
				/>
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
    onSliderMouseEnter() {
      if (this.$viewport.isMobile) return
      this.setCursorState('slider')
      this.setAppCursor('none')
    },
    onSliderMouseLeave() {
      if (this.$viewport.isMobile) return
      this.setCursorState('hide')
      this.setAppCursor('initial')
    },
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
      setAppCursor: 'setAppCursor',
      setCursorSliderHold: 'setCursorSliderHold',
      setCursorSliderDisabled: 'setCursorSliderDisabled',
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.page-cchapelle__programmation-slider {
  width: 100%;
  position: relative;
  margin-top: desktop-vw(180px);

  @include mobile {
    margin-top: mobile-vw(80px);
    margin-bottom: mobile-vw(100px);
    display: flex;
    flex-direction: column;
  }

  &__wrapper {
    width: 100%;
    overflow: hidden;
    padding: desktop-vw(50px) 0 desktop-vw(170px);

    @include mobile {
      padding: mobile-vw(32px) 0 mobile-vw(64px) ;
    }
  }

  &__inner {
    display: flex;
    column-gap: desktop-vw(30px);
    flex-direction: row;
    will-change: transform;

    @include mobile {
      column-gap: mobile-vw(30px);
    }

    .app-cchapelle-programmation-card{
      flex: 0 0 27.5%;

      @include mobile {
        flex: 0 0 83%;
      }
    }

    .app-cchapelle-programmation-card:nth-child(2n+2){
        top: 0;
    }
  }

  &__cta.app-atoms-cta {
    grid-column: 10 / span 3;
    align-self: center;
    width: 80%;
    margin-left: auto;

    @include mobile {
      grid-column: 1 / span 6;
      width: 100%;
    }
  }

  &__cta-mobile.app-atoms-cta {
    width: 65%;
    margin-top: mobile-vw(25px);
    align-self: center;

    @include desktop {
      display: none;
    }
  }

  &__heading {
    margin-bottom: desktop-vw(10px);
    position: relative;

    @include mobile {
      row-gap: 0px;
      margin-bottom: mobile-vw(20px);
    }

    &__title {
      grid-column: 1 / span 8;


      @include mobile {
        margin-bottom: mobile-vw(25px);
      }

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-black);
        -webkit-text-fill-color: transparent;
      }

      .H2.medium {
        @include font-ITCFranklinGothicLT-DmCp();
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
