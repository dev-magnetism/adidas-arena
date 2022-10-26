<template>
  <div class="app-be-part-of-hospitalite-presentation grid-inner">
    <ERichText
      class="app-be-part-of-hospitalite-presentation__title"
      :content="contents.title"
    />
    <nuxt-picture
      class="app-be-part-of-hospitalite-presentation__visual"
      provider="directus"
      :src="contents.picture.src"
      format="webp"
      :alt="contents.picture.alt"
    />
    <EFramedPicture
      class="app-be-part-of-hospitalite-presentation__framed-visual"
      color="blue-adidas"
    >
      <nuxt-picture
        class="picture-absolute"
        provider="directus"
        :src="contents.pictureFramed.src"
        format="webp"
        :alt="contents.pictureFramed.alt"
      />
    </EFramedPicture>
    <div class="app-be-part-of-hospitalite-presentation__text">
      <TH4>{{ contents.paragraphTitle }}</TH4>

      <ERichText :content="contents.paragraph" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-be-part-of-hospitalite-presentation {
  position: relative;
  padding-bottom: desktop-vw(950px);

  &__title {
    grid-column: 1 / span 5;
  }

  &__visual {
    position: absolute;
    grid-column: 4 / span 4;
    width: 100%;
    aspect-ratio: 440 / 545;
    top: desktop-vw(250px);
    transform: rotate(-2deg);
    @include noise();
  }

  &__framed-visual.app-element-framed-picture {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    transform: rotate(4deg);
    top: desktop-vw(550px);
    @include noise();
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 8 / span 4;

    .H4 {
      margin-bottom: desktop-vw(30px);
    }

    .P2 {
      margin-left: columns(1.5);
      text-transform: initial;
    }
  }
}
</style>
