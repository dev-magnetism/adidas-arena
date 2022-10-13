<template>
  <div class="app-be-part-of-configurations-introduction grid-inner">
    <div class="app-be-part-of-configurations-introduction__f-row__content">
      <TH2
        class="app-be-part-of-configurations-introduction__f-row__content__title"
        >L’Adidas Arena, lorem ipsum dolor sit amet dolor sit</TH2
      >
      <TP2
        weight="bold"
        class="app-be-part-of-configurations-introduction__f-row__content__text"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus
        non nisi faucibus ultrices et id dui. Vestibulum pellentesque.</TP2
      >
    </div>

    <div class="app-be-part-of-configurations-introduction__f-row__visual">
      <nuxt-picture
        ref="picture"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
        class="picture-absolute"
      />
      <ELottie id="Cadre_02" />
    </div>

    <div class="app-be-part-of-configurations-introduction__s-row__visual">
      <AtomsCornerPoints :size-points="8" />
      <nuxt-picture
        ref="picture"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
        class="picture-absolute"
      />
    </div>

    <div class="app-be-part-of-configurations-introduction__s-row__content">
      <TH4
        class="app-be-part-of-configurations-introduction__s-row__content__title"
        >un lieux aux milles facettes</TH4
      >
      <TP2
        weight="medium"
        class="app-be-part-of-configurations-introduction__s-row__content__text"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus
        non nisi faucibus ultrices et id dui. Vestibulum pellentesque, lorem eu
        tempor rutrum, ante libero dignissim neque, non iaculis nibh leo
        pulvinar ipsum.
      </TP2>
    </div>
  </div>
</template>

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

      &__title {
      }

      &__text {
        text-transform: uppercase;
        margin-top: desktop-vw(15px);
        width: 65%;
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

      &__title {
      }

      &__text {
        margin-left: columns(1.35);
        margin-top: desktop-vw(30px);
        width: 65%;
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

      picture {
        z-index: 0;
      }
    }
  }
}
</style>
