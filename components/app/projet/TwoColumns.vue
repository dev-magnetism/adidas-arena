<template>
  <div class="app-projet-two-columns grid-inner">
    <div class="app-projet-two-columns__f-r grid">
      <div class="app-projet-two-columns__f-r__visuals">
        <div class="app-projet-two-columns__f-r__fake-transparent" />
        <EParallax :speed="0.5">
          <div class="app-projet-two-columns__f-r__card">
            <AtomsCornerPoints :size-points="8" />
            <div class="app-projet-two-columns__f-r__card__content">
              <TH2
                weight="bold"
                class="app-projet-two-columns__f-r__card__content__title"
                >06</TH2
              >
              <TH2
                weight="bold"
                class="app-projet-two-columns__f-r__card__content__subtitle"
                >Millions</TH2
              >
              <TH3
                weight="medium"
                class="app-projet-two-columns__f-r__card__content__paragraph"
                >de bouchons en plastique collectés pour la construction des
                sièges de l'Arena !</TH3
              >
            </div>
            <AtomsCTA bg="blue-adidas" color="white"
              >Les points de collecte
            </AtomsCTA>
          </div>
        </EParallax>
      </div>
      <div class="app-projet-two-columns__f-r__content">
        <TH2 class="app-projet-two-columns__f-r__content__title"
          >Adidas Arena, un lieu utile & responsable</TH2
        >
        <TP1
          weight="regular"
          class="app-projet-two-columns__f-r__content__paragraph"
        >
          Une double dynamique écoresponsable -de conception et de
          fonctionnement- pour ancrer les meilleures pratiques existantes sur
          tout le parcours des visiteurs.
        </TP1>
      </div>
    </div>

    <div class="app-projet-two-columns__s-r grid">
      <div class="app-projet-two-columns__s-r__content">
        <TH2 class="app-projet-two-columns__s-r__content__title"
          >un modèle d’avenir</TH2
        >
        <TP1
          class="app-projet-two-columns__s-r__content__paragraph"
          weight="regular"
        >
          Une Arena tournée vers l’innovation, l’inclusion et la transformation
          du secteur de l’Entertainment. l'ADIDAS ARENA vise la certification
          ISO 20121, une norme internationale pour les acteurs de l’évènementiel
          qui souhaitent atteindre l’excellence éco-responsable.
        </TP1>
      </div>

      <div class="app-projet-two-columns__s-r__visuals">
        <nuxt-picture
          class="app-projet-two-columns__s-r__visual"
          src="imgs/placeholder.png"
          format="webp"
          alt="alt"
        />
        <EParallax position="top" :speed="0.5">
          <div class="app-projet-two-columns__s-r__card">
            <AtomsCornerPoints :size-points="8" />
            <div class="app-projet-two-columns__s-r__card__content">
              <TH2
                weight="bold"
                class="app-projet-two-columns__s-r__card__content__title"
                >06</TH2
              >
              <TH2
                weight="bold"
                class="app-projet-two-columns__s-r__card__content__subtitle"
              >
                Millions</TH2
              >
              <TH3
                weight="medium"
                class="app-projet-two-columns__s-r__card__content__paragraph"
                >de bouchons en plastique collectés pour la construction des
                sièges de l'Arena !</TH3
              >
            </div>
          </div>
        </EParallax>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-projet-two-columns {
  padding-top: desktop-vw(180px);

  &__s-r {
    grid-row: 2;
    grid-column: 1 / span 12;
    width: 100%;

    &__visuals {
      grid-column: 6 / span 6;
      position: relative;
    }

    &__visual {
      aspect-ratio: 345 / 430;
      display: block;
      width: columns(3.25);
      position: absolute;
      transform: rotate(-3deg);
      top: desktop-vw(-80px);
      left: 0;
    }

    &__card {
      width: columns(3.95);
      margin-left: auto;
      transform: rotate(5deg);
      position: relative;
      top: desktop-vw(-300px);

      &__content {
        padding: desktop-vw(45px) desktop-vw(40px) desktop-vw(45px)
          desktop-vw(40px);
        background: linear-gradient(
            rgba(251, 245, 238, 0.8) 0.1em,
            transparent 0.1em
          ),
          linear-gradient(
            90deg,
            rgba(251, 245, 238, 0.8) 0.1em,
            transparent 0.1em
          ),
          white;
        background-size: 1.3em 1.3em;

        &__title {
          font-size: desktop-vw(160px);
          line-height: desktop-vw(160px);
        }

        &__subtitle {
          font-size: desktop-vw(88px);
          line-height: desktop-vw(106px);
        }

        &__paragraph {
          font-size: desktop-vw(32px);
          line-height: desktop-vw(32px);
          opacity: 0.4;
          margin-top: desktop-vw(20px);
        }
      }
    }

    &__content {
      grid-column: 1 / span 4;

      &__title {
        width: columns(2.5);
      }

      &__paragraph {
        margin-top: desktop-vw(25px);
        margin-left: auto;
        width: columns(3);
      }
    }
  }

  &__f-r {
    grid-row: 1;
    grid-column: 1 / span 12;
    margin-bottom: desktop-vw(200px);

    &__visuals {
      grid-column: 2 / span 4;
      position: relative;
      margin-top: desktop-vw(120px);
    }

    &__card {
      z-index: 1;
      position: relative;
      width: 85%;
      background: white;
      margin-left: auto;
      transform: rotate(-2.85deg);
      top: desktop-vw(50px);

      &__content {
        padding: desktop-vw(25px) desktop-vw(40px) desktop-vw(15px)
          desktop-vw(40px);
        background: linear-gradient(
            rgba(251, 245, 238, 0.8) 0.1em,
            transparent 0.1em
          ),
          linear-gradient(
            90deg,
            rgba(251, 245, 238, 0.8) 0.1em,
            transparent 0.1em
          ),
          white;
        background-size: 1.3em 1.3em;

        &__title {
          font-size: desktop-vw(160px);
          line-height: desktop-vw(160px);
        }

        &__subtitle {
          font-size: desktop-vw(88px);
          line-height: desktop-vw(106px);
        }

        &__paragraph {
          font-size: desktop-vw(32px);
          line-height: desktop-vw(32px);
          opacity: 0.4;
        }
      }

      .app-atoms-cta {
        width: 100%;
      }
    }

    &__fake-transparent {
      aspect-ratio: 250 / 315;
      width: 60%;
      transform: rotate(1.5deg);
      position: absolute;
      top: 0;
      left: 0;

      @include fake-transparent();
    }
    &__content {
      grid-column: 8 / span 4;
      height: 100%;

      &__title {
      }

      &__paragraph {
        margin-top: desktop-vw(25px);
      }
    }
  }
}
</style>
