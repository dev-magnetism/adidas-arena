<template>
  <div
    class="app-element-grid-logos"
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
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
.app-element-grid-logos {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
  grid-auto-flow: row dense;
  grid-gap: 1px;

  .app-element-grid-logos-bloc {
    &.transparent {
      grid-area: 3 / 1 / 4 / 2;
    }
    &.big {
      grid-area: 4 / 2 / 6 / 4;
    }
    &-1 {
      grid-area: 1 / 2 / 2 / 3;
    }
    &-2 {
      grid-area: 1 / 4 / 2 / 5;
    }
    &-3 {
      grid-area: 2 / 3 / 3 / 4;
    }
    &-4 {
      grid-area: 2 / 4 / 3 / 5;
    }
    &-5 {
      grid-area: 3 / 4 / 4 / 5;
    }
    &-6 {
      grid-area: 3 / 5 / 4 / 6;
    }
    &-7 {
      grid-area: 4 / 6 / 5 / 7;
    }
    &-8 {
      grid-area: 6 / 1 / 7 / 2;
    }
    &-9 {
      grid-area: 6 / 4 / 7 / 5;
    }
    &-10 {
      grid-area: 6 / 5 / 7 / 6;
    }
    &-11 {
      grid-area: 7 / 3 / 8 / 4;
    }
    &-12 {
      grid-area: 7 / 2 / 8 / 3;
    }
    &-13 {
      grid-area: 5 / 4 / 6 / 5;
    }
    &-14 {
      grid-area: 7 / 6 / 8 / 7;
    }
    &-15 {
      grid-area: 2 / 6 / 3 / 7;
    }
    &-16 {
      grid-area: 3 / 2 / 4 / 3;
    }
    &-17 {
      grid-area: 5 / 1 / 6 / 2;
    }
    &-18 {
      grid-area: 5 / 5 / 6 / 6;
    }
    &-19 {
      grid-area: 2 / 5 / 3 / 6;
    }
    &-20 {
      grid-area: 6 / 6 / 7 / 7;
    }

    @include mobile {
      &.big {
        grid-area: 4 / 2 / 6 / 4;
      }
      &.transparent {
        grid-area: 3 / 1 / 4 / 2;
      }
      &-1 {
        grid-area: 1 / 4 / 2 / 5;
      }
      &-2 {
        grid-area: 2 / 4 / 3 / 5;
      }
      &-3 {
        grid-area: 3 / 4 / 4 / 5;
      }
      &-4 {
        grid-area: 6 / 4 / 7 / 5;
      }
      &-5 {
        grid-area: 7 / 3 / 8 / 4;
      }
      &-6 {
        grid-area: 8 / 3 / 9 / 4;
      }
      &-7 {
        grid-area: 7 / 2 / 8 / 3;
      }
      &-8 {
        grid-area: 6 / 1 / 7 / 2;
      }
      &-9 {
        grid-area: 2 / 3 / 3 / 4;
      }
      &-10 {
        grid-area: 1 / 2 / 2 / 3;
      }
      &-11 {
        grid-area: 3 / 2 / 4 / 3;
      }
      &-12 {
        grid-area: 4 / 4 / 5 / 5;
      }
      &-13 {
        grid-area: 7 / 4 / 8 / 5;
      }
      &-14 {
        grid-area: 7 / 1 / 8 / 2;
      }
      &-15 {
        grid-area: 5 / 1 / 6 / 2;
      }
      &-16 {
        grid-area: 6 / 2 / 7 / 3;
      }
      &-17 {
        grid-area: 4 / 1 / 5 / 2;
      }
      &-18 {
        grid-area: 3 / 3 / 4 / 4;
      }
      &-19 {
        grid-area: 8 / 2 / 9 / 3;
      }
      &-20 {
        grid-area: 8 / 4 / 9 / 5;
      }
    }
  }
}
</style>
