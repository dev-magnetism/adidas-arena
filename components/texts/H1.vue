<template>
  <component
    :is="tag"
    ref="h1"
    class="H1"
    :class="classes"
    :style="{ color: `var(--c-${color})` }"
  >
    <slot />
  </component>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

export default {
  props: {
    tag: {
      type: String,
      required: false,
      default: 'h1',
    },
    color: {
      type: String,
      required: false,
      default: 'black',
    },
    selectable: {
      required: false,
      type: Boolean,
      default: true,
    },
    weight: {
      required: false,
      type: String,
      default: 'medium',
    },
    split: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return [
        {
          'H1--noselect': !this.selectable,
          bold: this.weight !== 'medium',
          medium: this.weight === 'medium',
        },
      ]
    },
  },

  mounted() {
    document.fonts.ready.then(() => {
      if (!this.split || this.$viewport.isMobile) return

      this.initSplitText()
    })
  },
  methods: {
    initSplitText() {
      this.splitChild = new SplitText(this.$refs.h1, {
        type: 'lines',
        linesClass: 'H1__child line',
      })

      this.splitParent = new SplitText(this.$refs.h1, {
        type: 'lines',
        linesClass: 'H1__parent',
      })

      gsap.fromTo(
        this.splitChild.lines,
        {
          yPercent: -100,
        },
        {
          delay: 0.15,
          yPercent: 0,
          stagger: 0.2,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: this.$el,
            start: 'center bottom',
            toggleActions: 'play none none none',
          },
        }
      )
    },
  },
}
</script>

<style lang="scss">
.H1 {
  @include h1();

  &--type {
  }

  &__parent {
    // display: inline-block !important;
    overflow: hidden;
  }

  &__child {
    // display: inline-block !important;

    // transform: translateY(120%);
  }
}
</style>
