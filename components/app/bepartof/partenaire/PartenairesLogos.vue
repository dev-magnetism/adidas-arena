<template>
  <div
    class="app-bepartof-partenaire-logos"
    :style="{
      '--cols': cols,
      '--rows': rows,
    }"
  >
    <!-- <ERichText :content="partners?.data[0].test_wysiwyg"></ERichText> -->
    <div class="bloc big visible">
      <AtomsCornerPoints :size-points="6" position="1,2,3,4" />
      <img :src="arraytesttest.src" alt="test" />
    </div>
    <div class="bloc transparent visible">
      <SvgYou />
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
  // async fetch() {
  //   this.partners = await this.$directus.items('Partners').readByQuery({
  //     limit: -1,
  //   })

  //   // const test = await this.$directus.files.readOne(this.partners.data[0].logo)

  //   // console.log(test)

  //   console.log(this.partners)
  // },
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
.app-bepartof-partenaire-logos {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
  grid-auto-flow: row dense;
  grid-gap: 1px;

  .div1 {
    grid-area: 6 / 9 / 7 / 10;
  }
  .div2 {
    grid-area: 5 / 8 / 6 / 9;
  }
  .div3 {
    grid-area: 1 / 8 / 2 / 9;
  }
  .div4 {
    grid-area: 2 / 8 / 3 / 9;
  }
  .div5 {
    grid-area: 2 / 9 / 3 / 10;
  }
  .div6 {
    grid-area: 5 / 2 / 6 / 3;
  }
  .div7 {
    grid-area: 6 / 3 / 7 / 4;
  }
  .div8 {
    grid-area: 6 / 4 / 7 / 5;
  }
  .div9 {
    grid-area: 5 / 5 / 6 / 6;
  }
  .div10 {
    grid-area: 4 / 5 / 5 / 6;
  }
  .div11 {
    grid-area: 4 / 2 / 5 / 3;
  }
  .div12 {
    grid-area: 3 / 3 / 4 / 4;
  }
  .div13 {
    grid-area: 2 / 3 / 3 / 4;
  }
  .div14 {
    grid-area: 2 / 10 / 3 / 11;
  }
  .div15 {
    grid-area: 3 / 10 / 4 / 11;
  }
  .div16 {
    grid-area: 4 / 9 / 5 / 10;
  }
  .div17 {
    grid-area: 6 / 7 / 7 / 8;
  }
  .div18 {
    grid-area: 3 / 2 / 4 / 3;
  }
  .div19 {
    grid-area: 3 / 5 / 4 / 6;
  }
  .div20 {
    grid-area: 3 / 8 / 4 / 9;
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
      grid-area: 2 / 5 / 3 / 6;
      @include fake-transparent();

      svg {
        width: 65%;
        height: auto;
      }
    }

    &.big {
      // grid-row: span 2;
      // grid-column: span 2;
      aspect-ratio: 256 / 256;
      grid-area: 3 / 6 / 5 / 8;
    }
  }
}
</style>
