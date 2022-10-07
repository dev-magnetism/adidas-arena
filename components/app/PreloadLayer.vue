<template>
  <div :class="{ visible: !fontsLoaded }" class="app-preload-layer" />
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
    }),
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
.app-preload-layer {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: var(--c-beige);
  z-index: 999;
  overflow: hidden;
  transform: translate3d(0, -100%, 0);
  transition: transform 2.5s var(--ease-out-expo);
  transition-delay: 0.5s;

  &.visible {
    transform: translate3d(0, 0%, 0);
  }
}
</style>
