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

  @include mobile {
    padding-bottom: mobile-vw(100px);
  }

  &__title {
    grid-column: 1 / span 4;

    @include mobile {
      grid-column: 1 / span 6;
      grid-row: 1;
    }
  }

  &__visual.app-element-kinesis {
    position: absolute;
    grid-column: 4 / span 4;
    width: 100%;
    aspect-ratio: 440 / 545;
    top: desktop-vw(250px);
    transform: rotate(-2deg);
    height: auto;

    @include mobile {
      grid-row: 2;
      position: relative;
      top: 0;
      grid-column: 1 / span 4;
      aspect-ratio: 205 / 250;
      margin-bottom: mobile-vw(130px);
    }
  }

  &__framed-visual.app-element-kinesis {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    top: desktop-vw(550px);
    height: auto;

    @include mobile {
      grid-row: 2;
      grid-column: 4 / span 3;
      aspect-ratio: 165 / 200;
    }

    .app-element-framed-picture {
      transform: rotate(4deg);
      height: 100%;
      padding: mobile-vw(8px);
    }
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 9 / span 3;

    @include mobile {
      grid-row: 3;
      grid-column: 2 / span 5;
      margin-top: mobile-vw(0px);
    }

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
