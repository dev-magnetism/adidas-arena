<template>
  <div class="app-home-hero block-inner">
    <div class="app-home-hero__inner grid">
      <TH1 class="app-home-hero__title">
        <AtomsTextStroke>BIENVENUE À</AtomsTextStroke> L'ADIDAS ARENA, ICI C'EST
        CHEZ VOUS !
      </TH1>
      <div class="app-home-hero__first-visual">
        <nuxt-picture
          class="picture-absolute"
          src="imgs/placeholder.png"
          format="webp"
          alt="placeholder"
          sizes="sm:50vw lg:100vw"
          preload
          loading="lazy"
        />
      </div>
      <div class="app-home-hero__second-visual">
        <nuxt-picture
          class="picture-absolute"
          src="imgs/placeholder.png"
          format="webp"
          alt="placeholder"
          sizes="sm:50vw lg:100vw"
          preload
          loading="lazy"
        />
      </div>
      <div class="app-home-hero__scroll-indicator">
        <TP1>Scroll</TP1>
        <SvgHomeHeroUnion />
      </div>
      <div class="app-home-hero__localisation">
        <TP1 class="app-home-hero__localisation__city">Paris</TP1>
        <TP1 class="app-home-hero__localisation__place">
          PORTE DE LA CHAPELLE
        </TP1>
      </div>
      <div class="app-home-hero__map">
        <TP1 class="app-home-hero__localisation__place">
          PORTE DE LA CHAPELLE
        </TP1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-home-hero {
  width: 100%;
  height: 100vh;
  padding-top: desktop-vw(40px);
  padding-bottom: desktop-vw(40px);

  &__inner {
    width: 100%;
    height: 100%;
    border: 1px solid #181818;
    position: relative;
  }

  &__map {
    grid-column: 8 / span 5;
    height: 80%;
    background: green;
    align-self: flex-end;
  }

  &__title {
    grid-column: 2 / span 6;
    align-self: center;
    z-index: 1;
    min-width: columns(5);
    // max-width: columns(5.5);
  }

  &__first-visual {
    position: absolute !important;
    left: 0;
    top: 0;
    min-width: 280px;
    width: columns(3);
    aspect-ratio: 350 / 440;
    transform: rotate(5deg);
  }
  &__second-visual {
    position: absolute !important;
    left: 0;
    bottom: desktop-vw(65px);
    left: columns(4);
    width: columns(2.5);
    min-width: 220px;
    aspect-ratio: 255 / 320;
    transform: rotate(-6deg);
  }

  &__localisation {
    position: absolute;
    bottom: 15px;
    left: 0;
    grid-column: 2 / span 6;
    display: flex;
    flex-direction: column;

    &__city {
      @include font-adihausDIN-bold();
    }
    &__place {
    }
  }

  &__scroll-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: desktop-vw(25px) desktop-vw(15px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #181818;
    border-right: 1px solid #181818;

    .P1 {
      font-size: 12px;
      line-height: 15px;
    }

    svg {
      margin-top: desktop-vw(25px);
    }
  }
}
</style>
