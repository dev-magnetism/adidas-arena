<template>
  <div
    ref="marquee"
    :class="{ inverted }"
    class="app-element-marquee"
    :style="{
      '--duration': duration + 's',
      '--offset': (offset % 100) + '%',
    }"
  >
    <div v-for="i in repeat" :key="i" class="app-element-marquee__inner">
      <slot />
    </div>
  </div>
</template>

<script>
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  props: {
    repeat: {
      type: Number,
      default: 2,
    },
    duration: {
      type: Number,
      default: 20,
    },
    offset: {
      type: Number,
      default: 0,
    },
    inverted: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-element-marquee {
  display: flex;
  overflow: hidden;
  will-change: transform;

  &__inner {
    display: flex;
    white-space: nowrap;
    animation: marquee var(--duration) linear infinite;

    .H1 {
      margin-right: desktop-vw(15px);
    }
  }

  &.inverted {
    .app-element-marquee__inner {
      animation: marquee-inverted var(--duration) linear infinite;
    }
  }

  @keyframes marquee {
    0% {
      transform: translate3d(calc(var(--offset) * -1), 0, 0);
    }

    100% {
      transform: translate3d(calc(-100% - var(--offset)), 0, 0);
    }
  }

  @keyframes marquee-inverted {
    0% {
      transform: translate3d(calc(-100% - var(--offset)), 0, 0);
    }

    100% {
      transform: translate3d(calc(var(--offset) * -1), 0, 0);
    }
  }
}
</style>
