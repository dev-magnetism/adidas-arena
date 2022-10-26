<template>
  <div class="app-cursor">
    <svgCursorInitial v-if="!mouseDown" />
    <svgCursorDown v-if="mouseDown" />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  data() {
    return {
      mouseDown: false,
    }
  },
  mounted() {
    this.xTo = gsap.quickTo(this.$el, 'x', {
      duration: 0.1,
    })
    this.yTo = gsap.quickTo(this.$el, 'y', {
      duration: 0.1,
    })

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    onMouseDown() {
      this.mouseDown = true
    },
    onMouseUp() {
      this.mouseDown = false
    },
    onMouseMove(e) {
      this.xTo(e.clientX)
      this.yTo(e.clientY)
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

  @include mobile {
    display: none;
  }
}
</style>
