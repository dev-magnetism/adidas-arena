<template>
  <div class="app-actualite-accessibility grid-inner">
    <div class="app-actualite-accessibility__wrapper">
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
  </div>
</template>

<script></script>

<style lang="scss">
.app-actualite-accessibility {
  margin-top: desktop-vw(120px);

  @include mobile {
    margin-top: mobile-vw(50px);
  }

  &__wrapper {
    grid-column: 1 / span 12;
    display: flex;
    justify-content: center;
    align-items: center;

    @include mobile {
      grid-column: 1 / span 6;
      align-items: unset;
    }
  }

  &-reading-time.P2 {
    text-transform: uppercase;
  }

  &-share.P2 {
    text-transform: uppercase;
  }

  .P2 {
    padding: desktop-vw(15px) desktop-vw(30px);
    border: 1px solid black;

    @include mobile {
      padding: mobile-vw(10px) mobile-vw(15px);
      display: flex;
      align-items: center;
    }

    &:not(:last-child) {
      border-right: none;
    }
    &:not(.app-actualite-accessibility-reading-time) {
      cursor: pointer;
    }
  }
}
</style>
