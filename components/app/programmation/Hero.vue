<template>
  <div class="app-programmation-hero grid-inner">
    <div class="app-programmation-hero__texts">
      <ERichText
        ref="title"
        class="app-programmation-hero__title"
        :content="contents.title"
      />
      <TP2
        ref="paragraph"
        weight="bold"
        class="app-programmation-hero__paragraph"
      >
        {{ contents.paragraph }}
      </TP2>
    </div>

    <div ref="mainCard" class="app-programmation-hero__main-card">
      <AtomsCornerPoints :size-points="8" />

      <div class="app-programmation-hero__main-card__wrapper">
        <div ref="layer" class="layer" />
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
        Liste d'attente
      </AtomsCTA>
    </div>
    <div
      ref="visualBack"
      class="app-programmation-hero__visual-back-transparent"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      if (!newVal || this.$viewport.isMobile) return

      this.appearHero(0.25)
    },
    fontsLoaded(newVal) {
      if (!newVal || this.$viewport.isMobile) return

      this.initSplitText()
    },
  },
  mounted() {
    if (this.allLoadedFake && !this.$viewport.isMobile) {
      this.initSplitText()
      this.appearHero(0.85)
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
            // this.initScrollTrigger()
          },
        })
        .fromTo(
          this.splittingChild.lines,
          {
            y: '-100%',
          },
          {
            y: '0',
            duration: 0.5,
            stagger: 0.045,
            ease: 'power1.inOut',
          }
        )
        .fromTo(
          this.$refs.layer,
          {
            scaleY: 1,
          },
          {
            scaleY: 0,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          '<0%'
        )
        .fromTo(
          this.$refs.paragraph.$el,
          {
            y: '-200%',
          },
          {
            y: '0',
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<15%'
        )
        .fromTo(
          this.$refs.paragraph.$el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.35,
            ease: 'power1.inOut',
          },
          '<25%'
        )
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

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__title {
    width: 100%;
  }

  .child {
    display: inline-block !important;
  }

  .parent {
    overflow: hidden;
  }

  &__paragraph {
    width: 85%;
    text-transform: uppercase;
    margin-top: desktop-vw(25px);

    @include mobile {
      width: 75%;
      margin-top: mobile-vw(40px);
    }
  }

  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--c-white);
    z-index: 9999;
    transform: scaleY(1);
    transform-origin: center bottom;

    @include mobile {
      display: none;
    }
  }

  &__main-card {
    position: relative;
    grid-column: 8 / span 5;
    width: 100%;
    background: var(--c-white);
    left: -5%;
    transform: rotate(3deg);
    z-index: 1;
    display: flex;
    flex-direction: column;

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
        padding: mobile-vw(10px) mobile-vw(5px) mobile-vw(10px) mobile-vw(25px);
      }
    }
  }
  &__visual-back-transparent {
    @include fake-transparent();
    grid-column: 7 / span 2;
    position: absolute;
    aspect-ratio: 185 / 230;
    width: 100%;
    bottom: 5%;
    z-index: 0;
    transform: rotate(-5deg);

    @include mobile {
      grid-column: 1 / span 3;
      left: -35%;
      bottom: -10%;
    }
  }
}
</style>
