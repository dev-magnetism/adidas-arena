<template>
  <div
    class="app-element-grid-logos"
    :style="{
      '--cols': cols,
      '--rows': rows,
    }"
  >
    <div
      v-for="(logo, index) in cols * rows - nbElementDelete * 3"
      :key="index"
      :class="{
        big: index <= logos.length - 1 && logos[index].big,
        visible: index <= logos.length - 1,
        transparent: index > logos.length - 1,
      }"
      :style="{
        '--order': randomIntFromInterval(1, cols * rows - nbElementDelete * 3),
      }"
      class="bloc"
    >
      <AtomsCornerPoints
        v-if="index <= logos.length - 1"
        :size-points="6"
        position="1,2,3,4"
      />
      <img
        v-if="index <= logos.length - 1"
        :src="logos[index].src"
        alt="test"
      />
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
      default: 6,
    },
  },
  data() {
    return {
      logos: [
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
      ],
    }
  },
  computed: {
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

  .bloc {
    aspect-ratio: 128 / 128;
    position: relative;
    grid-row: span 1;
    grid-column: span 1;
    height: 100%;
    width: 100%;
    // order: var(--order);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 50%;
      height: auto;
    }

    &.visible {
      background: var(--c-white);
    }

    &.transparent {
      background: transparent;
    }

    &.big {
      grid-row: span 2;
      grid-column: span 2;
      aspect-ratio: 256 / 256;
    }
  }
}
</style>
