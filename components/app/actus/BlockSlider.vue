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
        />
        <video v-else ref="video" loop muted playsinline controls>
          <source
            :src="`${$img.options.providers.directus.defaults.baseURL}assets/${slide.item.picture.filename_disk}`"
            :type="slide.item.picture.type"
          />
        </video>
        <TP2
          class="app-actualites-block-picture-legend__text"
          weight="medium"
          >{{ slide.item.legend }}</TP2
        >
      </div>
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

  &__slide {
    flex: 0 0 auto; /* Adapt slide size to its content */
    min-width: 0;
    max-width: 100%; /* Prevent from growing larger than viewport */
    max-height: 75vh;

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

      img {
        @include draggable-false();
      }
    }

    video {
      aspect-ratio: 16 / 9;
      width: auto;
      height: 100%;
    }
  }
}
</style>
