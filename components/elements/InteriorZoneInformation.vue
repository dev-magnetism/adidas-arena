<template>
  <div class="app-element-interior-zone-information">
    <div
      v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
      :key="index"
      v-show="zone.name_gltf === currentContent?.name_gltf"
      class="app-element-interior-zone-information__zone-selected"
    >
      <AtomsCornerPoints :size-points="8" />
      <TH3
        class="app-element-interior-zone-information__zone-selected__title"
        >{{ zone?.name }}</TH3
      >
      <TP2 class="app-element-interior-zone-information__zone-selected__text">{{
        zone?.description
      }}</TP2>
    </div>
    <div
      v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
      :key="'test' + index"
      v-show="zone.name_gltf === currentContentHovered?.name_gltf"
      class="app-element-interior-zone-information__zone-hovered"
    >
      <AtomsCornerPoints :size-points="8" />
      <TH3
        class="app-element-interior-zone-information__zone-selected__title"
        >{{ zone?.name }}</TH3
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import useWebGL from '~/hooks/webgl'

export default {
  computed: {
    ...mapState({
      interiorContent: (state) => state.interiorContent,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      interiorCurrentZoneName: (state) => state.interiorCurrentZoneName,
      interiorCurrentZoneHovered: (state) => state.interiorCurrentZoneHovered,
    }),
    currentContent() {
      return this.interiorContent[this.interiorIndexFloor.id].zones.find(
        (zone) => zone.name_gltf === this.interiorCurrentZoneName
      )
    },
    currentContentHovered() {
      return this.interiorContent[this.interiorIndexFloor.id].zones.find(
        (zone) => zone.name_gltf === this.interiorCurrentZoneHovered
      )
    },
  },

  mounted() {
    console.log(this.currentContent)
    // const { interior } = useWebGL()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss">
.app-element-interior-zone-information {
  bottom: 0;
  position: absolute;
  left: 0;
  width: 25vw;
  background-color: #fff;
  background-image: linear-gradient(
      45deg,
      #cccccc 25%,
      transparent 25%,
      transparent 75%,
      #cccccc 75%
    ),
    linear-gradient(
      45deg,
      #cccccc 25%,
      transparent 25%,
      transparent 75%,
      #cccccc 75%
    );
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;

  &__zone-selected {
    padding: desktop-vw(60px) desktop-vw(30px) desktop-vw(40px) desktop-vw(30px);

    &__title {
      margin-bottom: 20px;
    }
  }
}
</style>
