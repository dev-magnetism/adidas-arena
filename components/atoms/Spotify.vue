<template>
  <a
    :href="tile.cta_link"
    target="_blank"
    :style="{
      '--translate-x': `${index % 2 ? genRand(20, 40) : genRand(0, 20)}%`,
      '--rotate': `${index % 2 ? genRand(1, 3) : genRand(-3, -1)}deg`,
    }"
    class="app-atoms-spotify"
  >
    <AtomsCornerPoints :size-points="8" />

    <div class="app-atoms-spotify__cover">
      <AppProgrammationImage
        v-if="tile.image || tile.image.filename_disk"
        :src="tile.image.filename_disk"
        :alt="`image-${tile.title}`"
        :tiny="true"
      />
    </div>
    <div class="app-atoms-spotify__artist">
      <TP1>{{ tile.year }}</TP1>
      <TH4>{{ tile.title }}</TH4>
      <SvgSpotify />
    </div>
  </a>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    tile: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    // generate random value from min to max (negative or positive possible)
    genRand(min, max, decimalPlaces = 0) {
      const range = Math.abs(max - min)
      const rand = Math.random() * range + Math.min(min, max)
      const power = Math.pow(10, decimalPlaces)

      return Math.floor(rand * power) / power
    },
  },
}
</script>

<style lang="scss">
.app-atoms-spotify {
  width: 75%;
  display: inline-flex;
  position: relative;
  flex-direction: row;
  margin-bottom: desktop-vw(30px);
  cursor: pointer;
  transform: translateX(var(--translate-x)) rotate(var(--rotate));

  @include mobile {
    margin-bottom: mobile-vw(30px);
    width: 90%;
    transform: translateX(0%) rotate(calc(var(--rotate) / 2)) !important;
  }

  &:first-of-type {
    margin-top: desktop-vw(50px);

    @include mobile {
      margin-top: mobile-vw(40px);
    }
  }

  &:last-child {
    margin-bottom: desktop-vw(0px);
  }

  &__cover {
    aspect-ratio: 130 / 130;
    flex: 0 0 40%;
    @include fake-transparent();
    display: flex;
    align-items: center;
    justify-content: center;

    @include mobile {
      aspect-ratio: 100 / 100;
    }

    picture {
      width: 75%;
      height: 75%;
      display: block;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  &__artist {
    flex: 0 0 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 desktop-vw(15px);
    border-left: 1px solid var(--c-black);
    background-color: var(--c-white);

    @include mobile {
      padding: mobile-vw(15px) mobile-vw(15px);
    }

    svg {
      position: absolute;
      top: desktop-vw(8px);
      right: desktop-vw(8px);
      transform: rotate(20deg);

      @include mobile {
        width: mobile-vw(20px);
        height: mobile-vw(20px);
        top: mobile-vw(8px);
        right: mobile-vw(8px);
      }
    }
  }
}
</style>
