<template>
  <div class="app-element-grid-logos-footer">
    <div
      v-for="(logo, index) in contents"
      :key="index"
      :class="{
        big: logo.big,
      }"
      class="bloc"
    >
      <a
        :href="logo.logo_link"
        target="_blank"
        class="logo-link"
        v-if="logo.logo_link"
      >
        <nuxt-img
          provider="directus"
          :src="logo.logo_white"
          :alt="logo.logo_alt"
          format="webp"
          loading="lazy"
          sizes="sm:20vw md:10vw"
        />
      </a>
      <nuxt-img
        provider="directus"
        :src="logo.logo_white"
        :alt="logo.logo_alt"
        format="webp"
        loading="lazy"
        sizes="sm:20vw md:10vw"
        v-if="!logo.logo_link"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.app-element-grid-logos-footer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 80%;
  grid-gap: 1px;
  margin-top: desktop-vw(30px);

  @include mobile {
    width: 100%;
  }

  .bloc {
    aspect-ratio: 90 / 90;
    position: relative;
    grid-row: span 1;
    grid-column: span 1;
    height: 100%;
    width: 100%;
    // order: var(--order);
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1px solid var(--c-grey);

    img {
      width: 50%;
      height: auto;
    }

    .logo-link {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }

    &.visible {
      background: var(--c-white);
    }

    &.big {
      grid-row: span 2;
      grid-column: span 2;
      aspect-ratio: 175 / 175;
    }
  }
}
</style>
