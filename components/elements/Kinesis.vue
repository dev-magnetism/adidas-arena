<template>
  <div class="app-element-kinesis">
    <slot />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    speed: {
      type: Number,
      default: 65,
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.onMouseMove, false)
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove, false)
  },
  methods: {
    onMouseMove(e) {
      // if (isTouchDevice) return

      const x = (e.clientX / this.$viewport.width - 0.5) * 2 * this.speed
      const y = (e.clientY / this.$viewport.height - 0.5) * 2 * this.speed

      gsap.to(this.$el, {
        x,
        y,
        duration: 1,
        ease: 'expo.out',
      })
    },
  },
}
</script>

<style lang="scss">
.app-element-kinesis {
  width: 100%;
  height: 100%;
  will-change: transform;
}
</style>
