<template>
  <div ref="scroller" class="app-scroller">
    <div ref="inner" class="app-scroller__inner">
      <slot />
    </div>
  </div>
</template>

<script>
import Lenis from '@studio-freight/lenis'

export default {
  mounted() {
    window.scrollTo(0, 0)

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    this.$raf.add('scroller', this.onFrame, 0)
  },
  beforeDestroy() {
    this.$raf.remove('scroller', this.onFrame)
  },
  methods: {
    onFrame({ time, deltaTime }) {
      this.lenis.raf(time * 1000)
    },
  },
}
</script>
