<template>
  <div class="app-header">
    <SmartLink href="/">Accueil</SmartLink>
    <SmartLink href="/projet">Projet</SmartLink>
    <SmartLink href="/arena">Arena</SmartLink>
    <SmartLink href="/le-bloc">Le bloc</SmartLink>
    <SmartLink href="/be-part-of/hospitalite">Hospitalite</SmartLink>
    <SmartLink href="/be-part-of/configurations">Configurations</SmartLink>
    <SmartLink href="/be-part-of/partenaire">Partenaire</SmartLink>
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
