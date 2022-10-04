<template>
  <div class="app-arena-paris-basket-club grid-inner">
    <EParallax
      ref="frameWrapper"
      class="app-arena-paris-basket-club__visual-with-frame"
      :speed="0.25"
    >
      <nuxt-picture
        ref="picture"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
        class="picture-absolute"
      />
      <ELottie start="top bottom-=15%" id="Cadre_01" />
    </EParallax>
    <div class="app-arena-paris-basket-club__visual-transparent">
      <nuxt-picture
        src="imgs/placeholder-logo-home.png"
        format="webp"
        alt="placeholder"
      />
      <AtomsCornerPoints :size-points="8" />
    </div>
    <EParallax
      class="app-arena-paris-basket-club__visual-without-frame"
      :speed="0.5"
    >
      <nuxt-picture
        ref="picture"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
    </EParallax>
    <ELottie
      id="Fleche_2"
      :markers="true"
      start="top bottom-=15%"
      class="app-arena-paris-basket-club__lottie-arrow"
    />
    <div class="app-arena-paris-basket-club__content">
      <TH2>PARIS BASKETBALL CLUB</TH2>
      <TP1 weight="bold"
        >L'ADIDAS ARENA disposera de son club de basketball résident à l’année :
        le Paris Basketball. Un effectif jeune, au jeu spectaculaire et
        offensif</TP1
      >
      <TP2 weight="medium"
        >Ce club, créé en 2018 incarne une des facettes phares du lifestyle
        urbain parisien : pour preuve, le grand Paris compte le plus grand
        nombre de licenciés en France ! <br /><br />
        Avec 35 rencontres annuelles, les matchs du Paris Basketball vous
        permettront de vibrer autour d’un sport fort en show, exploits
        techniques et émotions !
      </TP2>
      <AtomsLinkUnderline>EN SAVOIR PLUS SUR LE CLUB</AtomsLinkUnderline>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
}
</script>

<style lang="scss">
.app-arena-paris-basket-club {
  position: relative;
  margin-top: 100vh;
  //   margin-top: desktop-vw(1080px);

  &__lottie-arrow {
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
  }

  &__content {
    grid-column: 9 / span 4;

    :not(.H2) {
      opacity: 0.8;
    }

    :nth-child(2) {
      margin-bottom: desktop-vw(15px);
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
