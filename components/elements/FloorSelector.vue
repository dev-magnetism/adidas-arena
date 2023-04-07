<template>
  <div
    class="app-element-floor-selector"
    :class="{ disabled: interiorTimelineFloorsInProgress }"
    @click.stop="() => {}"
  >
    <AtomsCornerPoints :size-points="8" />

    <div class="app-element-floor-selector__wrapper">
      <transition-group
        tag="div"
        class="app-element-floor-selector__texts"
        name="selector-text"
      >
        <TP2
          v-for="(floor, index) in interiorContent"
          v-show="index === interiorIndexFloor.id"
          :key="`floor-text-${index}`"
          weight="medium"
          >{{ floor.name_short }}</TP2
        >
      </transition-group>

      <div class="app-element-floor-selector__floors">
        <span
          v-for="(floor, index) in interiorContent"
          :key="`floor-${index}`"
          :class="{ active: index === interiorIndexFloor.id }"
          class="app-element-floor-selector__floor"
          @click="onClick(index)"
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
      exteriorFullscreen: (state) => state.exteriorFullscreen,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      interiorContent: (state) => state.interiorContent,
      interiorTimelineFloorsInProgress: (state) =>
        state.interiorTimelineFloorsInProgress,
    }),
  },
  mounted() {},
  methods: {
    onClick(i) {
      if (this.interiorTimelineFloorsInProgress) return

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
  position: relative;
  background: var(--c-grey);
  width: 150px;
  height: 80px;
  transition: opacity 0.35s var(--ease-in-out-cubic);

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;

    .app-element-floor-selector__floor {
      cursor: not-allowed;
    }
  }

  @include mobile {
    display: none;
  }

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
      text-transform: uppercase;
      font-size: min(14px, desktop-vw(14px));
      line-height: min(20px, desktop-vw(20px));
      user-select: none;

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
    transform: translateY(-10px);
  }

  &__floor {
    --width: 30px;

    width: var(--width);
    height: var(--width);
    display: inline-block;
    transform: scale3d(1, 1, 1) rotateX(58deg) rotateY(0deg) rotateZ(45deg)
      translate3d(0px, 0px, 0px) skew(0deg, 0deg);
    margin-bottom: -22px;
    user-select: none;
    background-color: var(--c-grey);
    border: 2px dashed var(--c-black);
    align-self: center;
    transition: margin-bottom 0.45s var(--ease-out-expo),
      margin-top 0.45s var(--ease-out-expo),
      background-color 0.45s var(--ease-out-expo);
    will-change: margin-top, margin-bottom;
    cursor: pointer;

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
        margin-top: 7.5px;
      }

      margin-bottom: -15px;
    }
  }
}
</style>
