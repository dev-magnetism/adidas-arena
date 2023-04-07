<template>
  <div class="app-element-hero-instructions">
    <div class="app-element-hero-instructions__wrapper">
      <div ref="lottie" class="app-element-hero-instructions__lottie" />
      <TH4 tag="p">{{ appContent.data.instructions_drag_title }}</TH4>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

// import { gsap } from 'gsap'

import lottie from 'lottie-web'

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
    this.initLottie()

    window.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    this.lottie?.destroy()

    window.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    initLottie() {
      this.lottie = lottie.loadAnimation({
        container: this.$refs.lottie,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require(`@/assets/lotties/Onboard.json`),
      })
    },
    ...mapMutations({
      setOverlayContactOpen: 'setOverlayContactOpen',
    }),
  },
}
</script>

<style lang="scss">
.app-element-hero-instructions {
  z-index: 0;
  width: 100vw;
  height: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: desktop-vw(100px);

  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__lottie {
    width: desktop-vw(170px);
    height: auto;
    margin-bottom: desktop-vw(20px);
  }
}
</style>
