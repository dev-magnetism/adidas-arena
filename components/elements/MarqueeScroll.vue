<template>
  <div ref="marquee" :class="{ inverted }" class="app-element-marquee-scroll">
    <div
      v-for="i in repeat"
      :key="i"
      ref="marquees"
      class="app-element-marquee-scroll__inner"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  props: {
    repeat: {
      type: Number,
      default: 4,
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
  mounted() {
    if (this.inverted) {
      gsap.set(this.$refs.marquees, {
        xPercent: -100 * (this.repeat - 1),
      })
    }
    this.tween = gsap.to(this.$refs.marquees, {
      duration: this.duration,
      xPercent: this.inverted ? 0 : -100,
      ease: 'none',
      repeat: -1,
      scrollTrigger: {
        trigger: this.$refs.marquee,
        start: 'top-=100% bottom',
        end: 'bottom top',
        markers: true,
        toggleActions: 'play pause resume pause',
      },
    })

    ScrollTrigger.create({
      trigger: this.$refs.marquee,
      scrub: 5,
      markers: true,
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity()) * 0.000004
        const progress = this.tween.progress() + velocity

        this.tween.progress(progress)
      },
    })
  },
}
</script>

<style lang="scss">
.app-element-marquee-scroll {
  display: flex;
  overflow: hidden;
  will-change: transform;

  &__inner {
    display: flex;
    white-space: nowrap;
    // animation: marquee calc(var(--duration) * var(--marquee-progress)) linear
    //   infinite;
    transform: translate3d(calc(var(--offset) * -1), 0, 0);

    .H1 {
      margin-right: desktop-vw(15px);
    }
  }

  &.inverted {
    .app-element-marquee-scroll__inner {
      // animation: marquee-inverted
      //   calc(var(--duration) * var(--marquee-progress)) linear infinite;
      transform: translate3d(calc(-100% - var(--offset)), 0, 0);
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
