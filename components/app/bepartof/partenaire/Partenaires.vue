<template>
  <div class="app-be-part-of-partenaire-partenaires grid-inner">
    <TH1>Déjà 12 partenaires</TH1>
    <AppBepartofPartenairePartenairesLogos />
    <AppArenaGallery />
  </div>
</template>

<style lang="scss">
.app-be-part-of-partenaire-introduction {
  position: relative;
  margin-bottom: desktop-vw(120px);

  &__f-row {
    &__content {
      grid-column: 2 / span 5;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      width: 95%;

      &__title {
        text-transform: uppercase;
        margin-bottom: desktop-vw(20px);
      }
      &__text {
        text-transform: uppercase;
        width: 80%;
      }
    }
    &__visual {
      grid-column: 7 / span 6;
      grid-row: 1;
      transform: rotate(3deg);
      aspect-ratio: 650/785;
      width: 100%;
      left: columns(0);
      position: relative;
      margin-top: desktop-vw(80px);
    }
  }

  &__s-row {
    &__content {
      grid-column: 8 / span 4;
      grid-row: 2;
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: desktop-vw(80px);

      &__title {
        margin-bottom: desktop-vw(30px);
      }
      &__text {
        width: 80%;
      }
    }

    &__visual {
      grid-column: 2 / span 5;
      grid-row: 2;
      //   transform: rotate(3deg);
      aspect-ratio: 545/670;
      width: 100%;
      position: relative;
      top: -60%;
      transform: rotate(-4deg);
      width: 105%;
    }
  }
}
</style>
