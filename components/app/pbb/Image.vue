<template>
  <nuxt-picture
    class="app-paris-basketball-image picture-absolute"
    :src="src"
    :alt="alt"
    :loading="lazy ? 'lazy' : 'eager'"
    format="webp"
    :sizes="sizesString"
    quality="85"
    :placeholder="tiny"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '#image-src-error',
    },
    alt: {
      type: String,
      default: 'image alt',
    },
    lazy: {
      type: Boolean,
      default: true,
    },
    tiny: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: Object,
      default: () => ({ desktop: '800x600', mobile: '400x300' }),
    },
  },
  computed: {
    sizesString() {
      // Convertir les tailles en format responsive
      return 'sm:50vw md:40vw lg:30vw'
    },
  },
}
</script>

<style lang="scss">
.app-paris-basketball-image {
  width: 100%;
  height: 100%;
  display: block;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
