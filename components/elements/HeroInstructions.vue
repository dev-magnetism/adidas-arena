<template>
  <div class="app-element-hero-instructions"></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      overlayContactOpen: (state) => state.overlayContactOpen,
      appContent: (state) => state.appContent,
    }),
  },
  mounted() {
    window.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    ...mapMutations({
      setOverlayContactOpen: 'setOverlayContactOpen',
    }),
  },
}
</script>

<style lang="scss">
.app-element-hero-instructions {
  background: rgba(245, 245, 243, 0.4);
  backdrop-filter: blur(5px);
  z-index: 0;
  width: 100vw;
  height: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  top: 0;
  left: 0;
}
</style>
