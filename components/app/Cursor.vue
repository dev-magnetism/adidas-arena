<template>
  <div :class="{ ...classes }" class="app-cursor">
    <div ref="wrapper" class="app-cursor__wrapper">
      <div class="app-cursor__inner">
        <SvgCursorUnion ref="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      mouseDown: false,
    }
  },
  computed: {
    ...mapState({
      cursorState: (state) => state.cursorState,
      cursorSliderHold: (state) => state.cursorSliderHold,
      cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
      cursorSliderDisabled: (state) => state.cursorSliderDisabled,
      cursorMinimize: (state) => state.cursorMinimize,
    }),
    classes() {
      return {
        'app-cursor--slider': this.cursorState === 'slider',
        'slider-hold': this.cursorSliderHold && this.cursorState === 'slider',
        'is-left': this.cursorSliderLeftZone,
        'slider-disabled': this.cursorSliderDisabled,
        'cursor-minimize': this.cursorMinimize && this.cursorState === 'slider',
      }
    },
  },
  mounted() {
    if (this.$viewport.isMobile) return

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
    if (this.$viewport.isMobile) return

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

      if (this.cursorState === 'slider') {
        if (e.clientX > this.$viewport.width / 2) {
          this.setCursorSliderLeftZone(false)
        } else {
          this.setCursorSliderLeftZone(true)
        }
      }
    },
    ...mapMutations({
      setCursorSliderLeftZone: 'setCursorSliderLeftZone',
    }),
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

  &.cursor-minimize {
    svg {
      transform: scale(0, 0) !important;
    }

    .app-cursor__inner {
      transform: translate(-50%, -50%) scale(0.35);
    }
  }

  &.is-left {
    svg {
      transform: scale(-1, 1);
    }
  }

  &--slider {
    .app-cursor__inner {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &.slider-hold {
    svg {
      transform: scale(0, 0);
      transition-delay: 0.15s;
    }

    .app-cursor__inner {
      transform: translate(-50%, -50%) scale(0.7);
      transition-delay: 0.15s;
    }
  }

  &.slider-disabled {
    opacity: 0.35;

    svg {
      opacity: 0.5;
    }
  }

  &__wrapper {
    will-change: transform;
  }

  &__inner {
    transition: transform 0.5s var(--ease-out-expo);
    will-change: transform;
    width: desktop-vw(120px);
    height: desktop-vw(120px);
    max-width: 120px;
    max-height: 120px;
    background: var(--c-red-adidas);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 40%;
    transition: transform 0.6s var(--ease-out-expo);
    transform: scale(1, 1);
    will-change: transform;
  }
}
</style>
