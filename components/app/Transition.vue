<template>
  <div class="app-transition">
    <div class="app-transition__front-layer" />
    <div class="app-transition__back-layer" />
  </div>
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
.app-transition {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 999;
  overflow: hidden;
  pointer-events: none;

  &__front-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--c-red-adidas);
    transform: scaleY(0.1);
    transform-origin: bottom center;
    z-index: 2;
  }
  &__back-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--c-blue-adidas);
    transform: scaleY(0.2);
    transform-origin: bottom center;
    z-index: 1;
  }
}
</style>
