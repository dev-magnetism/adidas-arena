<template>
  <div :class="{ slider: slider }" class="app-cursor">
    <div ref="wrapper" class="app-cursor__wrapper">
      <div class="app-cursor__inner">
        <div class="app-cursor__left">
          <svgCursorDefault v-if="!mouseDown" />
          <svgCursorDown v-if="mouseDown" />
        </div>
        <div class="app-cursor__right">
          <svgCursorDefault v-if="!mouseDown" />
          <svgCursorDown v-if="mouseDown" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      mouseDown: false,
      slider: false,
    }
  },
  computed: {
    ...mapState({
      cursoState: (state) => state.cursoState,
    }),
  },
  mounted() {
    this.xTo = gsap.quickTo(this.$refs.wrapper, 'x', {
      duration: 0.1,
    })
    this.yTo = gsap.quickTo(this.$refs.wrapper, 'y', {
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
    onMouseDown(e) {
      this.mouseDown = true
    },
    onMouseUp(e) {
      this.mouseDown = false
    },
    onMouseMove(e) {
      this.xTo(e.clientX)
      this.yTo(e.clientY)

      // if (e.clientX > this.$viewport.width / 2) {
      //   this.slider = true
      // } else {
      //   this.slider = false
      // }
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
  width: 100vw;
  z-index: 11;
  pointer-events: none;
  overflow: hidden;

  @include mobile {
    display: none;
  }

  &.slider {
    .app-cursor__left {
      transform: rotate(0deg);
    }
    .app-cursor__right {
      transform: translateX(0%) scale(-1, 1);
    }
    .app-cursor__inner {
      // transform: translateX(-50%);
    }
  }

  &__wrapper {
  }

  &__inner {
    display: inline-flex;
    transition: transform 0.4s var(--ease-out-expo);
    will-change: transform;
  }

  &__left {
    width: 60px;
    transform: rotate(40deg) scale(1, -1);
    transition: transform 0.35s var(--ease-out-cubic);
    margin-right: 10px;
  }
  &__right {
    width: 60px;
    margin-left: 10px;
    transform: translateX(-50%) scale(0, 0);
    transition: transform 0.35s var(--ease-out-cubic);
  }
}
</style>
