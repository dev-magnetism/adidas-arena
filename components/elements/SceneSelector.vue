<template>
  <div class="app-element-scene-selector" @click.stop="() => {}">
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
  position: absolute;
  bottom: 140px;
  background: var(--c-grey);
  right: 20px;
  display: flex;

  @include mobile {
    left: 0;
    right: initial;
    bottom: 0;
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

    @include mobile {
      width: mobile-vw(40px);
      min-width: 40px;
      height: mobile-vw(40px);
      border-bottom: none;
    }

    &.active {
      background-color: var(--c-blue-adidas);

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
      }
    }

    &:first-child {
      border-right: none;
    }
  }
}
</style>
