<template>
  <div class="app-arena-paris-basket-club grid-inner">
    <EParallax
      ref="frameWrapper"
      class="app-arena-paris-basket-club__visual-with-frame"
      :speed="0.25"
    >
      <nuxt-picture
        ref="picture"
        provider="directus"
        :src="contents.pictureFramed.src"
        format="webp"
        :alt="contents.pictureFramed.alt"
        class="picture-absolute"
      />
      <ELottie id="Cadre_01" start="top bottom-=15%" />
    </EParallax>
    <div class="app-arena-paris-basket-club__visual-transparent">
      <nuxt-picture
        provider="directus"
        :src="contents.pictureLogo.src"
        format="webp"
        :alt="contents.pictureLogo.alt"
      />
      <AtomsCornerPoints :size-points="8" />
    </div>
    <EParallax
      class="app-arena-paris-basket-club__visual-without-frame"
      :speed="0.5"
    >
      <nuxt-picture
        ref="picture"
        provider="directus"
        :src="contents.picture.src"
        format="webp"
        :alt="contents.picture.alt"
      />
    </EParallax>
    <ELottie
      id="Fleche_2"
      start="top bottom-=15%"
      class="app-arena-paris-basket-club__lottie-arrow"
    />
    <div class="app-arena-paris-basket-club__content">
      <ERichText
        class="app-arena-paris-basket-club__content__title"
        :content="contents.title"
      />

      <TP1 class="app-arena-paris-basket-club__content__subtitle" weight="bold">
        {{ contents.subtitle }}
      </TP1>

      <ERichText
        class="app-arena-paris-basket-club__content__paragraph"
        :content="contents.paragraph"
      />

      <AtomsLinkUnderline>EN SAVOIR PLUS SUR LE CLUB</AtomsLinkUnderline>
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
  mounted() {},
}
</script>

<style lang="scss">
.app-arena-paris-basket-club {
  position: relative;
  margin-top: 100vh;
  //   margin-top: desktop-vw(1080px);

  &__lottie-arrow.app-element-lottie {
    position: absolute;
    grid-column: 6 / span 1;
    width: 40%;
    top: desktop-vw(180px);
    left: desktop-vw(45px);
    transform: rotate(45deg);
    aspect-ratio: 12 / 48;
    height: auto !important;
  }

  &__visual-transparent {
    position: absolute;
    width: columns(1.5);
    grid-column: 6 / span 2;
    top: desktop-vw(25px);
    transform: rotate(7deg);
    aspect-ratio: 128 / 128;
    // left: 30%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include fake-transparent();

    picture {
      display: block;
      width: 55%;
      height: auto;
    }
  }

  &__visual-with-frame {
    position: relative;
    grid-column: 2 / span 4;
    aspect-ratio: 440 / 550;
    width: 100%;
    top: 0;
    left: 0;
    transform: rotate(-6deg);
    margin-bottom: desktop-vw(300px);

    picture {
      @include noise();
    }

    .app-element-lottie {
      width: 110%;
      top: 50%;
      left: 50%;
      height: auto;
      transform: translate(-50%, -50%) rotate(6deg);
    }
  }
  &__visual-without-frame {
    position: absolute;
    top: 0;
    left: 0;
    grid-column: 5 / span 3;
    aspect-ratio: 280 / 380;
    width: 100%;
    top: desktop-vw(300px);
    left: 0;
    transform: rotate(2deg);

    picture {
      @include noise();
    }
  }

  &__content {
    grid-column: 9 / span 4;

    &__subtitle,
    &__paragraph.app-element-rich-text {
      opacity: 0.8;
    }

    &__subtitle {
      margin-bottom: desktop-vw(15px);
    }

    &__paragraph.app-element-rich-text {
      .P2 {
        @include font-adihausDIN-medium();
      }
    }

    .app-atoms-link-underline {
      margin-top: desktop-vw(50px);
    }

    .P2 {
      text-transform: initial;
    }

    .H2 {
      margin-bottom: desktop-vw(25px);
    }
  }
}
</style>
