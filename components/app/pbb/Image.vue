<template>
  <picture class="app-paris-basketball-image picture-absolute">
    <source media="(min-width: 768px)" :srcset="src" />
    <img 
      :src="src" 
      :alt="alt" 
      :loading="lazy ? 'lazy' : 'eager'"
      :decoding="lazy ? 'async' : 'sync'"
      :fetchpriority="lazy ? 'low' : 'high'"
    />
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
      default: () => ({ desktop: '800x600', mobile: '400x300' }),
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
