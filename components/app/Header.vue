<template>
  <div class="app-header">
    <nuxt-link to="/">Accueil</nuxt-link>
    <nuxt-link to="/projet">Projet</nuxt-link>
    <nuxt-link to="/arena">Arena</nuxt-link>
    <nuxt-link to="/le-bloc">Le bloc</nuxt-link>
    <nuxt-link to="/be-part-of/hospitalite">Hospitalite</nuxt-link>
    <nuxt-link to="/be-part-of/configurations">Configurations</nuxt-link>
    <nuxt-link to="/be-part-of/partenaire">Partenaire</nuxt-link>
  </div>
</template>

<style lang="scss">
.app-header {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 999;

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
