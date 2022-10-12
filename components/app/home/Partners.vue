<template>
  <div class="app-home-partners grid">
    <div class="app-home-partners__content">
      <TH1 :split="true" class="app-home-partners__title">
        Un écosystème complémentaire de partenaires
      </TH1>
      <TP2 class="app-home-partners__principal-paragraph" weight="bold">
        Aujourd’hui près de 20 marques leaders sur leur marché font confiance à
        l’Accor Arena et à ses équipes. Ces marques ont investi pour profiter de
        l’exposition d’une programmation riche et diversifiée de plus de 135
        séances par an.
      </TP2>
      <TP2 class="app-home-partners__secondary-paragraph">
        Après les travaux de rénovation, l’Accor Arena est devenu l’un des
        terrains d’animation et d’engagement favori des marques aux côtés de
        Roland-Garros ou du PSG. Les équipes de l’Arena ont le privilège et
        l’exigence d’accompagner AccorHotels, DHL, American Express, Heineken,
        Coca Cola, Pierre Hermé, Moet Hennessy, Samsung, et bien d’autres encore
        dans le déploiement de leur politique partenariale.
      </TP2>
      <AtomsCTA>Devenir partenaire</AtomsCTA>
    </div>
    <EGridLogos
      :cols="$mq !== 'sm' ? 6 : 4"
      :rows="$mq !== 'sm' ? 7 : 8"
      class="app-home-partners__grid-logos"
    />
    <EPartnersTotal />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.app-home-partners {
  position: relative;
  padding-bottom: desktop-vw(140px);

  @include mobile {
    row-gap: 0px;
    padding-bottom: 0px;
  }

  &__content {
    grid-column: 1 / span 6;

    .app-atoms-cta {
      .P2 {
        @include font-tuskerGrotesk-medium();

        letter-spacing: 0.04em;
      }
    }
  }

  &__title.H1 {
    margin-bottom: desktop-vw(25px);

    @include mobile {
      margin-bottom: mobile-vw(30px);
    }
  }
  &__principal-paragraph {
    margin-bottom: desktop-vw(25px);
    width: 50%;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(25px);
    }
  }
  &__secondary-paragraph {
    margin-bottom: desktop-vw(50px);
    width: 52.5%;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(50px);
    }
  }
  .app-atoms-cta {
    width: 52.5%;

    @include mobile {
      width: 100%;
    }
  }

  &__grid-logos {
    grid-column: 6 / span 8;
    position: absolute;
    top: desktop-vw(140px);
    left: 0;

    @include mobile {
      position: relative;
      grid-column: 1 / span 6;
      top: 0;
      margin-top: mobile-vw(75px);
    }
  }
}
</style>
