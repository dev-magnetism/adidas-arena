<template>
  <div v-if="rendererInfo" class="app-renderer-info">
    <div>calls: {{ rendererInfo.render.calls }}</div>
    <div>triangles: {{ rendererInfo.render.triangles }}</div>
    <div>geometries: {{ rendererInfo.memory.geometries }}</div>
    <div>textures: {{ rendererInfo.memory.textures }}</div>
    <div>programs: {{ rendererInfo.programs.length }}</div>
    <div>interior visible: {{ interiorVisible }}</div>
    <div>exterior visible: {{ exteriorVisible }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  data() {
    return {
      rendererInfo: null,
    }
  },
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      exteriorVisible: (state) => state.exteriorVisible,
    }),
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      const { renderer } = useWebGL()
      this.rendererInfo = renderer.info
    }
  },
}
</script>

<style lang="scss">
.app-renderer-info {
  background: #000;
  top: 50px;
  color: #fff;
  left: 0;
  opacity: 0.9;
  padding: 8px;
  position: fixed;
  z-index: 10000;

  @include mobile {
    display: none;
  }
}
</style>
