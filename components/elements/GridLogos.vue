<template>
  <div
    class="app-element-grid-logos"
    :style="{
      '--cols': cols,
      '--rows': rows,
    }"
  >
    <!-- <ERichText :content="partners?.data[0].test_wysiwyg"></ERichText> -->
    <EGridLogosBloc :big="true" :src="arraytesttest.src" />

    <EGridLogosBloc
      :transparent="true"
      :src="'/imgs/placeholder-logo-home.png'"
    />

    <EGridLogosBloc
      v-for="(logo, index) in arraytest"
      :key="index"
      :class="[`app-element-grid-logos-bloc-${index + 1}`]"
      :src="logo.src"
    />
  </div>
</template>

<script>
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  mounted() {},
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
        grid-area: 3 / 2 / 4 / 3;
      }
      &-7 {
        grid-area: 8 / 3 / 9 / 4;
      }
      &-8 {
        grid-area: 7 / 3 / 8 / 4;
      }
      &-9 {
        grid-area: 7 / 2 / 8 / 3;
      }
      &-10 {
        grid-area: 6 / 1 / 7 / 2;
      }
      &-11 {
        grid-area: 6 / 4 / 7 / 5;
      }
      &-12 {
        grid-area: 7 / 1 / 8 / 2;
      }
      &-13 {
        grid-area: 7 / 4 / 8 / 5;
      }
      &-14 {
        grid-area: 2 / 2 / 3 / 3;
      }
      &-15 {
        grid-area: 6 / 2 / 7 / 3;
      }
      &-16 {
        grid-area: 5 / 4 / 6 / 5;
      }
      &-17 {
        grid-area: 5 / 1 / 6 / 2;
      }
      &-18 {
        grid-area: 2 / 1 / 3 / 2;
      }
      &-19 {
        grid-area: 1 / 1 / 2 / 2;
      }
      &-20 {
        grid-area: 8 / 2 / 9 / 3;
      }
    }
  }
}
</style>
