<template>
  <div
    :class="{ front: exteriorArenaHovered && exteriorVisible }"
    class="app-webgl-scene"
  >
    <WebglExterior />
    <WebglInterior />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      modelsPreviewed: (state) => state.modelsPreviewed,
      exteriorArenaHovered: (state) => state.exteriorArenaHovered,
      exteriorVisible: (state) => state.exteriorVisible,
    }),
  },
  watch: {
    modelsPreviewed(payload) {
      if (!payload) return

      this.setExteriorVisible(false)
      this.setInteriorVisible(false)
    },
  },
  methods: {
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
      setInteriorVisible: 'setInteriorVisible',
    }),
  },
}
</script>

<style lang="scss">
.app-webgl-scene {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 0;

  // &.front {
  //   z-index: 2;
  // }
}
</style>
