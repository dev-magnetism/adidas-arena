<template>
  <div :class="{ isLeft, hold: mouseDown }" class="app-cursor">
    <div ref="wrapper" class="app-cursor__wrapper">
      <div class="app-cursor__inner">
        <SvgCursorUnion ref="arrow" />
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
      isLeft: false,
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

      if (e.clientX > this.$viewport.width / 2) {
        this.isLeft = false
      } else {
        this.isLeft = true
      }
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

  &.isLeft {
    svg {
      transform: scaleX(-1);
    }
  }

  &__wrapper {
    will-change: transform;
  }

  &__inner {
    transition: transform 0.4s var(--ease-out-expo);
    will-change: transform;
    width: desktop-vw(120px);
    height: desktop-vw(120px);
    background: var(--c-red-adidas);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 40%;
    transition: transform 0.65s var(--ease-out-expo);
    transform: scaleX(1);
    will-change: transform;
  }
}
</style>
