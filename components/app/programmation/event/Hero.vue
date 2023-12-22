<template>
  <div class="app-programmation-event-hero grid-inner">
    <div class="app-programmation-event-hero__left">
      <TH4
        color="red-adidas"
        class="app-programmation-event-hero__full timeline-text"
      >
        {{
          event.reported
            ? programmationsEventContent.glossary_deferred
            : event.status_code === 'H'
            ? programmationsEventContent.glossary_cancelled
            : event.status_code === 'K'
            ? programmationsEventContent.glossary_full
            : ''
        }}
      </TH4>
      <TH4
        color="blue-adidas"
        class="app-programmation-event-hero__soon timeline-text"
      >
        {{
          event.presale && event.status_code === 'B'
            ? programmationsEventContent.glossary_presales
            : event.status_code === 'B' || event.status_code === 'C'
            ? programmationsEventContent.glossary_soon_available
            : ''
        }}
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
        v-if="event.opening && event.status_code === 'B' && event.presale"
        class="app-programmation-event-hero__ticket-office-opening timeline-block"
      >
        <TH4> {{ programmationsEventContent.glossary_opening_tickets }} </TH4>
        <TH4
          weight="bold"
          color="red-adidas"
          class="app-programmation-event-hero__ticket-office-opening__date"
        >
          le {{ $formatDate(event.opening) }}
        </TH4>
      </div>

      <div class="app-programmation-event-hero__cta timeline-block">
        <TP2
          v-if="event.status_code === 'D'"
          weight="medium"
          class="app-programmation-event-hero__information"
        >
          {{ programmationsEventContent.glossary_exclu_france_price }}
          {{ event.min_price }}€
        </TP2>
        <TP2
          v-else-if="event.status_code === 'K'"
          weight="medium"
          class="app-programmation-event-hero__information"
        >
          Show complet, inscrivez-vous sur la liste d’attente !
        </TP2>
        <TP2
          v-else-if="event.status_code === 'B' && event.presale"
          weight="medium"
          class="app-programmation-event-hero__information"
        >
          Inscrivez-vous sur la liste d’attente !
        </TP2>

        <AtomsCTA
          v-if="
            event.sessions.length > 1 &&
            ((event.status_code === 'B' && event.presale) ||
              (event.status_code !== 'C' && event.status_code !== 'H' && event.status_code !== 'D'))
          "
          button
          @click.native="anchorToDates"
        >
          Liste d'attente
        </AtomsCTA>

        <AtomsCTA
          v-else-if="
            event.sessions.length > 1 && event.status_code === 'D'
          "
          :href="event.sessions[0].content.url"
        >
          Réserver
        </AtomsCTA>

        <AtomsCTAForm
          v-else-if="
            event.status_code === 'K' ||
            (event.status_code === 'B' && event.presale)
          "
          :session="event.sessions[0]"
          :event-id="event.id"
          :event-name="event.artist_reference"
          :event-date="event.sessions[0].date"
          :status-code="event.status_code"
        >
          Liste d'attente
        </AtomsCTAForm>

        <AtomsCTA
          v-else-if="event.status_code === 'D'"
          :href="event.sessions[0].content.url"
        >
          Réserver mon billet
        </AtomsCTA>
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
      <AppProgrammationEventTag
        v-if="event.content.category.toLowerCase() !== 'no cat'"
      >
        {{ event.content.category }}
      </AppProgrammationEventTag>

      <AtomsSpotifyCardLink
        v-if="event.spotify_link !== '' && event.spotify_link !== null"
        :cta-link="event.spotify_link"
        />

      <AppProgrammationImage
        :src="event?.presentation_event?.filename_disk"
        :alt="`image-`"
        :lazy="false"
        :sizes="{
          desktop: 'w600,h600,fcrop,q85',
          mobile: 'w600,h600,fcrop,q85',
        }"
      />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import lottie from 'lottie-web'
import { mapState, mapMutations } from 'vuex'

import { createPopup } from '@typeform/embed'
import '@typeform/embed/build/css/popup.css'

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
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      this.initTimeline(0.35)
    },
  },
  mounted() {

    console.log('Page event', this.event)
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
    popup() {
      const options = {
        opacity: '100',
        size: '70',
        iframeProps: {
          title: 'Test Adidas Arena',
        },
        transitiveSearchParams: '',
        medium: 'snippet',
        hidden: {
          list_name: 'Site Adidas Arena',
          api_key: 'EBu7rZdGJLInGv',
        },
      }

      const { toggle } = createPopup('ZAHIdrU3', options)

      toggle
    },
    anchorToDates() {
      window.lenis.scrollTo('.app-programmation-event-dates', {
        lock: true,
        duration: 0.75,
        offset: -35,
      })
    },
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
    margin-bottom: desktop-vw(5px);

    @include mobile {
      margin-bottom: mobile-vw(10px);
    }
  }

  &__title {
    margin-bottom: desktop-vw(55px);
    font-size: 8.680555555555556vw;

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
