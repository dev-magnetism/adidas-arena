<template>
  <div v-if="rendererInfo" class="app-renderer-info">
    <TP2 color="white" weight="medium">
      Calls: {{ rendererInfo.render.calls }}
    </TP2>
    <TP2 color="white" weight="medium">
      Triangles: {{ rendererInfo.render.triangles }}
    </TP2>
    <TP2 color="white" weight="medium">
      Geometries: {{ rendererInfo.memory.geometries }}
    </TP2>
    <TP2 color="white" weight="medium">
      Textures: {{ rendererInfo.memory.textures }}
    </TP2>
    <TP2 color="white" weight="medium">
      Programs: {{ rendererInfo.programs.length }}
    </TP2>
    <TP2 color="white" weight="medium">Interior: {{ interiorVisible }}</TP2>
    <TP2 color="white" weight="medium">Exterior: {{ exteriorVisible }}</TP2>
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
  opacity: 0.8;
  padding: 8px;
  position: fixed;
  z-index: 10000;
  pointer-events: none;

  .P2 {
    @include font-ITCFranklinGothicLT-BkCp();
    text-transform: uppercase;
    font-size: 14px;
    line-height: 20px;
  }

  @include mobile {
    display: none;
  }
}
</style>
