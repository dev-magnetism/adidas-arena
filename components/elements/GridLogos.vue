<template>
  <div
    class="app-element-grid-logos"
    :style="{
      '--cols': cols,
      '--rows': rows,
    }"
  >
    <div class="bloc big visible">
      <AtomsCornerPoints :size-points="6" position="1,2,3,4" />
      <img :src="arraytesttest.src" alt="test" />
    </div>
    <div class="bloc transparent visible">
      <AtomsCornerPoints :size-points="6" position="1,2,3,4" />
    </div>
    <div
      v-for="(logo, index) in arraytest"
      :key="index"
      :class="[
        `div${index + 1}`,
        {
          visible: index <= logos.length - 1,
          transparent: index > logos.length - 1,
        },
      ]"
      class="bloc"
    >
      <AtomsCornerPoints
        v-if="index <= logos.length - 1"
        :size-points="6"
        position="1,2,3,4"
      />
      <img v-if="index <= logos.length - 1" :src="logo.src" alt="test" />
    </div>
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
  },

  data() {
    return {
      partners: null,
      logos: [
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: true,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: true,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: true,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
      ],
    }
  },
  async fetch() {
    this.partners = await this.$directus.items('Partners').readByQuery({
      limit: -1,
    })

    const test = await this.$directus.files.readOne(this.partners.data[0].logo)

    console.log(test)

    console.log(this.partners)
  },
  computed: {
    arraytest() {
      return this.logos.filter((logo) => !logo.big)
    },
    arraytesttest() {
      return this.logos.find((logo) => logo.big)
    },
    nbElementDelete() {
      return this.logos.filter((logo) => logo.big).length
    },
  },
  methods: {
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
  },
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

  .div1 {
    grid-area: 1 / 2 / 2 / 3;
  }
  .div2 {
    grid-area: 1 / 4 / 2 / 5;
  }
  .div3 {
    grid-area: 2 / 3 / 3 / 4;
  }
  .div4 {
    grid-area: 2 / 4 / 3 / 5;
  }
  .div5 {
    grid-area: 3 / 4 / 4 / 5;
  }
  .div6 {
    grid-area: 3 / 5 / 4 / 6;
  }
  .div7 {
    grid-area: 4 / 6 / 5 / 7;
  }
  .div8 {
    grid-area: 6 / 1 / 7 / 2;
  }
  .div9 {
    grid-area: 6 / 4 / 7 / 5;
  }
  .div10 {
    grid-area: 6 / 5 / 7 / 6;
  }
  .div11 {
    grid-area: 7 / 3 / 8 / 4;
  }
  .div12 {
    grid-area: 7 / 2 / 8 / 3;
  }
  .div13 {
    grid-area: 5 / 4 / 6 / 5;
  }
  .div14 {
    grid-area: 7 / 6 / 8 / 7;
  }
  .div15 {
    grid-area: 2 / 6 / 3 / 7;
  }
  .div16 {
    grid-area: 3 / 2 / 4 / 3;
  }
  .div17 {
    grid-area: 5 / 1 / 6 / 2;
  }
  .div18 {
    grid-area: 5 / 5 / 6 / 6;
  }
  .div19 {
    grid-area: 2 / 5 / 3 / 6;
  }
  .div20 {
    grid-area: 6 / 6 / 7 / 7;
  }

  .bloc {
    aspect-ratio: 128 / 128;
    position: relative;
    // grid-row: span 1;
    // grid-column: span 1;
    height: 100%;
    width: 100%;
    // order: var(--order);
    display: flex;
    align-items: center;
    justify-content: center;

    .app-atoms-corner-points {
      outline: 1px solid var(--border-color) !important;
      border: none !important;
    }

    img {
      width: 50%;
      height: auto;
    }

    &.visible {
      background: var(--c-white);
    }

    &.transparent {
      grid-area: 3 / 1 / 4 / 2;
      @include fake-transparent();
    }

    &.big {
      // grid-row: span 2;
      // grid-column: span 2;
      aspect-ratio: 256 / 256;
      grid-area: 4 / 2 / 6 / 4;
    }
  }
}
</style>
