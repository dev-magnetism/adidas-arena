<template>
  <div class="app-home-projet__big-visual">
    <nuxt-picture
      class="app-home-projet__big-visual__left-top"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />
    <nuxt-picture
      class="app-home-projet__big-visual__left-top-upper"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />

    <nuxt-picture
      class="app-home-projet__big-visual__principal"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />

    <AtomsTitleTag
      class="app-home-projet__big-visual__tag-top-upper"
      bg="beige"
      color="black"
      >PARIS porte de la chapelle</AtomsTitleTag
    >
    <AtomsTitleTag
      class="app-home-projet__big-visual__tag-top"
      bg="beige"
      color="black"
      >Coton recyclé pour l’isolation</AtomsTitleTag
    >
    <AtomsTitleTag
      class="app-home-projet__big-visual__tag-middle"
      bg="beige"
      color="black"
      >aluminium recyclable
    </AtomsTitleTag>
    <AtomsTitleTag
      bg="beige"
      color="black"
      class="app-home-projet__big-visual__tag-bottom"
      >DES MATCHS, DES EVENEMENTS, DES RESTAURANTS, DES JEUX, DES SALLES DE
      RÉUNIONS POUR TOUS
    </AtomsTitleTag>
    <AtomsCTA
      class="app-home-projet__big-visual__cta"
      color="beige"
      bg="blue-adidas"
      >En savoir plus</AtomsCTA
    >
  </div>
</template>

<style lang="scss">
.app-home-projet__big-visual {
  position: absolute;
  grid-column: 1 / span 5;
  width: 88%;
  aspect-ratio: 450 / 265;
  bottom: calc(desktop-vw(25px) + desktop-vw(150px));
  left: columns(0.8);
  transform: rotate(-6deg);

  &__cta {
    position: absolute;
    width: columns(2.25);
    // width: desktop-vw(195px);
    bottom: -58%;
    left: columns(3);
    padding: desktop-vw(20px) desktop-vw(20px);

    .P2 {
      @include font-adihausDIN-cn-medium();
    }
  }

  &__left-top {
    position: absolute;
    left: columns(0);
    top: -10%;
    aspect-ratio: 100/92;
    width: 20.5%;
    z-index: 1;
    // min-width: 100px;
  }

  &__left-top-upper {
    position: absolute;
    width: 23%;
    aspect-ratio: 120 / 182;
    top: -42%;
    left: columns(0.55);
    z-index: -1;
    // min-width: 120px;
  }

  &__principal {
    z-index: -2;
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
  }

  .app-atoms-title-tag {
    position: absolute;
  }

  &__tag-top-upper {
    left: columns(1.65);
    bottom: 115%;
    transform: rotate(6deg);
  }
  &__tag-top {
    left: columns(-0.25);
    bottom: 12%;
    transform: rotate(-2.5deg);
  }
  &__tag-middle {
    bottom: -10%;
    left: columns(-0.1);
    transform: rotate(1.45deg);
    .P2 {
      font-size: desktop-vw(15px);
      line-height: desktop-vw(20px);
    }
  }
  &__tag-bottom {
    left: columns(1.4);
    bottom: -40%;
    transform: rotate(-6deg);
    width: columns(2.15);

    .P2 {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(16px);
    }
  }
}
</style>
