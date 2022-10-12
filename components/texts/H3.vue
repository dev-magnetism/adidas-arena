<template>
  <component
    :is="tag"
    ref="h3"
    class="H3"
    :class="classes"
    :style="{ color: `var(--c-${color})` }"
  >
    <slot></slot>
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
      default: 'h3',
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
      default: 'bold',
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
          'H3--noselect': !this.selectable,
          bold: this.weight === 'bold',
          medium: this.weight === 'medium',
        },
      ]
    },
  },

  mounted() {
    document.fonts.ready.then(() => {
      if (!this.split) return

      this.initSplitText()
    })
  },
  methods: {
    initSplitText() {
      this.splitChild = new SplitText(this.$refs.h3, {
        type: 'lines',
        linesClass: 'H3__child line',
      })

      this.splitParent = new SplitText(this.$refs.h3, {
        type: 'lines',
        linesClass: 'H3__parent ',
      })

      gsap.fromTo(
        this.splitChild.lines,
        {
          yPercent: -100,
        },
        {
          delay: 0.15,
          yPercent: 0,
          stagger: 0.075,
          duration: 0.4,
          ease: 'power3.out',
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
.H3 {
  @include h3();

  &--type {
  }

  &__parent {
    overflow: hidden;
  }

  &__child {
  }
}
</style>
