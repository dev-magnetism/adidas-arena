<template>
  <div class="app-cursor">
    <svgCursorInitial ref="cursorInitial" />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  mounted() {
    this.xTo = gsap.quickTo(this.$refs.cursorInitial.$el, 'x', {
      duration: 0.1,
    })
    this.yTo = gsap.quickTo(this.$refs.cursorInitial.$el, 'y', {
      duration: 0.1,
    })

    document.addEventListener('mousemove', this.onMouseMove)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove)
  },
  methods: {
    onMouseMove(e) {
      this.xTo(e.clientX)
      this.yTo(e.clientY)
      console.log('here', e)
    },
  },
}
</script>

<style lang="scss">
.app-cursor {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 10000;
  pointer-events: none;
  overflow: hidden;
}
</style>
