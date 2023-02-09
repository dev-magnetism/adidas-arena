<template>
  <div class="app-element-interior-informations">
    <ELegendZones />
    <ESceneSelector />
    <EFloorSelector />
  </div>
</template>

<style lang="scss">
.app-element-interior-informations {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;

  @include mobile {
    left: 0;
    right: initial;
    bottom: 0;
  }
}
</style>
