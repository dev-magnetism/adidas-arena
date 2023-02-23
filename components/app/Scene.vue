<template>
  <div :class="{ 'app-webgl--front': webglInFront }" class="app-webgl"></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  computed: {
    ...mapState({
      webglInFront: (state) => state.webglInFront,
    }),
  },
  created() {},
  mounted() {
    const { renderer } = useWebGL()

    this.$el.appendChild(renderer.domElement)
  },
  beforeDestroy() {
    const webgl = useWebGL()
    webgl.destroy()
  },
  methods: {
    ...mapMutations({}),
  },
}
</script>

<style lang="scss">
.app-webgl {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 0;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  // z-index: 99999999;

  &--front {
    z-index: 2;
  }

  canvas {
    height: 100%;
    width: 100%;
    touch-action: none;
    user-select: none;
  }
}
</style>
