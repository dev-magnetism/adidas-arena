<template>
  <div
    class="app-bepartof-partenaire-logos"
    :style="{
      '--cols': cols,
      '--rows': rows,
    }"
  >
    <EGridLogosBloc :big="true" :content="mainPartner" />

    <EGridLogosBloc :transparent="true" />

    <EGridLogosBloc
      v-for="(logo, index) in secondaryPartners"
      :key="index"
      :class="[`app-element-grid-logos-bloc-${index + 1}`]"
      :content="logo"
    />
  </div>
</template>

<script>
export default {
  props: {
    cols: {
      type: Number,
      default: 6,
    },
    rows: {
      type: Number,
      default: 7,
    },
    logos: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    secondaryPartners() {
      return this.logos.filter((logo) => !logo.big)
    },
    mainPartner() {
      return this.logos.find((logo) => logo.big)
    },
  },
  methods: {},
}
</script>

<style lang="scss">
.app-bepartof-partenaire-logos {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
  grid-auto-flow: row dense;
  grid-gap: 1px;

  .app-element-grid-logos-bloc {
    &.big {
      grid-area: 3 / 6 / 5 / 8;
    }
    &.transparent {
      grid-area: 2 / 5 / 3 / 6;
    }
    &-1 {
      grid-area: 6 / 9 / 7 / 10;
    }
    &-2 {
      grid-area: 5 / 8 / 6 / 9;
    }
    &-3 {
      grid-area: 1 / 8 / 2 / 9;
    }
    &-4 {
      grid-area: 2 / 8 / 3 / 9;
    }
    &-5 {
      grid-area: 2 / 9 / 3 / 10;
    }
    &-6 {
      grid-area: 5 / 2 / 6 / 3;
    }
    &-7 {
      grid-area: 6 / 3 / 7 / 4;
    }
    &-8 {
      grid-area: 6 / 4 / 7 / 5;
    }
    &-9 {
      grid-area: 5 / 5 / 6 / 6;
    }
    &-10 {
      grid-area: 4 / 5 / 5 / 6;
    }
    &-11 {
      grid-area: 4 / 2 / 5 / 3;
    }
    &-12 {
      grid-area: 3 / 3 / 4 / 4;
    }
    &-13 {
      grid-area: 2 / 3 / 3 / 4;
    }
    &-14 {
      grid-area: 2 / 10 / 3 / 11;
    }
    &-15 {
      grid-area: 3 / 10 / 4 / 11;
    }
    &-16 {
      grid-area: 4 / 9 / 5 / 10;
    }
    &-17 {
      grid-area: 6 / 7 / 7 / 8;
    }
    &-18 {
      grid-area: 3 / 2 / 4 / 3;
    }
    &-19 {
      grid-area: 3 / 5 / 4 / 6;
    }
    &-20 {
      grid-area: 3 / 8 / 4 / 9;
    }
  }
}
</style>
