<template>
  <div class="app-programmation-event-hero grid-inner">
    <div class="app-programmation-event-hero__left">
      <TH4
        color="red-adidas"
        class="app-programmation-event-hero__full timeline-text"
      >
        {{
          this.isReported
            ? programmationsEventContent.glossary_deferred
            : event.status_code === 'H'
            ? programmationsEventContent.glossary_cancelled
            : event.status_code === 'K'
            ? programmationsEventContent.glossary_full
            : ''
        }}
        {{
          this.isReported && this.isWaitingNewDate ? 
          `- ${programmationsEventContent.glossary_waiting_new_date}`
          : ''
        }}
      </TH4>
      <TH4
        v-if="(event.presale && event.status_code === 'B')||event.status_code === 'B'"
        color="blue-adidas"
        class="app-programmation-event-hero__soon timeline-text"
      >
        {{
          event.presale && event.status_code === 'B'
            ? programmationsEventContent.glossary_presales
            : event.status_code === 'B' 
            ? programmationsEventContent.glossary_soon_available
            : ''
        }}
      </TH4>
      <TP2
        v-if="this.isReported"
        ref="date"
        class="app-programmation-event-hero__date timeline-text reported 
        "
        :class="{wnd: this.isWaitingNewDate}"
      >
        {{ $formatDate(event.sessions, true, true, false, false) }}

        <svg width="282" height="10" viewBox="0 0 282 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="app-programmation-event-hero__date__reported">
        <path d="M1.00005 2.93108C19.0881 6.4139 38.2958 5.7748 56.8823 5.77187C98.8445 5.76525 140.765 6.77661 182.741 6.29452C199.436 6.10277 216.125 5.67327 232.815 5.19864C234.568 5.14878 249.798 3.4094 251.81 5.47882C252.322 6.00545 205.142 8.24187 202.309 8.19911C164.639 7.63048 126.921 7.48743 89.2819 6.32714C79.0612 6.01207 68.8647 5.50522 58.6554 5.06515C54.0727 4.86761 44.1044 5.96163 39.85 4.04125C30.7886 -0.0490227 60.9338 2.8422 71.4676 3.06006C141.066 4.49948 210.448 3.74217 280.097 2.37735" stroke="#FF4A48" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </TP2>
      <TH2Bis
        v-if="this.isReported && !this.isWaitingNewDate"
        ref="date"
        class="app-programmation-event-hero__date timeline-text"
      >
        {{ $formatDate(event.sessions, true, false, true, false) }}
      </TH2Bis>
      <TH2Bis
        v-if="!this.isReported"
        ref="date"
        class="app-programmation-event-hero__date timeline-text"
      >
        {{ $formatDate(event.sessions, false) }}
        {{ (event.date_tbc)?` - ${programmationsEventContent.glossary_tbc}`:''}}
      </TH2Bis>
      <TH1
        ref="title"
        weight="bold"
        class="app-programmation-event-hero__title"
      >
        {{ event.artist_reference }}
      </TH1>

      <div
        v-if="event.opening && event.status_code === 'B' && event.presale && !event.ticketing_date_unknown"
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
          :href="(event.ticketing_main_url)?event.ticketing_main_url:event.sessions[0].content.url"
        >
          Réserver
        </AtomsCTA>

        <AtomsCTA
          v-else-if="
            event.status_code === 'H'
          "
          href="https://faq.adidasarena.com/hc/fr"
        >
          Remboursement
        </AtomsCTA>

        <AtomsCTAForm
          v-else-if="
            event.status_code === 'K' ||
            event.status_code === 'C' ||
            (event.status_code === 'B' && event.presale)
          "
          :session="event.sessions[0]"
          :event-id="event.id"
          :event-name="event.artist_reference"
          :event-date="event.sessions[0].date"
          :status-code="event.status_code"
        >
          {{
            event.status_code === 'K'
              ? "Liste d'attente"
              : "Je m'inscris"
          }}
        </AtomsCTAForm>

        <AtomsCTA
          v-else-if="event.status_code === 'D'"
          :href="(event.ticketing_main_url)?event.ticketing_main_url:event.sessions[0].content.url"
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
          desktop: 'w800,h800,fcrop,q85',
          mobile: 'w800,h800,fcrop,q85',
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
      isReported: false, // Check if all available dates are reported
      isWaitingNewDate: false, // Check if all available dates are waiting a new date
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
  
    let _reported = 0;
    let _waitnewdate = 0;

    this.event.sessions.map((_sess, _sessI)=>{

      if(_sess.reported) _reported = _reported + 1;
      if(_sess.waiting_new_date) _waitnewdate = _waitnewdate + 1;

      return _sess;
    })

    if(_reported === this.event.sessions.length){
      //  console.log('all sessions are reported');
      this.isReported = true;
    }
    if(_waitnewdate > 0){
      //  console.log('all sessions are waiting a new date');
      this.isWaitingNewDate = true;
    }

    // console.log('Page event', this.event)
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


    this.lottieReported?.destroy()
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

      this.lottieReported = lottie.loadAnimation({
        container: this.$refs.lottieReported,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Gribouillis_Rouge.json`),
      })


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
    justify-content: flex-start;
    align-items: flex-start;

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
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: desktop-vw(10px);
    font-size: desktop-vw(32px);

    @include mobile {
      margin-bottom: mobile-vw(10px);
      font-size: mobile-vw(32px);
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

    &.H2-bis.bold{
      font-size: desktop-vw(60px);
      line-height: desktop-vw(60px);
    }

    &__reported{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 120%;
      height: auto;
      transform: translate(-50%, -50%);
    }

    &.reported{
      position: relative;
      flex: 0 0 auto;
      width: auto;
      font-size: desktop-vw(32px);
      line-height: desktop-vw(32px);

      @include mobile {
        font-size: mobile-vw(18px);
        line-height: mobile-vw(18px);
      }

      &.wnd{
        font-size: desktop-vw(72px);
        line-height: desktop-vw(72px);
      }
    }

    @include mobile {
      margin-bottom: mobile-vw(15px);
      font-size: mobile-vw(32px);
      line-height: mobile-vw(30px);
    }
  }


  &__cta {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .app-atoms-cta-form,
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
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: desktop-vw(55px);
    font-size: desktop-vw(101px);
    line-height: desktop-vw(91px);
    letter-spacing: 1px;

    @include mobile {
      margin-bottom: mobile-vw(30px);
      font-size: mobile-vw(64px);
      line-height: mobile-vw(58px);
    }
  }

  &__right {
    grid-column: 8 / span 5;
    background: white;
    aspect-ratio: 550/ 550; // 550/ 695;
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
