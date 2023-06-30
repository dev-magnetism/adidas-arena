<template>
  <div class="app-actualites-hero grid-inner">
    <div class="app-actualites-hero__texts">
      <ERichText
        ref="title"
        class="app-actualites-hero__title"
        :content="content.title"
        tag="h1"
      />

      <TP2 ref="paragraph" weight="bold" class="app-actualites-hero__paragraph">
        {{ content.paragraph }}
      </TP2>
    </div>

    <div ref="visualBack" class="app-actualites-hero__visual-back">
      <EKinesis :speed="2">
        <nuxt-picture
          provider="directus"
          :src="content.frontPicture"
          format="webp"
          :alt="'fdsfsdf'"
          sizes="sm:35vw md:50vw"
        />
      </EKinesis>
    </div>

    <div ref="visualFront" class="app-actualites-hero__visual-front">
      <EKinesis :speed="6">
        <EFramedPicture color="blue-adidas">
          <EKinesis :speed="-3.5">
            <nuxt-picture
              provider="directus"
              :src="content.frontPicture"
              format="webp"
              :alt="'fdsfsdf'"
              sizes="sm:35vw md:50vw"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SplitText } from 'gsap/SplitText'
import { gsap } from 'gsap'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      programmationsContent: (state) => state.programmationsContent,
      programmationsEventContent: (state) => state.programmationsEventContent,
      fontsLoaded: (state) => state.fontsLoaded,
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
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
    console.log('hero', this.content)

    if (this.allLoadedFake && !this.$viewport.isMobile) {
      this.initSplitText()
      this.appearHero(0.95)
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    }
  },
  beforeDestroy() {
    this.mm?.kill()

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
          this.$refs.visualBack,
          {
            y: '20%',
            rotate: -10,
          },
          {
            y: '0%',
            rotate: -4,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals'
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
          'visuals+=5%'
        )
        .fromTo(
          this.$refs.visualFront,
          {
            y: '20%',
            rotate: 8,
          },
          {
            y: '0%',
            rotate: 4,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals+=30%'
        )
        .fromTo(
          this.$refs.visualFront,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          'visuals+=35%'
        )
    },
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.setAllowScroll(true)

        const tweenVisualFront = gsap.to(this.$refs.visualFront, {
          yPercent: -35,
          rotate: 1.5,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        const tweenVisualBack = gsap.to(this.$refs.visualBack, {
          yPercent: -20,
          rotate: -1,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        return () => {
          tweenVisualFront?.kill()
          tweenVisualBack?.kill()
        }
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
.app-actualites-hero {
  position: relative;
  min-height: calc(75vh - desktop-vw(200px));

  @include mobile {
    min-height: 100%;
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

  .parent {
    overflow: hidden;
  }

  &__paragraph {
    width: 75%;
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

  &__visual-back {
    grid-column: 7 / span 3;
    position: absolute;
    width: 100%;
    height: auto;
    top: -10%;
    z-index: 0;
    transform: rotate(-3deg);
    transform-origin: right center;
    aspect-ratio: 340 / 420;

    @include mobile {
      grid-column: 1 / span 4;
      left: 0;
      top: 10%;
      position: relative;
      aspect-ratio: 220 / 275;
      transform: rotate(-2deg);
    }

    .app-element-framed-picture {
      padding: desktop-vw(15px);
    }
  }

  &__visual-front {
    grid-column: 9 / span 3;
    position: absolute;
    width: 100%;
    height: auto;
    top: 35%;
    z-index: 0;
    transform: rotate(4deg);
    transform-origin: left center;
    aspect-ratio: 310 / 380;

    @include mobile {
      grid-column: 3 / span 4;
      left: 0;
      top: -35%;
      position: relative;
      aspect-ratio: 205 / 250;
      transform: rotate(3.5deg);
    }

    .app-element-framed-picture {
      padding: desktop-vw(15px);

      @include mobile {
        padding: mobile-vw(10px);
      }
    }
  }
}
</style>
