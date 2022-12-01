<template>
  <div class="app-header">
    <nuxt-link to="/">Accueil</nuxt-link>
    <nuxt-link to="/projet">Projet</nuxt-link>
    <nuxt-link to="/arena">Arena</nuxt-link>
    <nuxt-link to="/le-bloc">Le bloc</nuxt-link>
    <nuxt-link to="/be-part-of/hospitalite">Hospitalite</nuxt-link>
    <nuxt-link to="/be-part-of/configurations">Configurations</nuxt-link>
    <nuxt-link to="/be-part-of/partenaire">Partenaire</nuxt-link>
    <!-- <SvgArenaLogo class="app-header__logo" />
    <div class="app-header__burger"><p>Menu</p></div> -->
  </div>
</template>

<style lang="scss">
.app-header {
  position: fixed;
  top: desktop-vw(60px);
  left: 0%;
  z-index: 2;
  width: 100%;
  // padding-left: var(--layout-margin);
  // padding-right: var(--layout-margin);
  // display: flex;
  // align-items: center;
  // justify-content: center;

  &__logo {
    margin-left: auto;
  }

  &__burger {
    margin-left: auto;
  }

  a {
    @include p1();
    text-transform: uppercase;
    @include font-adihausDIN-bold();

    margin-right: desktop-vw(10px);

    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
