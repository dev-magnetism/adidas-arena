<template>
  <div class="app-element-floor-selector-mobile">
    <div class="app-element-floor-selector-mobile__wrapper">
      <div
        v-for="i in 5"
        :key="i"
        :class="{ active: i - 1 === interiorIndexFloor.id }"
        class="app-element-floor-selector-mobile__floor"
        @click="onClick(i - 1)"
      >
        <TH4>{{ i - 1 }}</TH4>
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
.app-element-floor-selector-mobile {
  position: absolute;
  bottom: 0px;
  background: var(--c-grey);
  right: 0;
  width: 40px;

  @include desktop {
    display: none;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  &__floor {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    background-color: var(--c-grey);
    border: 1px solid var(--c-black);
    transition: background-color 0.45s var(--ease-out-expo);

    &.active {
      background-color: var(--c-blue-adidas);

      .H4 {
        color: var(--c-grey) !important;
      }
    }
  }
}
</style>
