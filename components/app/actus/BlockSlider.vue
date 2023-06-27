<template>
  <div
    class="app-actualites-block-slider grid-inner"
    @mouseenter="setCursorState('slider')"
    @mouseleave="setCursorState('hide')"
    @click="onClickSlider"
  >
    <div class="app-actualites-block-slider__wrapper">
      <div
        v-for="(slide, index) in content.items"
        :key="`block-slider-${index}`"
        class="app-actualites-block-slider__slide"
      >
        <nuxt-picture
          v-if="!slide.item.picture.type.includes('video')"
          ref="picture"
          :style="{
            '--width-ratio': slide.item.picture.width,
            '--height-ratio': slide.item.picture.height,
            '--width': `${(slide.item.picture.width / $viewport.width) * 100}%`,
          }"
          provider="directus"
          :src="slide.item.picture.filename_disk"
          format="webp"
          :alt="`block-picture-${slide.item.legend}`"
          :sizes="`sm:50vw md:${slide.item.picture.width}px`"
          loading="lazy"
        />
        <video v-else ref="video" preload="none" loop muted playsinline>
          <source
            :src="`${$img.options.providers.directus.defaults.baseURL}assets/${slide.item.picture.filename_disk}`"
            :type="slide.item.picture.type"
          />
        </video>
        <TP2 class="app-actualites-block-picture-legend__text" weight="medium">
          {{ slide.item.legend }}
        </TP2>
      </div>
    </div>
    <div class="app-actualites-block-slider__counter">
      <div class="app-actualites-block-slider__counter__active">
        <transition-group
          :name="`transition-block-slider-active-${directionSlider}`"
          tag="div"
          mode="out-in"
          :duration="800"
        >
          <TH3
            v-for="(item, index) in content.items"
            v-show="indexSlider === index"
            :key="`block-slider-counter-active-${index}`"
            tag="p"
            weight="bold"
          >
            {{ ('0' + (index + 1)).slice(-2) }}
          </TH3>
        </transition-group>
      </div>
      <TH3
        class="app-actualites-block-slider__counter__separator"
        tag="p"
        weight="bold"
        >/</TH3
      >
      <TH3
        class="app-actualites-block-slider__counter__total"
        tag="p"
        weight="bold"
        >{{ totalSlides }}</TH3
      >
    </div>
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
      indexSlider: 0,
      directionSlider: 'next',
    }
  },
  computed: {
    ...mapState({
      cursorSliderHold: (state) => state.cursorSliderHold,
      cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
      allowScroll: (state) => state.allowScroll,
    }),
    totalSlides() {
      return ('0' + this.content.items.length).slice(-2)
    },
  },
  watch: {
    cursorSliderLeftZone() {
      this.handleDisabledCursor()
    },
  },
  mounted() {
    this.embla = EmblaCarousel(this.$el, {
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
      this.embla.on('select', this.onSelect)
    }
  },
  beforeDestroy() {
    this.embla?.off('pointerUp', this.onPointerUp)
    this.embla?.off('pointerDown', this.onPointerDown)

    if (!this.$viewport.isMobile) {
      this.embla?.off('select', this.onSelect)
    }

    this.embla?.destroy()
  },
  methods: {
    onSelect(e) {
      this.indexSlider = this.embla.selectedScrollSnap()

      const previousIndexSlider = this.embla.previousScrollSnap()

      if (this.indexSlider > previousIndexSlider) {
        this.directionSlider = 'next'
      } else {
        this.directionSlider = 'previous'
      }

      const isVideo =
        this.content.items[this.indexSlider].item.picture.type.includes('video')

      if (isVideo) {
        const currentSlide = this.embla.slideNodes()[this.indexSlider]

        const video = currentSlide.getElementsByTagName('video')[0]

        video.play()
      }

      const isVideoPrevious =
        this.content.items[previousIndexSlider].item.picture.type.includes(
          'video'
        )

      if (isVideoPrevious) {
        const previousSlide = this.embla.slideNodes()[previousIndexSlider]

        const video = previousSlide.getElementsByTagName('video')[0]

        video.pause()
      }

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
.app-actualites-block-slider {
  position: relative;

  &__wrapper {
    grid-column: 1 / span 12;
    display: flex;
    column-gap: var(--layout-columns-gap);
    flex-direction: row;
    will-change: transform;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__counter {
    grid-column: 1 / span 12;
    justify-self: center;
    display: flex;

    &__active {
      height: desktop-vw(65px);
      width: desktop-vw(50px);
      overflow: hidden;
      position: relative;

      .H3 {
        position: absolute;

        &.transition-block-slider-active-next-enter-active,
        &.transition-block-slider-active-next-leave-active,
        &.transition-block-slider-active-previous-enter-active,
        &.transition-block-slider-active-previous-leave-active {
          transition: transform 0.45s var(--ease-out-cubic);
        }

        &.transition-block-slider-active-next-enter-active,
        &.transition-block-slider-active-previous-enter-active {
          transition-delay: 0.35s;
        }

        &.transition-block-slider-active-next-enter {
          transform: translateY(105%);
        }
        &.transition-block-slider-active-previous-enter {
          transform: translateY(-105%);
        }

        &.transition-block-slider-active-next-enter-to,
        &.transition-block-slider-active-previous-enter-to {
          transform: translateY(0%);
        }

        &.transition-block-slider-active-next-leave,
        &.transition-block-slider-active-previous-leave {
          transform: translateY(0%);
        }

        &.transition-block-slider-active-next-leave-to {
          transform: translateY(-105%);
        }
        &.transition-block-slider-active-previous-leave-to {
          transform: translateY(105%);
        }
      }
    }

    &__total {
      -webkit-text-stroke: 1px var(--c-black);
      -webkit-text-fill-color: transparent;
    }

    &__separator {
      margin: 0px desktop-vw(10px);
    }
  }

  &__slide {
    flex: 0 0 auto; /* Adapt slide size to its content */
    min-width: 0;
    max-width: 100%; /* Prevent from growing larger than viewport */

    &:first-child {
      margin-left: columns(2);

      @include mobile {
        margin-left: 0px;
      }
    }

    picture {
      aspect-ratio: var(--width-ratio) / var(--height-ratio);
      display: block;
      height: 100%;
      max-width: 100%;
      max-height: 70vh;

      img {
        @include draggable-false();
      }
    }

    video {
      aspect-ratio: 16 / 9;
      width: auto;
      height: 100%;
      max-height: 70vh;
    }
  }
}
</style>
