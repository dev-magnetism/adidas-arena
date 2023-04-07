<template>
  <div
    :class="{
      active:
        (exteriorFullscreen && exteriorVisible && instructionsWebglVisible) ||
        (interiorVisible && instructionsWebglVisible),
    }"
    class="app-element-hero-instructions"
  >
    <div class="app-element-hero-instructions__wrapper">
      <div ref="lottie" class="app-element-hero-instructions__lottie" />
      <TH4 tag="p">{{ appContent.data.instructions_drag_title }} </TH4>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Observer } from 'gsap/Observer'

import lottie from 'lottie-web'

export default {
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      exteriorFullscreen: (state) => state.exteriorFullscreen,
      appContent: (state) => state.appContent,
      exteriorArenaHovered: (state) => state.exteriorArenaHovered,
      exteriorVisible: (state) => state.exteriorVisible,
      instructionsWebglVisible: (state) => state.instructionsWebglVisible,
    }),
  },
  watch: {
    instructionsWebglVisible(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.lottie?.destroy()
        }, 750)
      }
    },
  },
  mounted() {
    this.initLottie()

    this.observer = Observer.create({
      axis: 'x',
      target: this.$el,
      type: 'touch,pointer',
      onClick: () => {
        if (!this.instructionsWebglVisible) return

        this.setInstructionsWebglVisible(false)
      },
      onDragStart: (e) => {
        if (e.axis !== 'x' && !this.instructionsWebglVisible) return

        this.setInstructionsWebglVisible(false)
      },
      dragMinimum: 10,
      lockAxis: true,
      tolerance: 5,
    })
  },

  beforeDestroy() {
    this.lottie?.destroy()
    this.observer?.kill()
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
      setInstructionsWebglVisible: 'setInstructionsWebglVisible',
    }),
  },
}
</script>

<style lang="scss">
.app-element-hero-instructions {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: desktop-vw(100px);
  background: rgba(255, 255, 255, 0.65);
  transition: opacity 0.65s var(--ease-in-out-cubic);
  pointer-events: none;
  opacity: 0;

  &.active {
    pointer-events: all;
    opacity: 1;
  }

  &.hide {
    opacity: 0;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      user-select: none;
    }
  }

  &__lottie {
    width: desktop-vw(170px);
    height: auto;
    margin-bottom: desktop-vw(20px);
  }
}
</style>
