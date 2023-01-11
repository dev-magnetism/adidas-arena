<template>
  <div ref="marquee" :class="{ inverted }" class="app-element-marquee-scroll">
    <div ref="wrapper" class="app-element-marquee-scroll__wrapper">
      <div
        v-for="i in repeat"
        :key="i"
        ref="marquees"
        class="app-element-marquee-scroll__inner"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default {
  props: {
    repeat: {
      type: Number,
      default: 2,
    },
    duration: {
      type: Number,
      default: 40,
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
    document.fonts.ready.then(() => {
      const wordCount = this.countWords(this.$slots.default[0].elm.innerHTML)

      const colors = [...new Array(wordCount)].map(() => {
        const color =
          Math.random() < 0.45
            ? '#181818'
            : Math.random() < 0.5
            ? '#0000FF'
            : '#E3530F'

        return color
      })

      this.$refs.marquees.forEach((marquee) => {
        const split = new SplitText(marquee.children[0], {
          type: 'words, lines',
        })

        split.words.forEach((el, index) => {
          el.style.color = colors[index]
        })
      })

      if (this.inverted) {
        gsap.set(this.$refs.marquees, {
          xPercent: -100 * (this.repeat - 1),
        })
      }

      gsap.fromTo(
        this.$refs.wrapper,
        {
          x: this.inverted ? -this.$viewport.width : this.$viewport.width,
        },
        {
          duration: 4,
          x: 0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: this.$refs.wrapper,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play none none none',
          },
        }
      )

      this.tween = gsap.to(this.$refs.marquees, {
        duration: this.duration,
        xPercent: this.inverted ? 0 : -100,
        ease: 'none',
        repeat: -1,
        scrollTrigger: {
          trigger: this.$refs.marquee,
          start: 'top-=100% bottom',
          end: 'bottom top',
          toggleActions: 'play pause resume pause',
        },
      })

      ScrollTrigger.create({
        trigger: this.$refs.marquee,
        scrub: 5,
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity()) * 0.0000015
          const progress = this.tween.progress() + velocity

          this.tween.progress(progress)
        },
      })
    })
  },
  beforeDestroy() {
    this.tween?.kill()
  },
  methods: {
    countWords(str) {
      const arr = str.split(' ')

      return arr.filter((word) => word !== '').length
    },
  },
}
</script>

<style lang="scss">
.app-element-marquee-scroll {
  display: flex;
  overflow: hidden;
  will-change: transform;

  &__inner,
  &__wrapper {
    display: flex;
    white-space: nowrap;
    // animation: marquee calc(var(--duration) * var(--marquee-progress)) linear
    //   infinite;
    transform: translate3d(calc(var(--offset) * -1), 0, 0);
    will-change: transform;

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
