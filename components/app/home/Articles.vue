<template>
  <div class="app-home-articles">
    <div class="app-home-articles__heading grid">
      <TH2 class="app-home-articles__heading__title">test</TH2>
      <AtomsCTA>Voir plus</AtomsCTA>
    </div>
    <div class="app-home-articles__items grid">
      <AppActusCard />
      <AppActusCard />
      <AppActusCard />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.app-home-articles {
  &__heading {
    &__title {
      grid-column: 1 / span 8;

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-black);
        -webkit-text-fill-color: transparent;
      }

      .H2.medium {
        @include font-adihausDIN-cn-bold();
      }

      @include mobile {
        grid-column: 1 / span 6;
        grid-row: 1;
        width: 100%;
      }
    }

    .app-atoms-cta {
      grid-column: 10 / span 3;
      align-self: center;
      width: 80%;
      margin-left: auto;
    }
  }
  &__items {
    grid-row: 2;
  }
}
</style>
