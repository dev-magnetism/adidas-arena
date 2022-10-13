<template>
  <div
    :class="borders"
    class="app-atoms-corner-points"
    :style="{
      '--size-points': sizePoints,
      '--border-color': `var(--c-${borderColor})`,
      '--points-color': `var(--c-${pointsColor})`,
    }"
  >
    <span
      v-if="position.includes('1')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--top-left"
    />
    <span
      class="app-atoms-corner-points__line app-atoms-corner-points__line--top"
    />
    <span
      v-if="position.includes('2')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--top-right"
    />
    <span
      class="app-atoms-corner-points__line app-atoms-corner-points__line--right"
    />
    <span
      v-if="position.includes('3')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--bottom-left"
    />
    <span
      class="app-atoms-corner-points__line app-atoms-corner-points__line--bottom"
    />
    <span
      v-if="position.includes('4')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--bottom-right"
    />
    <span
      class="app-atoms-corner-points__line app-atoms-corner-points__line--left"
    />
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      require: false,
      default: '1, 2, 3, 4',
    },
    sizePoints: {
      type: Number,
      require: false,
      default: 10,
    },
    borderColor: {
      type: String,
      require: false,
      default: 'black',
    },
    pointsColor: {
      type: String,
      require: false,
      default: 'black',
    },
  },
  computed: {
    borders() {
      const borders = {
        top: this.position.includes('1') && this.position.includes('2'),
        right: this.position.includes('2') && this.position.includes('3'),
        bottom: this.position.includes('3') && this.position.includes('4'),
        left: this.position.includes('4') && this.position.includes('1'),
      }

      return borders
    },
  },
}
</script>

<style lang="scss">
.app-atoms-corner-points {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9;
  top: 0;
  left: 0;

  &.top.right.bottom.left {
    // border: 1px solid var(--border-color);
    // outline: 1px solid var(--c-black);
    // outline-offset: 0px;
  }

  &__line {
    background-color: var(--border-color);
    position: absolute;

    &--top {
      width: 100%;
      height: 1px;
      top: 0;
      left: 0;
      transform: translateY(-100%);
    }
    &--bottom {
      width: 100%;
      height: 1px;
      bottom: 0;
      left: 0;
      transform: translateY(100%);
    }
    &--right {
      width: 1px;
      height: 100%;
      top: 0;
      right: 0;
      transform: translateX(100%);
    }
    &--left {
      width: 1px;
      height: 100%;
      top: 0;
      left: 0;
      transform: translateX(-100%);
    }
  }

  &__item {
    width: calc(var(--size-points) * 1px);
    height: calc(var(--size-points) * 1px);
    position: absolute;
    background: var(--points-color);

    &--top-left {
      left: 0px;
      top: 0px;
      transform: translate(-50%, -50%);
    }
    &--top-right {
      right: 0px;
      top: 0px;
      transform: translate(50%, -50%);
    }
    &--bottom-left {
      left: 0px;
      bottom: 0px;
      transform: translate(-50%, 50%);
    }
    &--bottom-right {
      right: 0px;
      bottom: 0px;
      transform: translate(50%, 50%);
    }
  }
}
</style>
