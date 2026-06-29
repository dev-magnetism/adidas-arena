<template>
  <div class="app-programmation-hero grid-inner">
    <div class="app-programmation-hero__texts">
      <ERichText
        ref="title"
        class="app-programmation-hero__title"
        :content="content.title"
        tag="h1"
      />

      <ERichText
        ref="paragraph"
        class="app-programmation-hero__paragraph"
        :content="content.paragraph"
      />
    </div>
    <div ref="mainCard" class="app-programmation-hero__main-card">
      <EKinesis :speed="5" @click.native="onRouterPush">
        <AtomsCornerPoints :size-points="8" />

        <div class="app-programmation-hero__main-card__wrapper">
          <AppProgrammationEventStatus
            v-if="content.event.status_code !== 'C'"
            :presale="content.event.presale"
            :reported="this.isReported"
            :status="content.event.status_code"
            :waitnewdate="this.isWaitingNewDate"
          />

          <AtomsSpotifyCardLink
            v-if="content.event.spotify_link !== '' && content.event.spotify_link !== null"
            :cta-link="content.event.spotify_link"
            />

          <AppProgrammationImage
            :src="content?.event?.presentation_event?.filename_disk"
            :image-provider="content?.event?.presentation_event?.image_provider || 'accorarena'"
            :alt="`main-card-image-${content.event.id}-${content.event.artist_reference}`"
            :lazy="true"
            :sizes="{
              desktop: 'w800,h800,fcrop,q85',
              mobile: 'w800,h800,fcrop,q85',
            }"
          />

          <div class="app-programmation-hero__main-card__content">
            <TH3 class="app-programmation-hero__main-card__name">
              {{ content.event.artist_reference }}
              <span
                v-if="contentCard.full"
                class="app-programmation-hero__main-card__full"
                >Complet</span
              >
            </TH3>
            <div class="app-programmation-hero__main-card__dates">

              <TH4 
                v-if="this.isReported"
                class="app-programmation-hero__main-card__date reported"
              >
                {{ $formatDate(content.event.sessions, true, true, false, false) }}
              </TH4>
              <TH4 
                v-if="this.isReported && !this.isWaitingNewDate"
                class="app-programmation-hero__main-card__date">
                {{ $formatDate(content.event.sessions, true, false, true, false) }}
              </TH4>
              <TH4 
                v-if="!this.isReported"
                class="app-programmation-hero__main-card__date">
                {{ $formatDate(content.event.sessions, false, false, false, false) }}
               {{ (content.event.date_tbc)?` - ${programmationsEventContent.glossary_tbc}`:''}}
              </TH4>
            </div>
            <TP2
              v-if="
                content.event.min_price &&
                content.event.status_code !== 'K' &&
                content.event.status_code !== 'B' &&
                content.event.status_code !== 'C' &&
                content.event.status_code !== 'H'
              "
              weight="medium"
              class="app-programmation-hero__main-card__from-price"
            >
              {{ programmationsEventContent.glossary_from_price }}
              {{ content.event.min_price }}€
            </TP2>
            <TP2
              v-else
              weight="medium"
              class="app-programmation-hero__main-card__from-price"
            >
            </TP2>
          </div>
        </div>

        <AtomsCTA
          :href="{
            name: 'programmation-id',
            params: {
              id: `${$convertToKebabCase(content.event.content.url)}--${
                content.event.id
              }`,
            },
          }"
          :gtm-click="{
            id: `${content.event.id}`,
            name: `${content.event.artist_reference}`,
            category: `${content.event.content.category}`,
            category2: `${content.event.content.sub_category}`,
            price: `${content.event.min_price}`,
          }"
          class="app-programmation-hero__main-card__cta"
        >
          {{
            content.event.status_code === 'H' ||
            (content.event.status_code === 'B' && !content.event.presale) ||
            content.event.status_code === 'C'
              ? `En savoir +`
              : content.event.status_code === 'K' ||
                (content.event.status_code === 'B' && content.event.presale)
              ? `Liste d'attente`
              : `Réserver`
          }}
        </AtomsCTA>
      </EKinesis>
    </div>

    <div
      ref="visualBack"
      class="app-programmation-hero__visual-back-transparent"
    >
      <EKinesis :speed="10" />
    </div>

    <div class="app-programmation-hero__arrow-left">
      <ELottie id="Fleche_2" start="top center+=25%" end="bottom center-=25%" />
    </div>
    <div class="app-programmation-hero__arrow-right">
      <ELottie id="Fleche_2" start="top center+=25%" end="bottom center-=25%" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SplitText } from 'gsap/SplitText'
