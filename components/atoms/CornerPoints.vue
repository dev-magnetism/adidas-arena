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
      v-if="position.includes('2')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--top-right"
    />
    <span
      v-if="position.includes('3')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--bottom-left"
    />
    <span
      v-if="position.includes('4')"
      class="app-atoms-corner-points__item app-atoms-corner-points__item--bottom-right"
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
    border: 1px solid var(--border-color);
    // outline: 1px solid var(--c-black);
    // outline-offset: 0px;
  }

  &__item {
    width: calc(var(--size-points) * 1px);
    height: calc(var(--size-points) * 1px);
    position: absolute;
    background: var(--points-color);

    &--top-left {
      left: -1px;
      top: -1px;
      transform: translate(-50%, -50%);
    }
    &--top-right {
      right: -1px;
      top: -1px;
      transform: translate(50%, -50%);
    }
    &--bottom-left {
      left: -1px;
      bottom: -1px;
      transform: translate(-50%, 50%);
    }
    &--bottom-right {
      right: -1px;
      bottom: -1px;
      transform: translate(50%, 50%);
    }
  }
}
</style>
