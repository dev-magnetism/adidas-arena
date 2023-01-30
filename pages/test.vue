<template>
  <div>
    <WebglInterior />
    <EFloorSelector />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      interiorVisible: (state) => state.interiorVisible,
    }),
  },
  watch: {
    allLoadedFake() {
      this.setInteriorVisible(true)
    },
  },

  mounted() {
    if (!this.interiorVisible) this.setInteriorVisible(true)
  },
  methods: {
    ...mapMutations({
      setInteriorVisible: 'setInteriorVisible',
    }),
  },
}
</script>
