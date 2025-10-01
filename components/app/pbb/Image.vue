<template>
  <!-- sizes="sm:35vw md:15vw" -->
  <picture class="app-paris-basketball-image picture-absolute">
    <source media="(min-width: 768px)" :srcset="srcDesktop" />
    <img :src="srcMobile" :alt="alt" :loading="lazy ? 'lazy' : 'eager'" />
  </picture>
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
      default: () => {},
    },
  },
  computed: {
    srcDesktop() {
      const src = this.src
      return `${src}`
    },
    srcMobile() {
      const src = this.src
      return `${src}`
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
