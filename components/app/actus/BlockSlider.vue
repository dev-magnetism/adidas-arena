<template>
  <div class="app-actualites-block-slider grid-inner">
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
import EmblaCarousel from 'embla-carousel'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    console.log(this.content)
    this.embla = EmblaCarousel(this.$el, {
      dragFree: true,
      containScroll: 'keepSnaps',
      speed: 7.5,
      slidesToScroll: 1,
      breakpoints: {
        '(max-width: 800px)': { dragFree: false, skipSnaps: false, speed: 10 },
      },
    })
  },
  beforeDestroy() {
    this.embla?.destroy()
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
  }

  &__slide {
    flex: 0 0 auto; /* Adapt slide size to its content */
    min-width: 0;
    max-width: 100%; /* Prevent from growing larger than viewport */
    max-height: 75vh;

    &:first-child {
      margin-left: columns(2);
    }

    picture {
      aspect-ratio: var(--width-ratio) / var(--height-ratio);
      display: block;
      width: var(--width);
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
