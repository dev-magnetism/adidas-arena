<template>
  <picture v-if="useAccorarena" class="app-programmation-image">
    <source media="(min-width: 768px)" :srcset="srcDesktop" />
    <img :src="srcMobile" :alt="alt" :loading="lazy ? 'lazy' : 'eager'" />
  </picture>
  <nuxt-img
    v-else
    class="app-programmation-image app-programmation-image--directus"
    provider="directus"
    :src="directusSrc"
    :alt="alt"
    format="webp"
    :loading="lazy ? 'lazy' : 'eager'"
    :sizes="directusSizes"
  />
</template>

<script>
const DIRECTUS_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default {
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      default: '#image-src-error',
    },
    alt: {
      type: String,
      default: 'image alt',
    },
    imageProvider: {
      type: String,
      default: 'accorarena',
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
    useDirectus() {
      if (this.imageProvider === 'directus') return true
      return DIRECTUS_UUID.test(String(this.src || ''))
    },
    useAccorarena() {
      return !this.useDirectus
    },
    directusSrc() {
      return this.src
    },
    srcDesktop() {
      const src = this.src
      return `https://www.accorarena.com/uploads/aha/generated/${this.sizes.desktop}/${src}`
    },
    srcMobile() {
      const src = this.src
      return `https://www.accorarena.com/uploads/aha/generated/${this.sizes.mobile}/${src}`
    },
    directusSizes() {
      const desktop = this.sizes?.desktop || ''

      if (desktop.includes('w116')) {
        return 'sm:116px md:116px'
      }
      if (desktop.includes('w400')) {
        return 'sm:320px md:400px'
      }

      return 'sm:320px md:800px'
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

  &--directus {
    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
