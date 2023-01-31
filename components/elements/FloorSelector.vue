<template>
  <div class="app-element-floor-selector">
    <AtomsCornerPoints :size-points="8" />

    <div class="app-element-floor-selector__wrapper">
      <transition-group
        tag="div"
        class="app-element-floor-selector__texts"
        name="selector-text"
      >
        <TP2
          v-for="i in 5"
          v-show="i - 1 === interiorIndexFloor.id"
          :key="'iii' + i"
          >{{ i - 1 }}</TP2
        >
      </transition-group>

      <div class="app-element-floor-selector__floors">
        <span
          v-for="i in 5"
          :key="i"
          :class="{ active: i - 1 === interiorIndexFloor.id }"
          class="app-element-floor-selector__floor"
          @click="onClick(i - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  // props: {
  //   content: {
  //     type: Object,
  //     default: () => {},
  //   },
  // },

  computed: {
    ...mapState({
      exteriorFullwidth: (state) => state.exteriorFullwidth,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
    }),
  },
  methods: {
    onClick(i) {
      this.setInteriorIndexFloor({ id: i, immediate: false })
    },
    ...mapMutations({
      setInteriorIndexFloor: 'setInteriorIndexFloor',
    }),
  },
}
</script>

<style lang="scss">
.app-element-floor-selector {
  position: absolute;
  bottom: 20px;
  background: var(--c-grey);
  right: 20px;
  width: 170px;
  height: 80px;

  &__wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }

  &__texts {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .P2 {
      position: absolute;

      &.selector-text-enter-active,
      &.selector-text-leave-active {
        transition: opacity 0.55s var(--ease-in-out-cubic);
      }

      &.selector-text-enter {
        opacity: 0;
      }

      &.selector-text-enter-to {
        opacity: 1;
      }

      &.selector-text-leave {
        opacity: 1;
        opacity: 1;
      }

      &.selector-text-leave-to {
        opacity: 0;
      }
    }
  }

  &__floors {
    perspective: 2000px;
    perspective-origin: 50% 50%;
    display: flex;
    flex-direction: column-reverse;
    transform-style: preserve-3d;
    flex: 1;
    align-self: center;
  }

  &__floor {
    --width: 30px;

    width: var(--width);
    height: var(--width);
    display: inline-block;
    transform: scale3d(1, 1, 1) rotateX(58deg) rotateY(0deg) rotateZ(45deg)
      translate3d(0px, 0px, 0px) skew(0deg, 0deg);
    margin-bottom: 22px;
    user-select: none;
    background-color: var(--c-grey);
    border: 2px dashed var(--c-black);
    align-self: center;
    transition: margin-bottom 0.45s var(--ease-out-expo),
      margin-top 0.45s var(--ease-out-expo),
      background-color 0.45s var(--ease-out-expo);
    will-change: margin-top, margin-bottom;

    &.active {
      background-color: #3171ff;
      border: 2px solid var(--c-blue-adidas);
      margin-top: 5px;
      margin-bottom: -20px;
    }

    &:last-child {
      &.active {
        margin-top: 0px;
      }
    }

    &:not(.active):hover {
      border: 2px solid var(--c-blue-adidas);

      &:not(:last-child) {
        margin-top: 7.5;
      }

      margin-bottom: -15px;
    }
  }
}
</style>
