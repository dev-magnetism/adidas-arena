<template>
  <div class="app-home-projet grid-inner">
    <div class="app-home-projet__wrapper">
      <AtomsCornerPoints border-color="beige" points-color="beige" />

      <div class="app-home-projet__inner">
        <AppHomeProjetHeader />
        <AppHomeProjetBigVisual />

        <TH1 class="app-home-projet__title">Projet</TH1>
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

  &__find-out-more {
    width: desktop-vw(200px);
  }

  &__wrapper {
    height: 100%;
    width: 100%;
    background: var(--c-white);
    grid-column: 2 / span 10;
    aspect-ratio: 1165 / 730;
    position: relative;
    transform: rotate(-2.06deg);
  }

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    padding: desktop-vw(25px);

    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
  }

  &__title {
    writing-mode: vertical-rl;
    transform: scale(-1);
    display: inline-block;
    position: absolute;
    bottom: desktop-vw(15px);
    right: desktop-vw(5px);
  }
}
</style>
