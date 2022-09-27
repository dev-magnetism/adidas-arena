<template>
  <div class="app-projet-plan grid-inner">
    <div class="app-projet-plan__content">
      <TH4 class="app-projet-plan__content__title"
        >ADIDAS ARENA <br />
        NORD EST PARISIEN <br />
        PORTE DE LA CHAPELLE</TH4
      >
      <TP1 weight="bold" class="app-projet-plan__content__subtitle"
        >Smart, inspirante, lumineuse,
      </TP1>
      <TP2 weight="medium" class="app-projet-plan__content__paragraph"
        >Cette Arena nouvelle génération va transformer tout un quartier. <br />
        <br />
        Participez au renouveau d’un territoire à travers ce nouveau lieu de vie
        hybride qui fera émerger des talents !</TP2
      >
    </div>
    <div class="app-projet-plan__visual">
      <AtomsCornerPoints :size-points="8" />

      <SvgPlan />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
}
</script>

<style lang="scss">
.app-projet-plan {
  padding-top: desktop-vw(190px);

  &__content {
    grid-column: 1 / span 4;
    margin-top: desktop-vw(50px);

    &__title.H4 {
      margin-bottom: desktop-vw(25px);
      @include font-adihausDIN-cn-bold();
    }

    &__subtitle {
      margin-bottom: desktop-vw(25px);
    }

    &__paragraph.P2 {
      text-transform: initial;
      width: 65%;
    }
  }

  &__visual {
    grid-column: 5 / span 7;
    aspect-ratio: 860/540;
    transform: rotate(4deg);
    width: 107.5%;
    position: relative;

    &::after {
      content: '';
      background: url('/imgs/projet/plan-bg.webp');
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      mix-blend-mode: multiply;
      pointer-events: none;
    }

    svg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
