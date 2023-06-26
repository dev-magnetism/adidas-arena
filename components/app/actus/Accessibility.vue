<template>
  <div class="app-actualite-accessibility">
    <TP2 class="app-actualite-accessibility-a-plus" weight="bold">A+</TP2>
    <TP2 class="app-actualite-accessibility-a-minus" weight="bold">A-</TP2>
    <TP2 class="app-actualite-accessibility-reading-time" weight="medium"
      >Temps de lecture : 6MIN</TP2
    >
    <TP2
      color="blue-adidas"
      class="app-actualite-accessibility-share"
      weight="bold"
      >PARTAGER</TP2
    >
  </div>
</template>

<script></script>

<style lang="scss">
.app-actualite-accessibility {
  display: flex;
  justify-content: center;
  margin-top: desktop-vw(120px);

  &-reading-time.P2 {
    text-transform: uppercase;
  }

  &-share.P2 {
    text-transform: uppercase;
  }

  .P2 {
    padding: desktop-vw(15px) desktop-vw(30px);
    border: 1px solid black;

    &:not(:last-child) {
      border-right: none;
    }
    &:not(.app-actualite-accessibility-reading-time) {
      cursor: pointer;
    }
  }
}
</style>
