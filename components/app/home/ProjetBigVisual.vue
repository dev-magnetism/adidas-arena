<template>
  <div class="app-home-projet__big-visual">
    <nuxt-picture
      v-if="!$viewport.isMobile"
      class="app-home-projet__big-visual__left-top projet-visual"
      :src="$parent.contents.projetPicture4"
      provider="directus"
      format="webp"
      alt="placeholder"
      sizes="sm:35vw md:15vw"
    />
    <nuxt-picture
      v-if="!$viewport.isMobile"
      class="app-home-projet__big-visual__left-top-upper projet-visual"
      :src="$parent.contents.projetPicture3"
      provider="directus"
      format="webp"
      alt="placeholder"
      sizes="sm:35vw md:15vw"
    />

    <nuxt-picture
      class="app-home-projet__big-visual__principal projet-visual"
      :src="$parent.contents.projetPicture5"
      provider="directus"
      format="webp"
      alt="placeholder"
      sizes="sm:50vw md:35vw"
    />
  </div>
</template>

<style lang="scss">
.app-home-projet__big-visual {
  position: absolute;
  grid-column: 1 / span 5;
  width: 88%;
  aspect-ratio: 450 / 265;
  top: desktop-vw(300px);
  left: columns(0.8);
  transform: rotate(-6deg);

  @include mobile {
    aspect-ratio: 260/155;
    grid-column: 1 / span 5;
    width: 100%;
    left: -8.5%;
    top: 24%;
    transform: rotate(-4deg);
  }

  &__left-top {
    position: absolute;
    left: columns(0);
    top: -10%;
    aspect-ratio: 100/92;
    width: 20.5%;
    z-index: 1;
    @include noise();

    @include mobile {
      display: none;
    }
    // min-width: 100px;
  }

  &__left-top-upper {
    position: absolute;
    width: 23%;
    aspect-ratio: 120 / 182;
    top: -42%;
    left: columns(0.55);
    z-index: -1;
    @include noise();

    @include mobile {
      display: none;
    }
    // min-width: 120px;
  }

  &__principal {
    z-index: -2;
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
    @include noise();
  }

  .app-atoms-title-tag {
    position: absolute;
  }
}
</style>
