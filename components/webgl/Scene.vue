<template>
  <div>
    <WebglExterior />
    <!-- <WebglInfo v-if="!$viewport.isMobile" /> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      modelsPreviewed: (state) => state.modelsPreviewed,
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
