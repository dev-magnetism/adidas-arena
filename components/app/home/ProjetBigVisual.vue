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
  </div>
</template>

<style lang="scss">
.app-home-projet__big-visual {
  position: absolute;
  grid-column: 1 / span 5;
  width: 85%;
  aspect-ratio: 450 / 265;
  bottom: calc(desktop-vw(25px) + desktop-vw(150px));
  left: columns(1);
  transform: rotate(-6deg);

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
  }

  .app-atoms-title-tag {
    position: absolute;
  }

  &__tag-top-upper {
    left: columns(1.65);
    top: -30%;
    transform: rotate(6deg);
  }
  &__tag-top {
    left: columns(-0.25);
    bottom: 15%;
    transform: rotate(-2.5deg);
  }
  &__tag-middle {
    bottom: -10%;
    left: columns(0);
    transform: rotate(1.45deg);
  }
  &__tag-bottom {
  }
}
</style>
