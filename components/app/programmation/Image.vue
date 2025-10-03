<template>
  <nuxt-picture
    class="app-programmation-image"
    :src="optimizedSrc"
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
    optimizedSrc() {
      // Utiliser l'URL optimisée d'Accor Arena
      return `https://www.accorarena.com/uploads/aha/generated/${this.sizes.desktop}/${this.src}`
    },
    sizesString() {
      // Convertir les tailles en format responsive
      return 'sm:50vw md:40vw lg:30vw'
    },
  },
}
</script>

<style lang="scss">
.app-programmation-image {
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
