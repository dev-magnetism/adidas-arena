<template>
  <div class="app-error">
    <div class="app-error__content">
      <TH1 weight="bold" class="app-error__content__title-stroke">
        Désolé !
        <div
          ref="lottieCircleBlue"
          class="app-error__lottie app-error__lottie-cercle-blue"
        />
      </TH1>
      <TH2 weight="bold" class="app-error__content__subtitle">
        <div
          ref="lottieGribouillisRed"
          class="app-error__lottie app-error__lottie-gribouillis-red"
        />
        la page que <br />
        vous recherchez</TH2
      >
      <TH1 class="app-error__content__title">
        n’existe pas.
        <div
          ref="lottieGribouillisBlue"
          class="app-error__lottie app-error__lottie-gribouillis-blue"
        />
      </TH1>
      <div
        ref="lottieFlecheBlue"
        class="app-error__lottie app-error__lottie-fleche-blue"
      />
      <div
        ref="lottieFlecheRed1"
        class="app-error__lottie app-error__lottie-fleche-red-1"
      />
      <div
        ref="lottieFlecheRed2"
        class="app-error__lottie app-error__lottie-fleche-red-2"
      />
      <div
        ref="lottieFlecheRed3"
        class="app-error__lottie app-error__lottie-fleche-red-3"
      />
      <div
        ref="lottieFlecheRed4"
        class="app-error__lottie app-error__lottie-fleche-red-4"
      />
    </div>
    <AtomsCTA class="app-error__cta" link="/"> Page d'accueil </AtomsCTA>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import lottie from 'lottie-web'

import pageTransition from '@/mixins/page-transition'

export default {
  layout: 'error',
  transition(to, from) {
    return pageTransition.basic
  },
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      preloaderHidden: (state) => state.preloaderHidden,
    }),
  },
  watch: {
    preloaderHidden(payload) {
      if (!payload) return

      this.runLotties()
    },
  },

  mounted() {
    this.initLotties()
  },

  methods: {
    runLotties() {
      this.lottieCircleBlue.play()
      this.lottieGribouillisBlue.play()
      this.lottieFlecheRed1.play()
      this.lottieFlecheRed2.play()
      this.lottieFlecheRed3.play()
      this.lottieFlecheRed4.play()
      this.lottieFlecheBlue.play()
    },
    initLotties() {
      const lottieCircleBlueJson = require(`@/assets/lotties/404/Cercle_bleu.json`)
      this.lottieCircleBlue = lottie.loadAnimation({
        container: this.$refs.lottieCircleBlue,
        loop: false,
        autoplay: false,
        animationData: lottieCircleBlueJson,
      })

      const lottieGribouillisBlueJson = require(`@/assets/lotties/404/Gribouillis_bleu.json`)
      this.lottieGribouillisBlue = lottie.loadAnimation({
        container: this.$refs.lottieGribouillisBlue,
        loop: false,
        autoplay: false,
        animationData: lottieGribouillisBlueJson,
      })

      const lottieGribouillisRedJson = require(`@/assets/lotties/404/Gribouillis_rouge.json`)
      this.lottieGribouillisRed = lottie.loadAnimation({
        container: this.$refs.lottieGribouillisRed,
        loop: false,
        autoplay: false,
        animationData: lottieGribouillisRedJson,
      })

      const lottieFlecheRed1 = require(`@/assets/lotties/404/Fleche_rouge_1.json`)
      this.lottieFlecheRed1 = lottie.loadAnimation({
        container: this.$refs.lottieFlecheRed1,
        loop: false,
        autoplay: false,
        animationData: lottieFlecheRed1,
      })

      const lottieFlecheRed2 = require(`@/assets/lotties/404/Fleche_rouge_2.json`)
      this.lottieFlecheRed2 = lottie.loadAnimation({
        container: this.$refs.lottieFlecheRed2,
        loop: false,
        autoplay: false,
        animationData: lottieFlecheRed2,
      })

      const lottieFlecheRed3 = require(`@/assets/lotties/404/Fleche_rouge_3.json`)
      this.lottieFlecheRed3 = lottie.loadAnimation({
        container: this.$refs.lottieFlecheRed3,
        loop: false,
        autoplay: false,
        animationData: lottieFlecheRed3,
      })

      const lottieFlecheRed4 = require(`@/assets/lotties/404/Fleche_rouge_4.json`)
      this.lottieFlecheRed4 = lottie.loadAnimation({
        container: this.$refs.lottieFlecheRed4,
        loop: false,
        autoplay: false,
        animationData: lottieFlecheRed4,
      })

      const lottieFlecheBlue = require(`@/assets/lotties/404/Fleche_bleu.json`)
      this.lottieFlecheBlue = lottie.loadAnimation({
        container: this.$refs.lottieFlecheBlue,
        loop: false,
        autoplay: false,
        animationData: lottieFlecheBlue,
      })
    },
  },
}
</script>

<style lang="scss">
.app-error {
  height: 100vh;
  background: var(--c-grey);
  z-index: 3 !important;
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &__lottie {
    position: absolute;

    &-cercle-blue {
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
    }
    &-gribouillis-red {
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      width: 35%;
    }
    &-gribouillis-blue {
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
    }
    &-fleche-blue {
      right: 0;
      top: 50%;
      transform: translate(90%, 0%);
    }
    &-fleche-red-1 {
      left: 0;
      bottom: 0;
      transform: translate(-100%, 0%);
    }
    &-fleche-red-2 {
      left: 0;
      top: 35%;
      transform: translate(-65%, -50%);
    }
    &-fleche-red-3 {
      right: 0;
      top: 30%;
      transform: translate(50%, -50%);
    }
    &-fleche-red-4 {
      right: 0;
      bottom: 0;
      transform: translate(100%, 100%);
    }
  }

  &__content {
    margin-bottom: desktop-vh(70px);
    width: 40%;
    text-align: center;
    position: relative;

    &__title-stroke.H1 {
      -webkit-text-stroke: 1px var(--c-black);
      -webkit-text-fill-color: transparent;
      position: relative;
    }
    &__subtitle.H2 {
      position: relative;
    }
    &__title.H1 {
      position: relative;
    }
  }

  &__cta.app-atoms-cta {
    width: 25%;
  }
}
</style>
