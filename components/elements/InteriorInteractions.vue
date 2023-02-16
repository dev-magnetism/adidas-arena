<template>
  <div
    :class="{ hide: interiorCurrentZoneName && $viewport.isMobile }"
    class="app-element-interior-interactions"
  >
    <ELegendZones />
    <ESceneSelector />
    <EFloorSelector />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      interiorCurrentZoneName: (state) => state.interiorCurrentZoneName,
    }),
  },
}
</script>

<style lang="scss">
.app-element-interior-interactions {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  transition: opacity 0.35s var(--ease-in-out-cubic);

  @include mobile {
    left: 0;
    right: initial;
    bottom: 0;

    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
