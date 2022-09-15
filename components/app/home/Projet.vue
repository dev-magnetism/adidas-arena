<template>
  <div class="app-home-projet grid-inner">
    <div class="app-home-projet__wrapper">
      <AtomsCornerPoints border-color="beige" points-color="beige" />

      <div class="app-home-projet__inner">
        <AppHomeProjetHeader />
        <AppHomeProjetBigVisual />
        <AppHomeProjetPlan />

        <EFramedPicture
          :fake-transparent="true"
          color="white"
          class="app-home-projet__framed-picture"
        >
          <nuxt-picture src="imgs/placeholder.png" format="webp" alt="alt" />
        </EFramedPicture>
        <AtomsTitleTag class="app-home-projet__tag-top" bg="beige" color="black"
          >80% des surfaces du bâtiment végétalisées.
        </AtomsTitleTag>
        <nuxt-picture
          class="app-home-projet__visual__top-upper"
          src="imgs/placeholder.png"
          format="webp"
          alt="alt"
        />

        <TH2 weight="bold" class="app-home-projet__title">Projet</TH2>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-home-projet {
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(50% 50% at 50% 50%, #3a4f68 0%, #15191e 100%);
  margin-top: desktop-vw(200px);
  margin-bottom: desktop-vw(70px);
  padding-top: desktop-vw(135px);
  padding-bottom: desktop-vw(135px);

  &__visual__top-upper {
    position: absolute;
    grid-column: 5 / span 2;
    aspect-ratio: 200/95;
    transform: rotate(-5deg);
    top: 4%;
    left: 20%;
    width: 100%;
  }
  &__tag-top {
    position: absolute;
    grid-column: 6 / span 4;
    top: 15%;
    padding: desktop-vw(10px);
  }

  &__framed-picture {
    background-color: var(--c-white);
    grid-column: 8 / span 3;
    aspect-ratio: 250/315;
    width: 82%;
    left: 18%;
    z-index: -4;
    padding: desktop-vw(35px) desktop-vw(35px);
    transform: rotate(-2deg);

    > :first-child {
      transform: rotate(-2deg);
    }
  }

  &__find-out-more {
    width: desktop-vw(200px);
  }

  &__wrapper {
    height: 100%;
    width: 105%;
    background: var(--c-white);
    grid-column: 2 / span 10;
    aspect-ratio: 1165/760;
    position: relative;
    transform: translateX(-2.5%) rotate(-2deg);
  }

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    padding: desktop-vw(35px) desktop-vw(25px);

    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
  }

  &__title {
    writing-mode: vertical-rl;
    transform: scale(-1);
    display: inline-block;
    position: absolute;
    bottom: desktop-vw(30px);
    right: desktop-vw(5px);
    font-size: desktop-vw(180px);
    line-height: desktop-vw(180px);
  }
}
</style>
