<template>
  <div class="app-actualites-block-picture-legend grid-inner">
    <div class="app-actualites-block-picture-legend__wrapper">
      <nuxt-picture
        ref="picture"
        :style="{
          '--width-ratio': content.picture.width,
          '--height-ratio': content.picture.height,
          '--width': `${(content.picture.width / $viewport.width) * 100}%`,
        }"
        provider="directus"
        :src="content.picture.filename_disk"
        format="webp"
        :alt="`block-picture-${content.legend}`"
        :sizes="`sm:50vw md:${content.picture.width}px`"
      />
      <TP2 class="app-actualites-block-picture-legend__text" weight="medium">{{
        content.legend
      }}</TP2>
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
  async mounted() {
    const routes = []

    const actualites = await this.$axios.get(
      `https://adidasarena.directus.app/items/Actualites?limit=-1`
    )

    actualites.data.data.forEach((actu) => {
      routes.push(`/nos-actualites/${this.$convertToKebabCase(actu.title)}`)
    })

    console.log(routes)
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
  }

  &__text {
    opacity: 0.5;
    margin-top: desktop-vw(10px);
  }

  picture {
    aspect-ratio: var(--width-ratio) / var(--height-ratio);
    display: block;
    width: var(--width);
    height: auto;
    max-width: 100%;

    img {
      @include draggable-false();
    }
  }

  &__title {
    margin-bottom: desktop-vw(30px);
  }
}
</style>
