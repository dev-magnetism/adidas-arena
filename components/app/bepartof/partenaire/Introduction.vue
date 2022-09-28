<template>
  <div class="app-be-part-of-partenaire-introduction grid-inner">
    <div class="app-be-part-of-partenaire-introduction__f-row__content">
      <TH2 class="app-be-part-of-partenaire-introduction__f-row__content__title"
        >être partenaire de l’adidas arena
      </TH2>
      <TP2
        class="app-be-part-of-partenaire-introduction__f-row__content__text"
        weight="bold"
      >
        Avec plus de 105 séances par an, notre écosystème de partenaires
        profitera de l’exposition d’une programmation riche. Ensemble, nous
        allons écrire une nouvelle page d’un territoire. Et Paris 2024 sera une
        formidable caisse de résonnance pour toutes les activités & parties
        prenantes de l’Accor Arena.
      </TP2>
    </div>
    <!-- <EFramedPicture color="red-adidas"> </EFramedPicture> -->

    <nuxt-picture
      class="app-be-part-of-partenaire-introduction__f-row__visual"
      src="imgs/placeholder.png"
      format="webp"
      alt="alt"
    />

    <EFramedPicture
      class="app-be-part-of-partenaire-introduction__s-row__visual"
      color="red-adidas"
    >
      <nuxt-picture
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
    </EFramedPicture>

    <div class="app-be-part-of-partenaire-introduction__s-row__content">
      <TH4 class="app-be-part-of-partenaire-introduction__s-row__content__title"
        >un partenariat aux bénéfices uniques</TH4
      >
      <TP2 class="app-be-part-of-partenaire-introduction__s-row__content__text">
        Les partenaires fondateurs, sponsors officiels et fournisseurs officiels
        de l’adidas profiteront de nombreux bénéfices à travers : une
        dénomination, une association de marque et communication, une
        exclusivité, de la visibilité média, du contenu commun, des activations
        & des services Hospitalités... Rejoignez-nous !
      </TP2>
    </div>
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
