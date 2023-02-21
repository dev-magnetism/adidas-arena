<template>
  <div v-if="rendererInfo" class="app-renderer-info">
    <div>calls: {{ rendererInfo.render.calls }}</div>
    <div>triangles: {{ rendererInfo.render.triangles }}</div>
    <div>geometries: {{ rendererInfo.memory.geometries }}</div>
    <div>textures: {{ rendererInfo.memory.textures }}</div>
    <div>programs: {{ rendererInfo.programs.length }}</div>
  </div>
</template>

<script>
import useWebGL from '~/hooks/webgl'

export default {
  data() {
    return {
      rendererInfo: null,
    }
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
