<template>
  <div class="app-arena-partners grid">
    <div class="app-arena-partners__content">
      <TH1 class="app-arena-partners__title">
        Un écosystème complémentaire de partenaires
      </TH1>
      <TP2 class="app-arena-partners__principal-paragraph" weight="bold">
        Aujourd’hui près de 20 marques leaders sur leur marché font confiance à
        l’Accor Arena et à ses équipes. Ces marques ont investi pour profiter de
        l’exposition d’une programmation riche et diversifiée de plus de 135
        séances par an.
      </TP2>
      <TP2 class="app-arena-partners__secondary-paragraph">
        Après les travaux de rénovation, l’Accor Arena est devenu l’un des
        terrains d’animation et d’engagement favori des marques aux côtés de
        Roland-Garros ou du PSG. Les équipes de l’Arena ont le privilège et
        l’exigence d’accompagner AccorHotels, DHL, American Express, Heineken,
        Coca Cola, Pierre Hermé, Moet Hennessy, Samsung, et bien d’autres encore
        dans le déploiement de leur politique partenariale.
      </TP2>
      <AtomsCTA>Devenir partenaire</AtomsCTA>
    </div>
    <EGridLogos class="app-arena-partners__grid-logos" />
    <div class="app-arena-partners__total">
      <TH1>08</TH1>
      <TH2>partenaires</TH2>
    </div>
  </div>
</template>

<style lang="scss">
.app-arena-partners {
  position: relative;
  padding-bottom: desktop-vw(140px);
  margin-top: desktop-vw(130px);

  &__total {
    grid-column: 11 / span 2;
    text-align: right;
    justify-self: flex-end;

    .H2 {
      font-size: desktop-vw(24px);
      line-height: desktop-vw(24px);
      opacity: 0.35;
    }
  }

  &__content {
    grid-column: 2 / span 6;

    .app-atoms-cta {
      .P2 {
        @include font-tuskerGrotesk-medium();
        font-size: desktop-vw(24px);
        line-height: desktop-vw(32px);
        letter-spacing: 0.04em;
      }
    }
  }

  &__title {
    margin-bottom: desktop-vw(25px);
  }
  &__principal-paragraph {
    margin-bottom: desktop-vw(25px);
    width: 50%;
  }
  &__secondary-paragraph {
    margin-bottom: desktop-vw(50px);
    width: 52.5%;
  }
  .app-atoms-cta {
    width: 52.5%;
  }

  &__grid-logos {
    grid-column: 7 / span 6;
    position: absolute;
    top: desktop-vw(140px);
    left: 0;
  }
}
</style>
