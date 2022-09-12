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
        />
      </div>
      <div class="app-home-hero__second-visual">
        <nuxt-picture
          class="picture-absolute"
          src="imgs/placeholder.png"
          format="webp"
          alt="placeholder"
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
        <div class="app-home-hero__map__baseline">
          <AtomsTitleTag
            class="app-home-hero__map__coordinate"
            bg="beige"
            color="black"
            >48.897704 - 2.359456
          </AtomsTitleTag>
          <AtomsCTA
            class="app-home-hero__map__visit"
            :arrow="false"
            bg="red-adidas"
            :external="true"
            color="black"
            link="https://translate.google.fr/"
            >Visiter le lieu
          </AtomsCTA>
        </div>
        <AtomsCornerPoints position="1,2,3,4" />
      </div>
      <SvgHomeHeroSticker class="app-home-hero__sticker" />
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

  &__sticker {
    position: absolute;
    grid-column: 8 / span 5;
    transform: translate(-50%, -50%);
    top: 40%;
    z-index: 9;
  }

  &__map {
    grid-column: 8 / span 5;
    height: 80%;
    background: green;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;

    &__baseline {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-bottom: 20px;
      padding: desktop-vw(0px) desktop-vw(20px) desktop-vw(20px)
        desktop-vw(20px);
    }

    &__coordinate,
    &__visit {
      padding: desktop-vw(10px) desktop-vw(15px);

      > :first-child {
        @include font-adihausDIN-medium();
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);
      }
    }
  }

  &__title {
    grid-column: 2 / span 6;
    align-self: center;
    z-index: 1;
    font-size: min(130px, desktop-vw(130px));
    line-height: min(140px, desktop-vw(140px));
    max-width: 565px;
    // max-width: columns(5.5);
  }

  &__first-visual {
    position: absolute !important;
    left: 0;
    top: desktop-vw(-200px);
    // max-width: 350px;
    min-width: 250px;
    grid-column: 1 / span 3;
    width: 100%;
    aspect-ratio: 350 / 440;
    transform: rotate(5deg);
  }
  &__second-visual {
    position: absolute !important;
    left: 0;
    bottom: calc(min(-20px, desktop-vw(65px)));
    grid-column: 4 / span 3;
    width: 75%;
    // max-width: 255px;
    min-width: 200px;
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
