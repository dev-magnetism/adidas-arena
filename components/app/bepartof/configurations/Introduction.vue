<template>
  <div class="app-be-part-of-configurations-introduction grid-inner">
    <div class="app-be-part-of-configurations-introduction__f-row__content">
      <ERichText
        class="app-be-part-of-configurations-introduction__f-row__content__title"
        :content="contents.title"
      />

      <TP2
        weight="bold"
        class="app-be-part-of-configurations-introduction__f-row__content__text"
      >
        {{ contents.subtitle }}
      </TP2>
    </div>

    <div class="app-be-part-of-configurations-introduction__f-row__visual">
      <nuxt-picture
        ref="picture"
        provider="directus"
        :src="contents.pictureFramed.src"
        format="webp"
        :alt="contents.pictureFramed.alt"
        class="picture-absolute"
      />
      <ELottie id="Cadre_02" />
    </div>

    <div class="app-be-part-of-configurations-introduction__s-row__visual">
      <AtomsCornerPoints :size-points="8" />
      <nuxt-picture
        ref="picture"
        provider="directus"
        :src="contents.picture.src"
        format="webp"
        :alt="contents.picture.alt"
        class="picture-absolute"
      />
    </div>

    <div class="app-be-part-of-configurations-introduction__s-row__content">
      <TH4
        class="app-be-part-of-configurations-introduction__s-row__content__title"
      >
        {{ contents.secondTitle }}
      </TH4>
      <TP2
        weight="medium"
        class="app-be-part-of-configurations-introduction__s-row__content__text"
      >
        {{ contents.paragraph }}
      </TP2>
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
.app-be-part-of-configurations-introduction {
  position: relative;
  margin-bottom: desktop-vw(130px);
  row-gap: desktop-vw(125px);

  &__f-row {
    &__content {
      grid-column: 2 / span 6;
      grid-row: 1;
      z-index: 1;

      @include mobile {
        grid-column: 1 / span 6;
      }

      &__title {
      }

      &__text {
        text-transform: uppercase;
        margin-top: desktop-vw(15px);
        width: 65%;

        @include mobile {
          margin-top: mobile-vw(20px);
        }
      }
    }
    &__visual {
      position: relative;
      grid-column: 8 / span 5;
      aspect-ratio: 650 / 785;
      left: columns(-1);
      margin-top: desktop-vw(125px);
      transform: rotate(-4.8deg);
      grid-row: 1;

      @include mobile {
        grid-column: 2 / span 5;
        left: 0;
        top: 0;
        grid-row: 2;
        margin-top: mobile-vw(20px);
        aspect-ratio: 270/320;
        margin-bottom: mobile-vw(185px);
      }

      picture {
        z-index: 0;
      }

      svg,
      canvas {
        position: absolute;
        top: 50%;
        left: 0;
        height: 115% !important;
        width: auto !important;
        left: 50%;
        transform: translate(-50%, -50%) rotate(4deg) !important;
      }
    }
  }

  &__s-row {
    &__content {
      grid-column: 9 / span 4;
      grid-row: 2;

      @include mobile {
        grid-column: 1 / span 6;
        grid-row: 3;
      }

      &__title {
        @include mobile {
          text-align: right;
        }
      }

      &__text {
        margin-left: columns(1.35);
        margin-top: desktop-vw(30px);
        width: 65%;

        @include mobile {
          margin-top: mobile-vw(30px);
          margin-left: auto;
          width: 75%;
        }
      }
    }
    &__visual {
      grid-column: 4 / span 4;
      aspect-ratio: 460/550;
      transform: rotate(5.5deg);
      left: 0;
      position: absolute;
      top: desktop-vw(-400px);
      grid-row: 2;
      width: 100%;

      @include mobile {
        grid-column: 1 / span 4;
        top: 0;
        aspect-ratio: 230/290;
        top: mobile-vw(230px);
      }

      picture {
        z-index: 0;
      }
    }
  }
}
</style>
