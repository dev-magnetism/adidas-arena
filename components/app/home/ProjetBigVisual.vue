<template>
  <div class="app-home-projet__big-visual">
    <nuxt-picture
      v-if="$mq !== 'sm'"
      class="app-home-projet__big-visual__left-top projet-visual"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />
    <nuxt-picture
      v-if="$mq !== 'sm'"
      class="app-home-projet__big-visual__left-top-upper projet-visual"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />

    <nuxt-picture
      class="app-home-projet__big-visual__principal projet-visual"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />

    <AtomsTitleTag
      v-if="$mq !== 'sm'"
      class="app-home-projet__big-visual__tag-top-upper app-projet-tag-4"
      bg="white"
      color="black"
      >PARIS porte de la chapelle</AtomsTitleTag
    >

    <AtomsTitleTag
      v-if="$mq !== 'sm'"
      bg="white"
      color="black"
      class="app-home-projet__big-visual__tag-bottom app-projet-tag-1"
      >DES MATCHS, DES EVENEMENTS, DES RESTAURANTS, DES JEUX, DES SALLES DE
      RÉUNIONS POUR TOUS
    </AtomsTitleTag>
  </div>
</template>

<style lang="scss">
.app-home-projet__big-visual {
  position: absolute;
  grid-column: 1 / span 5;
  width: 88%;
  aspect-ratio: 450 / 265;
  top: desktop-vw(300px);
  left: columns(0.8);
  transform: rotate(-6deg);

  @include mobile {
    aspect-ratio: 260/155;
    grid-column: 1 / span 5;
    width: 100%;
    left: columns(-0.25);
    top: mobile-vw(175px);
    transform: rotate(-4deg);
  }

  &__left-top {
    position: absolute;
    left: columns(0);
    top: -10%;
    aspect-ratio: 100/92;
    width: 20.5%;
    z-index: 1;
    @include mobile {
      display: none;
    }
    // min-width: 100px;
  }

  &__left-top-upper {
    position: absolute;
    width: 23%;
    aspect-ratio: 120 / 182;
    top: -42%;
    left: columns(0.55);
    z-index: -1;

    @include mobile {
      display: none;
    }
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

    @include mobile {
      display: none;
    }

    > .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(18px);
      line-height: desktop-vw(20px);
    }
  }

  &__tag-bottom {
    left: columns(1.4);
    bottom: -40%;
    transform: rotate(-6deg);
    width: columns(2.15);

    @include mobile {
      display: none;
    }

    > .P2 {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(16px);
    }
  }
}
</style>
