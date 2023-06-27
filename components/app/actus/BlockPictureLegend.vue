<template>
  <div class="app-actualites-block-picture-legend grid-inner">
    <div class="app-actualites-block-picture-legend__wrapper">
      <nuxt-picture
        ref="picture"
        :style="{
          '--width-ratio': content.picture.width,
          '--height-ratio': content.picture.height,
          '--width': `${Math.min(
            (content.picture.width / $viewport.width) * 100,
            100
          )}%`,
        }"
        provider="directus"
        :src="content.picture.filename_disk"
        format="webp"
        :alt="`block-picture-${content.legend}`"
        :sizes="`sm:${
          content.picture.width / 2 > 375
            ? content.picture.width / 2
            : content.picture.width
        }px md:${content.picture.width}px`"
      />
      <TP2 class="app-actualites-block-picture-legend__text" weight="medium">
        {{ content.legend }}
      </TP2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-actualites-block-picture-legend {
  position: relative;

  &__wrapper {
    grid-column: 1 / span 12;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__text {
    opacity: 0.5;
    margin-top: desktop-vw(10px);

    @include mobile {
      margin-top: mobile-vw(5px);
    }
  }

  picture {
    aspect-ratio: var(--width-ratio) / var(--height-ratio);
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 80vh;
    // aspect-ratio: var(--width-ratio) / var(--height-ratio);
    // display: block;
    // width: var(--width);
    // height: auto;
    // max-width: 100%;

    img {
      @include draggable-false();
    }
  }
}
</style>
