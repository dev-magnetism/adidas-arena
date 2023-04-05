<template>
  <div class="app-programmation-hero grid-inner">
    <div class="app-programmation-hero__texts">
      <ERichText
        ref="title"
        class="app-programmation-hero__title"
        :content="contents.title"
        tag="h1"
      />

      <ERichText
        ref="paragraph"
        class="app-programmation-hero__paragraph"
        :content="contents.paragraph"
      />

      <div class="app-programmation-hero__arrow-left">
        <ELottie id="Fleche_2" start="top center" end="bottom center-=25%" />
      </div>
      <div class="app-programmation-hero__arrow-right">
        <ELottie id="Fleche_2" start="top center" end="bottom center-=25%" />
      </div>
    </div>
    <div ref="mainCard" class="app-programmation-hero__main-card">
      <EKinesis :speed="5">
        <AtomsCornerPoints :size-points="8" />

        <div class="app-programmation-hero__main-card__wrapper">
          <nuxt-picture
            provider="directus"
            sizes="sm:100vw md:40vw"
            :src="contentCard.visual"
            :alt="`visual-${contentCard.name}`"
          />

          <div class="app-programmation-hero__main-card__content">
            <TH3 class="app-programmation-hero__main-card__name">
              {{ contentCard.name }}
              <span
                v-if="contentCard.full"
                class="app-programmation-hero__main-card__full"
                >Complet</span
              >
            </TH3>
            <TH4 class="app-programmation-hero__main-card__date">
              {{ contentCard.date }}
            </TH4>
            <TP2
              weight="medium"
              class="app-programmation-hero__main-card__from-price"
            >
              À partir de {{ contentCard.from_price }}€
            </TP2>
          </div>
        </div>
        <AtomsCTA
          :href="contentCard.link"
          class="app-programmation-hero__main-card__cta"
        >
          {{ contentCard.full ? `Liste d'attente` : `Réserver` }}
        </AtomsCTA>
      </EKinesis>
    </div>

    <div
      ref="visualBack"
      class="app-programmation-hero__visual-back-transparent"
    >
      <EKinesis :speed="10" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SplitText } from 'gsap/SplitText'
import { gsap } from 'gsap'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapState({
      programmationsContent: (state) => state.programmationsContent,
      fontsLoaded: (state) => state.fontsLoaded,
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
    contentCard() {
      return this.programmationsContent.find((el) => el.main_event)
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
    if (this.allLoadedFake && !this.$viewport.isMobile) {
      this.initSplitText()
      this.appearHero(0.95)
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    }
  },
  beforeDestroy() {
    this.tlAppear?.clear()
    this.tlAppear?.kill()
  },
  methods: {
    appearHero(delay = 0) {
      this.tlAppear?.clear()
      this.tlAppear?.kill()

      this.tlAppear = gsap
        .timeline({
          delay,
          onComplete: () => {
            this.initScrollTrigger()
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
    initScrollTrigger() {
      this.setAllowScroll(true)

      gsap.to(this.$refs.mainCard, {
        yPercent: -10,
        rotate: 2,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
        },
      })

      gsap.to(this.$refs.visualBack, {
        yPercent: -40,
        rotate: -2,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
        },
      })
    },
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
  margin-bottom: desktop-vw(150px);

  @include mobile {
    margin-bottom: mobile-vw(150px);
  }

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
      @include font-adihausDIN-cn-bold();
    }
  }

  .child {
    display: inline-block !important;
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
    top: calc(100% + 25%);
    width: desktop-vw(90px);
    transform: scaleX(-1) rotate(20deg);
    left: 10%;
    aspect-ratio: 90 / 130;
  }

  &__arrow-right {
    position: absolute;
    top: calc(100% + 50%);
    width: desktop-vw(90px);
    transform: scaleX(1) rotate(20deg);
    left: 40%;
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
      @include font-adihausDIN-bold();
      color: var(--c-black);
    }

    @include mobile {
      width: 75%;
      margin-top: mobile-vw(40px);
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

    .app-element-kinesis {
      display: flex;
      flex-direction: column;
      background: var(--c-white);
    }

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
      left: 0;
      width: 95%;
      margin-top: mobile-vw(40px);
    }

    &__wrapper {
      padding: desktop-vw(15px) desktop-vw(15px) desktop-vw(25px)
        desktop-vw(15px);
      z-index: 1;

      @include mobile {
        padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(15px) mobile-vw(15px);
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    &__name {
      margin-top: desktop-vw(10px);
      display: flex;
      flex-direction: row;

      @include mobile {
        margin-top: mobile-vw(20px);
      }
    }

    &__full {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(16px);
      letter-spacing: -0.02em;
      @include font-adihausDIN-bold();
      color: var(--c-red-adidas);
      margin-left: desktop-vw(20px);
      align-self: flex-start;
      margin-top: desktop-vw(10px);

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(16px);
      }
    }

    &__date {
      margin-top: desktop-vw(15px);

      @include mobile {
        margin-top: mobile-vw(10px);
      }
    }

    &__from-price {
      margin-top: desktop-vw(30px);
      align-self: flex-end;

      @include mobile {
        margin-top: mobile-vw(15px);
      }
    }

    picture {
      aspect-ratio: 540/480;
      width: 100%;
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
  }
}
</style>
