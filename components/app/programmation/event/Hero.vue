<template>
  <div class="app-programmation-event-hero grid-inner">
    <div class="app-programmation-event-hero__left">
      <TH4
        v-if="event.status_code === 'H' || event.status_code === 'K'"
        color="red-adidas"
        class="app-programmation-event-hero__full timeline-text"
      >
        {{ event.status_code === 'H' ? 'Annulé' : '' }}
        {{ event.status_code === 'K' ? 'Complet' : '' }}
      </TH4>
      <TH4
        color="blue-adidas"
        class="app-programmation-event-hero__soon timeline-text"
      >
        bientôt disponible
      </TH4>
      <TH2Bis
        ref="date"
        class="app-programmation-event-hero__date timeline-text"
      >
        {{ $formatDate(event.sessions) }}
      </TH2Bis>
      <TH1
        ref="title"
        weight="bold"
        class="app-programmation-event-hero__title"
      >
        {{ event.artist_reference }}
      </TH1>

      <div
        class="app-programmation-event-hero__ticket-office-opening timeline-block"
      >
        <TH4>Ouverture de la billetterie : </TH4>
        <TH4
          weight="bold"
          color="red-adidas"
          class="app-programmation-event-hero__ticket-office-opening__date"
        >
          le 15 novembre 2023
        </TH4>
      </div>

      <div class="app-programmation-event-hero__cta timeline-block">
        <TP2 weight="medium" class="app-programmation-event-hero__information">
          Exclusivité en France, à partir de {{ event.min_price }}€
        </TP2>
        <AtomsCTA> Réserver mon billet </AtomsCTA>
      </div>
    </div>
    <div ref="rightEl" class="app-programmation-event-hero__right">
      <div ref="lottieTop" class="app-programmation-event-hero__lottie-top" />
      <div ref="lottieLeft" class="app-programmation-event-hero__lottie-left" />
      <div
        ref="lottieBottom"
        class="app-programmation-event-hero__lottie-bottom"
      />

      <AtomsCornerPoints :size-points="10" />
      <AppProgrammationEventTag>
        {{ event.content.category }}
      </AppProgrammationEventTag>

      <AppProgrammationImage
        :src="event.list_image.filename_disk"
        :alt="`image-`"
        :lazy="false"
      />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import lottie from 'lottie-web'
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      playhead: {
        left: 0,
        top: 0,
        bottom: 0,
      },
    }
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      this.initTimeline(0.35)
    },
  },
  mounted() {
    this.initSplitText()
    this.initLotties()

    if (this.allLoadedFake) {
      this.initTimeline(0.8)
    }
  },

  beforeDestroy() {
    this.tl?.kill()

    this.lottieTop?.destroy()
    this.lottieLeft?.destroy()
    this.lottieBottom?.destroy()
  },
  methods: {
    initTimeline(delay = 0) {
      if (this.$viewport.isMobile) {
        this.setAllowScroll(true)
      } else {
        this.tl = gsap
          .timeline({
            delay,
            onStart: () => {
              this.setAllowScroll(true)
            },
          })
          .addLabel('texts')
          .fromTo(
            this.$refs.rightEl,
            {
              '--scale-front-y': 1,
            },
            {
              '--scale-front-y': 0,
              duration: 0.7,
              ease: 'power1.inOut',
            },
            'texts'
          )
          .fromTo(
            this.$refs.rightEl,
            {
              '--scale-back-y': 1,
            },
            {
              '--scale-back-y': 0,
              duration: 0.7,
              ease: 'power1.inOut',
            },
            'texts+=20%'
          )
          .fromTo(
            ['.timeline-text', this.splitting.lines, '.timeline-block'],
            {
              y: 75,
            },
            {
              y: '0%',
              duration: 0.4,
              stagger: 0.035,
              ease: 'power1.inOut',
            },
            'texts'
          )
          .fromTo(
            ['.timeline-text', this.splitting.lines, '.timeline-block'],
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 0.6,
              stagger: 0.035,
              ease: 'power1.inOut',
            },
            'texts'
          )
          .addLabel('lotties', 'texts')
          .fromTo(
            this.playhead,
            { top: 0 },
            {
              duration: 0.6,
              top: this.lottieTop.totalFrames,
              ease: 'power1.inOut',
              delay: 0.4,
              onUpdate: () =>
                this.lottieTop.goToAndStop(this.playhead.top, true),
            },
            'lotties'
          )
          .fromTo(
            this.playhead,
            { left: 0 },
            {
              duration: 0.6,
              left: this.lottieLeft.totalFrames,
              ease: 'power1.inOut',
              delay: 0.6,
              onUpdate: () =>
                this.lottieLeft.goToAndStop(this.playhead.left, true),
            },
            'lotties'
          )
          .fromTo(
            this.playhead,
            { bottom: 0 },
            {
              duration: 0.6,
              delay: 0.8,
              bottom: this.lottieBottom.totalFrames,
              ease: 'power1.inOut',
              onUpdate: () =>
                this.lottieBottom.goToAndStop(this.playhead.bottom, true),
            },
            'lotties'
          )
      }
    },
    initSplitText() {
      if (this.$viewport.isMobile) return

      this.splitting = new SplitText(this.$refs.title.$el, {
        type: 'lines',
        linesClass: 'line',
      })
    },
    initLotties() {
      if (this.$viewport.isMobile) return

      this.lottieTop = lottie.loadAnimation({
        container: this.$refs.lottieTop,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Petite_Fleche_01.json`),
      })

      this.lottieLeft = lottie.loadAnimation({
        container: this.$refs.lottieLeft,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Fleche_2.json`),
      })

      this.lottieBottom = lottie.loadAnimation({
        container: this.$refs.lottieBottom,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Petite_Fleche_03.json`),
      })
    },
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation-event-hero {
  &__left {
    grid-column: 2 / 6 span;
    display: flex;
    flex-direction: column;

    @include mobile {
      grid-column: 1 / 6 span;
      grid-row: 1;
    }
  }

  &__ticket-office-opening {
    margin-bottom: desktop-vw(65px);

    @include mobile {
      margin-bottom: mobile-vw(40px);
    }
  }

  &__lottie-top,
  &__lottie-left,
  &__lottie-bottom {
    position: absolute;
    z-index: 10;

    @include mobile {
      display: none;
    }
  }

  &__lottie-top {
    right: desktop-vw(100px);
    width: desktop-vw(70px);
    height: auto;
    transform: rotate(-45deg) scale(-1, 1);
    top: -6%;

    svg {
      path {
        stroke: var(--c-black);
      }
    }
  }

  &__lottie-left {
    width: desktop-vw(55px);
    height: auto;
    transform: rotate(-50deg) scale(-1, 1);
    top: 45%;
    right: 105%;
  }

  &__lottie-bottom {
    top: 95%;
    right: 25%;
    width: desktop-vw(90px);
    height: auto;
    transform: rotate(10deg);
  }

  &__full {
    margin-bottom: desktop-vw(15px);

    @include mobile {
      margin-bottom: mobile-vw(10px);
    }
  }

  &__soon {
    margin-bottom: desktop-vw(15px);

    @include mobile {
      margin-bottom: mobile-vw(10px);
    }
  }

  &__date {
    margin-bottom: desktop-vw(20px);

    @include mobile {
      margin-bottom: mobile-vw(15px);
      font-size: mobile-vw(32px);
      line-height: mobile-vw(30px);
      @include font-adihausDIN-cn-bold();
    }
  }

  &__cta {
    display: flex;
    flex-direction: column;
  }

  .app-atoms-cta {
    width: 50%;

    @include mobile {
      width: 90%;
    }
  }

  &__information {
    margin-bottom: desktop-vw(10px);

    @include mobile {
      margin-bottom: mobile-vw(10px);
    }
  }

  &__title {
    margin-bottom: desktop-vw(55px);

    @include mobile {
      margin-bottom: mobile-vw(30px);
      font-size: mobile-vw(64px);
      line-height: mobile-vw(58px);
    }
  }

  &__right {
    grid-column: 8 / span 5;
    background: white;
    aspect-ratio: 550/ 695;
    width: 100%;
    height: auto;
    position: relative;
    --scale-back-y: 1;
    --scale-front-y: 1;

    @include mobile {
      grid-column: 1 / 6 span;
      grid-row: 2;
      aspect-ratio: 345/ 430;
    }

    &::before {
      content: '';
      width: calc(100% + 16px);
      height: calc(100% + 16px);
      background: var(--c-grey);
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 99;
      transform: translate(-50%, -50%) scaleY(var(--scale-front-y));
      transform-origin: center bottom;

      @include mobile {
        display: none;
      }
    }

    &::after {
      content: '';
      width: calc(100%);
      height: calc(100%);
      background: var(--c-blue-adidas);
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 98;
      transform: translate(-50%, -50%) scaleY(var(--scale-back-y));
      transform-origin: center bottom;

      @include mobile {
        display: none;
      }
    }

    picture.app-programmation-image {
      position: relative;
      z-index: 1;
      @include noise();
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .app-programmation-event-tag {
      position: absolute;
      left: 0;
      top: 0;
      border-top: none;
      border-left: none;
      z-index: 2;
    }
  }
}
</style>
