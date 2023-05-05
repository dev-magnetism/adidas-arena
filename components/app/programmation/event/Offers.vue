<template>
  <div class="app-programmation-event-orders block-inner">
    <TH2 weight="bold" class="app-programmation-event-orders__title">
      Les offres
    </TH2>
    <div class="app-programmation-event-orders__items grid">
      <div class="app-programmation-event-orders__item">
        <picture class="app-programmation-event-orders__item__visual">
          <img src="https://picsum.photos/200/300" alt="fdsfds" />
        </picture>
        <div class="app-programmation-event-orders__item__content">
          <TH2Bis>Parking</TH2Bis>
          <TP1>
            Accédez à votre événement en un temps record en réservant votre
            parking, et bénéficiez d'une place de premier choix au coeur de
            l'Arena !
          </TP1>
          <AtomsCTA>Réserver</AtomsCTA>
        </div>
      </div>
      <div class="app-programmation-event-orders__item">
        <picture class="app-programmation-event-orders__item__visual">
          <img src="https://picsum.photos/200/300" alt="fdsfds" />
        </picture>
        <div class="app-programmation-event-orders__item__content">
          <TH2Bis>Parking</TH2Bis>
          <TP1>
            Accédez à votre événement en un temps record en réservant votre
            parking, et bénéficiez d'une place de premier choix au coeur de
            l'Arena !
          </TP1>
          <AtomsCTA>Réserver</AtomsCTA>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-programmation-event-orders {
  margin-top: desktop-vw(75px);

  @include mobile {
    margin-top: mobile-vw(65px);
  }

  &__title {
    margin-bottom: desktop-vw(30px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__items {
  }

  &__item {
    grid-column: span 4;
    background: var(--c-white);
    border: 1px solid var(--c-black);

    @include mobile {
      grid-column: span 6;
    }

    &__visual {
      aspect-ratio: 435 / 300;
      width: 100%;
      height: auto;
      display: block;

      @include mobile {
        aspect-ratio: 340 / 300;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &__content {
      padding: desktop-vw(25px) desktop-vw(25px) 0 desktop-vw(25px);
      border-top: 1px solid var(--c-black);
      display: flex;
      flex-direction: column;

      @include mobile {
        padding: mobile-vw(25px) mobile-vw(25px) 0 mobile-vw(25px);
      }

      .app-atoms-cta {
        align-self: flex-end;
        margin-right: desktop-vw(-25px);
        border-right: none;
        border-bottom: none;
        min-width: 60%;

        @include mobile {
          margin-right: mobile-vw(-25px);
        }
      }

      .H2-bis {
        margin-bottom: desktop-vw(15px);

        @include mobile {
          margin-bottom: mobile-vw(25px);
        }
      }

      .P1 {
        margin-bottom: desktop-vw(50px);

        @include mobile {
          margin-bottom: mobile-vw(50px);
        }
      }
    }
  }
}
</style>
