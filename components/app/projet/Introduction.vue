<template>
  <div class="app-projet-introduction grid-inner">
    <div class="app-projet-introduction__row-framed-content">
      <ERichText tag="h1" ref="title" :content="contents.title" />
      <ERichText ref="paragraph" :content="contents.subtitle" />
    </div>

    <div ref="visualFramed" class="app-projet-introduction__row-framed-visual">
      <EKinesis :speed="5">
        <EFramedPicture color="red-adidas">
          <EKinesis :speed="-3.5">
            <nuxt-picture
              provider="directus"
              :src="contents.pictureFramedImage"
              format="webp"
              :alt="contents.pictureFramedAlt"
              sizes="sm:35vw md:50vw"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </div>

    <div
      ref="visualBigger"
      class="app-projet-introduction__row-second-visual-principal"
    >
      <EKinesis :speed="5">
        <TH3 tag="p"> {{ contents.pictureLabelText }} </TH3>
        <nuxt-picture
          provider="directus"
          :src="contents.pictureLabelImage"
          :alt="contents.pictureLabelAlt"
          format="webp"
          sizes="sm:35vw md:50vw"
        />
      </EKinesis>
    </div>

    <EParallax
      ref="visualTransparent"
      :speed="0.6"
      class="app-projet-introduction__row-second-visual-transparent"
    >
      <EKinesis :speed="10">
        <nuxt-picture
          :src="contents.pictureLogoImage"
          provider="directus"
          format="webp"
          :alt="contents.pictureLogoAlt"
        />
        <AtomsCornerPoints :size-points="6" />
      </EKinesis>
    </EParallax>

    <div class="app-projet-introduction__row-second-content">
      <TH4 tag="p">{{ contents.whyTitle }}</TH4>

      <ERichText :content="contents.whyParagraph" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapMutations, mapState } from 'vuex'
import { SplitText } from 'gsap/SplitText'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      allLoadedActual: (state) => state.allLoadedActual,
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      fontsLoaded: (state) => state.fontsLoaded,
    }),
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      if (this.$viewport.isMobile) {
        this.setAllowScroll(true)
      } else {
        this.appearHero(0.15)
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
      this.appearHero(0.85)
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    }
  },
  beforeDestroy() {
    this.mm?.kill()
    this.tlAppear?.kill()
  },
  methods: {
    initSplitText() {
      const title = this.$refs.title.$el.querySelectorAll('.H2')

      this.splittingChild = new SplitText(title, {
        type: 'lines',
        linesClass: 'line-child',
      })

      this.splittingParent = new SplitText(title, {
        type: 'lines',
        linesClass: 'line-parent',
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
            y: '-120%',
          },
          {
            y: '0',
            duration: 0.6,
            stagger: 0.085,
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
          this.$refs.visualFramed,
          {
            y: '40%',
            rotate: 10,
          },
          {
            y: '0%',
            rotate: 4,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals'
        )
        .fromTo(
          this.$refs.visualFramed,
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
          this.$refs.visualBigger,
          {
            y: '30%',
            rotate: -10,
          },
          {
            y: '0%',
            rotate: -2,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals+=50%'
        )
        .fromTo(
          this.$refs.visualBigger,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          'visuals+=50%'
        )
    },
    initMatchMedia() {
      this.setAllowScroll(true)

      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const tweenFramed = gsap.to(this.$refs.visualFramed, {
          yPercent: -10,
          rotate: 2,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        const tweenBigger = gsap.to(this.$refs.visualBigger, {
          yPercent: -20,
          rotate: 2,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        const tweenTransparent = gsap.fromTo(
          this.$refs.visualTransparent.$el,
          {
            rotate: -9,
          },
          {
            rotate: -4,
            scrollTrigger: {
              trigger: this.$refs.visualTransparent.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        return () => {
          tweenFramed?.kill()
          tweenBigger?.kill()
          tweenTransparent?.kill()
        }
      })
    },

    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-projet-introduction {
  position: relative;

  &__row-framed-content {
    grid-column: 2 / span 6;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    width: 90%;

    @include mobile {
      grid-column: 1 / span 6;
      width: 100%;
    }

    .P2.wysiwyg-text {
      width: 80%;
      text-transform: uppercase;
      @include font-adihausDIN-bold();
      // font-weight: 700;

      @include mobile {
        width: 65%;
      }

      &:first-child {
        margin-top: desktop-vw(30px);

        @include mobile {
          margin-top: mobile-vw(20px);
        }
      }
    }
  }

  &__row-framed-visual {
    grid-column: 7 / span 5;
    grid-row: 1;
    aspect-ratio: 545 / 670;
    margin-top: desktop-vw(50px);
    width: 95%;
    margin-left: desktop-vw(50px);
    z-index: 2;
    transform: rotate(4deg);
    // transform-origin: left top;

    @include mobile {
      grid-row: 2;
      grid-column: 2 / span 5;
      margin-left: 0px;
      margin-top: mobile-vw(65px);
      aspect-ratio: 260 / 315;
    }

    picture {
      position: relative;
      @include noise();
    }

    .app-element-framed-picture {
      height: 100%;
    }
  }

  &__row-second-visual-transparent {
    position: absolute;
    grid-row: 2;
    width: 100%;
    grid-column: 6 / span 2;
    top: 20%;
    transform: rotate(-9deg);
    aspect-ratio: 200 / 130;
    left: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    transform-origin: center center;

    @include mobile {
      grid-row: 3;
      grid-column: 4 / span 2;
      left: 0%;
      aspect-ratio: 200/130;
    }

    .app-element-kinesis {
      display: flex;
      justify-content: center;
      align-items: center;

      @include fake-transparent();
    }

    picture {
      display: block;
      width: 55%;
      height: auto;
    }
  }

  &__row-second-content {
    grid-column: 9 / span 3;
    margin-top: desktop-vw(100px);
    grid-row: 2;

    @include mobile {
      grid-column: 2 / span 5;
      margin-top: mobile-vw(-25px);
      grid-row: 4;
    }

    .app-element-rich-text {
      .P2.wysiwyg-text {
        @include font-adihausDIN-medium();

        &:first-child {
          margin-top: desktop-vw(30px);
        }
      }
    }
  }

  &__row-second-visual-principal {
    grid-column: 2 / span 6;
    position: relative;
    transform: translateY(-30%) rotate(-2deg);
    width: 95%;
    margin-left: desktop-vw(25px);
    grid-row: 2;
    margin-top: desktop-vw(-150px);
    // transform-origin: right top;

    @include mobile {
      grid-row: 3;
      width: 100%;
      grid-column: 1 / span 4;
      transform: translateY(-20%) rotate(-2deg);
      margin-top: mobile-vw(0px);
      margin-left: mobile-vw(0px);
    }

    .app-element-kinesis {
      display: flex;
    }

    .H3 {
      font-size: desktop-vw(22px);
      line-height: desktop-vw(28px);
      letter-spacing: -0.04em;
      align-self: flex-end;
      writing-mode: vertical-rl;
      transform: scale(-1);

      margin-right: desktop-vw(20px);

      @include mobile {
        display: none;
      }
    }

    picture {
      aspect-ratio: 595 / 740;
      width: 100%;
      display: block;
      position: relative;
      @include noise();

      @include mobile {
        aspect-ratio: 220 / 275;
      }
    }
  }
}
</style>
