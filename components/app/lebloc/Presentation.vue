<template>
  <div class="app-le-bloc-presentation grid-inner">
    <ERichText
      class="app-le-bloc-presentation__title"
      :content="contents.title"
    />
    <EKinesis class="app-le-bloc-presentation__visual" :speed="5">
      <nuxt-picture
        provider="directus"
        :src="contents.picture.src"
        format="webp"
        :alt="contents.picture.alt"
        class="picture-absolute"
      />
    </EKinesis>

    <EKinesis class="app-le-bloc-presentation__framed-visual" :speed="20">
      <EFramedPicture color="blue-adidas">
        <EKinesis :speed="-10">
          <nuxt-picture
            class="picture-absolute"
            provider="directus"
            :src="contents.pictureFramed.src"
            :alt="contents.pictureFramed.alt"
            format="webp"
          />
        </EKinesis>
      </EFramedPicture>
    </EKinesis>
    <EKinesis :speed="5" class="app-le-bloc-presentation__text">
      <TH4>{{ contents.paragraphTitle }}</TH4>

      <ERichText :content="contents.paragraph" />
    </EKinesis>
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
  mounted() {},
}
</script>

<style lang="scss">
.app-le-bloc-presentation {
  position: relative;
  padding-bottom: desktop-vw(950px);

  &__title {
    grid-column: 1 / span 4;
  }

  &__visual.app-element-kinesis {
    position: absolute;
    grid-column: 4 / span 4;
    width: 100%;
    aspect-ratio: 440 / 545;
    top: desktop-vw(250px);
    transform: rotate(-2deg);
    height: auto;
  }

  &__framed-visual.app-element-kinesis {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    top: desktop-vw(550px);
    height: auto;

    .app-element-framed-picture {
      transform: rotate(4deg);
      height: 100%;
    }
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 9 / span 3;

    .H4 {
      margin-bottom: desktop-vw(30px);
    }

    .P2 {
      text-transform: initial;
      @include font-adihausDIN-medium();
    }
  }
}
</style>
