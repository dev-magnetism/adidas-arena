<template>
  <!-- sizes="sm:35vw md:15vw" -->
  <picture class="app-programmation-image">
    <source
      media="(min-width: 768px)"
      :srcset="tiny ? srcMobile : srcDesktop"
    />
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
  },
  computed: {
    srcDesktop() {
      const src = this.src
      return `https://www.accorarena.com/uploads/aha/generated/w800,h600,fcrop,q80/${src}`
    },
    srcMobile() {
      const src = this.src
      return `https://www.accorarena.com/uploads/aha/generated/w1920,h1080,fcontain,q85/${src}`
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