import { gsap } from 'gsap'

// calendar_highlight
// is_cover

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data(){
    return{
      isReported: false, // Check if all available dates are reported
      isWaitingNewDate: false, // Check if all available dates are waiting a new date
    }
  },
  computed: {
    ...mapState({
      programmationsContent: (state) => state.programmationsContent,
      programmationsEventContent: (state) => state.programmationsEventContent,
      fontsLoaded: (state) => state.fontsLoaded,
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
    contentCard() {
      return this.programmationsContent.find((el) => el.main_event)
    },
    theme() {
      return this.index % 3 === 0
        ? 'blue-adidas'
        : this.index % 3 === 1
        ? 'red-adidas'
        : 'grey'
    },
    statutColor() {
      return this.theme === 'grey' ? 'black' : this.theme
    },
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      if (this.$viewport.isMobile) {
        this.setAllowScroll(true)
      } else {
        this.appearHero(0.2)
      }
    },
    fontsLoaded(newVal) {
      if (!newVal || this.$viewport.isMobile) return

      this.initSplitText()
    },
  },
  mounted() {


    let _reported = 0;
    let _waitnewdate = 0;

    this.content.event.sessions.map((_sess, _sessI)=>{

      if(_sess.reported) _reported = _reported + 1;
      if(_sess.waiting_new_date) _waitnewdate = _waitnewdate + 1;

      return _sess;
    })

    if(_reported === this.content.event.sessions.length){
      //  console.log('all sessions are reported');
      this.isReported = true;
    }
    if(_waitnewdate > 0){
      //  console.log('all sessions are waiting a new date');
      this.isWaitingNewDate = true;
    }

    if (this.allLoadedFake && !this.$viewport.isMobile) {
      this.initSplitText()
      this.appearHero(0.95)
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    }
  },
  beforeDestroy() {
    this.mm?.revert()
    this.tlAppear?.clear()
    this.tlAppear?.kill()
  },
  methods: {
    onRouterPush() {
      this.$router.push({
        name: 'programmation-id',
        params: {
          id: `${this.$convertToKebabCase(this.content.event.content.url)}--${
            this.content.event.id
          }`,
        },
      })
    },
    appearHero(delay = 0) {
      this.tlAppear?.clear()
      this.tlAppear?.kill()

      this.tlAppear = gsap
        .timeline({
          delay,
          onComplete: () => {
            this.initMatchMedia()
          },
        })
        .addLabel('texts')
        .fromTo(
          this.splittingChild.lines,
          {
            y: '-100%',
          },
          {
            y: '0',
            duration: 0.6,
            stagger: 0.065,
            ease: 'power3.out',
          },
          'texts'
        )
        .fromTo(
          this.$refs.paragraph.$el,
          {
            y: -30,
          },
          {
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          'texts+=15%'
        )
        .fromTo(
          this.$refs.paragraph.$el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          'texts+=15%'
        )
        .addLabel('visuals', 'texts')
        .fromTo(
          this.$refs.mainCard,
          {
            y: '20%',
            rotate: 8,
          },
          {
            y: '0%',
            rotate: 3,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals'
        )
        .fromTo(
          this.$refs.mainCard,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          'visuals+=5%'
        )
        .fromTo(
          this.$refs.visualBack,
          {
            y: '20%',
            rotate: -10,
          },
          {
            y: '0%',
            rotate: -5,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals+=30%'
        )
        .fromTo(
          this.$refs.visualBack,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          'visuals+=30%'
        )
    },
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.setAllowScroll(true)

        const tweenMainCard = gsap.to(this.$refs.mainCard, {
          yPercent: -10,
          rotate: 2,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        const tweenVisualback = gsap.to(this.$refs.visualBack, {
          yPercent: -40,
          rotate: -2,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        return () => {
          tweenMainCard?.kill()
          tweenVisualback?.kill()
        }
      })
    },
    initScrollTrigger() {},
    initSplitText() {
      const title = this.$refs.title.$el.querySelectorAll('.H2')

      this.splittingChild = new SplitText(title, {
        type: 'lines',
        linesClass: 'child line',
      })

      this.splittingParent = new SplitText(title, {
        type: 'lines',
        linesClass: 'parent',
      })
    },
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation-hero {
  position: relative;

  &__texts {
    grid-column: 2 / span 5;
    display: inline-flex;
    flex-direction: column;
    position: relative;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__title {
    width: 100%;

    .app-atoms-stroke-text {
      -webkit-text-stroke: 1px var(--c-black);
      -webkit-text-fill-color: transparent;
    }

    .H2.medium {
      @include font-ITCFranklinGothicLT-DmCp();

      @include mobile-l {
        font-size: mobile-vw(57px);
        line-height: mobile-vw(47px);
      }

      @include desktop-xl {
        font-size: desktop-vw(80px);
        line-height: desktop-vw(70px);
      }
    }
  }

  .child {
    // display: inline-block !important;
  }

  .parent {
    overflow: hidden;
  }

  &__arrow-left,
  &__arrow-right {
    @include mobile {
      display: none;
    }
  }

  &__arrow-left {
    position: absolute;
    top: 60%;
    width: desktop-vw(90px);
    transform: scaleX(-1) rotate(20deg);
    left: 15%;
    aspect-ratio: 90 / 130;
  }

  &__arrow-right {
    position: absolute;
    top: 80%;
    width: desktop-vw(90px);
    transform: scaleX(1) rotate(20deg);
    left: 30%;
    aspect-ratio: 90 / 130;

    svg {
      path {
        stroke: var(--c-red-adidas);
      }
    }
  }

  &__paragraph {
    width: 85%;
    text-transform: uppercase;
    margin-top: desktop-vw(25px);

    p.P2 {
      font-size: desktop-vw(17px);
      @include font-ITCFranklinGothicLT-DmCp();
      color: var(--c-black);

      @include mobile {
        font-size: mobile-vw(16px);
        line-height: mobile-vw(18px);
      }

      @include mobile-l {
        font-size: mobile-vw(12px);
        line-height: mobile-vw(18px);
      }

      @include desktop-xl {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(18px);
      }
    }

    @include mobile {
      width: 75%;
      margin-top: mobile-vw(40px);
    }

    @include desktop-xl {
      width: 50%;
      margin-top: desktop-vw(15px);
    }
  }

  &__main-card {
    position: relative;
    grid-column: 8 / span 5;
    width: 100%;
    left: -5%;
    transform: rotate(3deg);
    z-index: 1;
    display: flex;
    flex-direction: column;
    transform-origin: left center;

    .app-programmation-event-statuses {
      position: absolute;
      right: 0;
      border-right: none;
      border-top: none;
      top: 0;
      z-index: 10;

      @include mobile-l {
        font-size: mobile-vw(15px);
        line-height: mobile-vw(15px);
      }

      @include desktop-xl {
        font-size: desktop-vw(25px);
        line-height: desktop-vw(25px);
      }
    }

    .app-element-kinesis {
      display: flex;
      flex-direction: column;
      background: var(--c-white);
      cursor: pointer;
    }

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
      left: 0;
      width: 95%;
      margin-top: mobile-vw(40px);
    }

    @include mobile-l {
      width: 85%;
      margin: mobile-vw(30px) auto 0;
    }

    @include desktop-xl {
      grid-column: 8 / span 4;
    }

    &__wrapper {
      padding: desktop-vw(15px) desktop-vw(15px) desktop-vw(25px)
        desktop-vw(15px);
      z-index: 1;

      @include mobile {
        padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(15px) mobile-vw(15px);
      }

      @include mobile-l {
        padding: mobile-vw(10px) mobile-vw(10px) mobile-vw(10px) mobile-vw(10px);
      }

      @include desktop-xl {
        padding: desktop-vw(10px) desktop-vw(10px) desktop-vw(20px)
          desktop-vw(10px);
      }
    }

    &__content {
      display: flex;
      flex-direction: column;

      .H3.bold{
        font-size: desktop-vw(64px);

        @include mobile{
          font-size: mobile-vw(64px);
        }
      }

    }


    &__name {
      margin-top: desktop-vw(10px);
      display: flex;
      flex-direction: row;

      &.H3.bold {
          
        @include mobile {
          font-size: mobile-vw(50px);
          line-height: mobile-vw(50px);
        }
      }

      @include mobile {
        margin-top: mobile-vw(20px);
      }

      @include mobile-l {
        font-size: mobile-vw(36px);
        line-height: mobile-vw(36px);
      }

      @include desktop-xl {
        font-size: desktop-vw(48px);
        line-height: desktop-vw(54px);
      }
    }

    &__full {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(16px);
      letter-spacing: -0.02em;
      @include font-ITCFranklinGothicLT-DmCp();
      color: var(--c-red-adidas);
      margin-left: desktop-vw(20px);
      align-self: flex-start;
      margin-top: desktop-vw(10px);

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(16px);
      }
    }

    &__dates {
      display: flex;
      wrap: flex-wrap;
      justify-content: flex-start;
      align-items: center;
    }

    &__date {
      display: inline-block;
      margin-top: desktop-vw(15px);

      @include mobile {
        margin-top: mobile-vw(10px);
      }

      @include mobile-l {
        font-size: mobile-vw(16px);
        line-height: mobile-vw(16px);
      }

      @include desktop-xl {
        font-size: desktop-vw(28px);
        line-height: desktop-vw(28px);
      }

      &__small{
        font-size: desktop-vw(16px);
        line-height: desktop-vw(16px);


        @include mobile {
          font-size: mobile-vw(16px);
          line-height: mobile-vw(16px);
        }

        @include desktop-xl {
          font-size: desktop-vw(20px);
          line-height: desktop-vw(20px);
        }
      }


      &.reported{
        position: relative;
        
        text-decoration: line-through;
      }
    }

    &__from-price {
      margin-top: desktop-vw(30px);
      align-self: flex-start;

      @include mobile {
        margin-top: mobile-vw(15px);
        align-self: flex-end;
      }
    }

    picture,
    .app-programmation-image--directus {
      aspect-ratio: 540 / 480;
      width: 100%;
      height: auto;
      display: block;
      @include noise();
      position: relative;

      img {
        display: block;
      }
    }

    &__cta.app-atoms-cta {
      min-width: 50%;
      margin-left: auto;
      display: inline-flex;
      border-bottom: none;
      border-right: none;

      @include mobile {
        padding: mobile-vw(10px) mobile-vw(5px) mobile-vw(10px) mobile-vw(15px);
        min-width: 60%;
      }

      @include mobile-l {
        padding: mobile-vw(5px) mobile-vw(20px) mobile-vw(5px) mobile-vw(20px);
        min-width: unset;
      }

      .P2 {
        @include mobile-l {
          font-size: mobile-vw(12px);
          line-height: mobile-vw(10px);
        }
      }

      .app-atoms-cta__arrow {
        @include mobile-l {
          margin-left: mobile-vw(20px);
          width: mobile-vw(12px);
        }
      }

      svg {
        @include mobile {
          // padding: mobile-vw(10px) mobile-vw(5px) mobile-vw(10px) mobile-vw(15px);
        }
      }
    }
  }
  &__visual-back-transparent {
    grid-column: 7 / span 2;
    position: absolute;
    width: 100%;
    height: auto;
    bottom: 5%;
    z-index: 0;
    transform: rotate(-5deg);
    transform-origin: right center;

    .app-element-kinesis {
      @include fake-transparent();
      aspect-ratio: 185 / 230;
    }

    @include mobile {
      grid-column: 1 / span 3;
      left: -35%;
      bottom: -10%;
    }

    @include mobile-l {
      left: -30%;
      bottom: -5%;
    }

    @include desktop-xl {
      left: 15%;
      bottom: 3%;
    }
  }
}
</style>
