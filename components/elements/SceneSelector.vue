<template>
  <div class="app-element-scene-selector" @click.stop="() => {}">
    <div class="app-element-scene-selector__switch">
      <span
        :class="{ active: !interiorMusicScene }"
        class="app-element-scene-selector__switch__cursor"
      />
    </div>
    <div
      :class="{ active: interiorMusicScene }"
      class="app-element-scene-selector__icon micro"
      @click.stop="setInteriorMusicScene(true)"
    >
      <SvgInteriorMicro />
    </div>
    <div
      :class="{ active: !interiorMusicScene }"
      class="app-element-scene-selector__icon sport"
      @click="setInteriorMusicScene(false)"
    >
      <SvgInteriorSport />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      interiorMusicScene: (state) => state.interiorMusicScene,
    }),
  },
  methods: {
    ...mapMutations({
      setInteriorMusicScene: 'setInteriorMusicScene',
    }),
  },
}
</script>

<style lang="scss">
.app-element-scene-selector {
  position: relative;
  display: flex;
  margin-bottom: 20px;
  justify-content: flex-end;
  margin-left: auto;

  @include mobile {
    margin-bottom: 0px;
    margin-left: 0px;
  }

  &__switch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--c-grey);

    &__cursor {
      position: absolute;
      top: 0;
      left: 0;
      background: var(--c-blue-adidas);
      width: 50%;
      height: 100%;
      transition: transform 0.5s var(--ease-in-out-cubic);
      pointer-events: none;
      z-index: 1;

      &.active {
        transform: translateX(100%);
      }
    }
  }

  &__icon {
    width: desktop-vw(40px);
    min-width: 40px;
    height: desktop-vw(40px);
    min-height: 40px;
    border: 1px solid var(--c-black);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;

    @include mobile {
      width: mobile-vw(40px);
      min-width: 40px;
      height: mobile-vw(40px);
      border-bottom: none;
    }

    &.micro {
      border-right: none;

      @include mobile {
        border-left: none;
      }
    }

    &.active {
      svg {
        path {
          stroke: var(--c-grey);
        }
      }
    }

    svg {
      width: 60%;
      height: auto;

      path {
        stroke: var(--c-black);
        transition: stroke 0.5s var(--ease-in-out-cubic);
      }
    }
  }
}
</style>
