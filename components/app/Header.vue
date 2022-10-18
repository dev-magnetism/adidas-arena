<template>
  <div class="app-header">
    <a href="/">Accueil</a>
    <a href="/projet">Projet</a>
    <a href="/arena">Arena</a>
    <a href="/le-bloc">Le bloc</a>
    <a href="/be-part-of/hospitalite">Hospitalite</a>
    <a href="/be-part-of/configurations">Configurations</a>
    <a href="/be-part-of/partenaire">Partenaire</a>
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
