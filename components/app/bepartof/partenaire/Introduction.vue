<template>
  <div class="app-be-part-of-partenaire-introduction grid-inner">
    <div class="app-be-part-of-partenaire-introduction__f-row__content">
      <ERichText
        ref="title"
        class="app-be-part-of-partenaire-introduction__f-row__content__title"
        :content="contents.title"
        tag="h1"
      />
      <TP2
        ref="paragraph"
        class="app-be-part-of-partenaire-introduction__f-row__content__text"
        weight="bold"
      >
        {{ contents.subtitle }}
      </TP2>
    </div>

    <div
      ref="bigVisual"
      class="app-be-part-of-partenaire-introduction__f-row__visual"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          class=""
          provider="directus"
          :src="contents.picture.src"
          format="webp"
          :alt="contents.picture.alt"
          sizes="sm:35vw md:75vw"
        />
      </EKinesis>
    </div>

    <div
      ref="framedVisual"
      class="app-be-part-of-partenaire-introduction__s-row__visual"
    >
      <EKinesis :speed="10">
        <EFramedPicture class="" color="red-adidas">
          <EKinesis :speed="-2">
            <nuxt-picture
              provider="directus"
              :src="contents.pictureFramed.src"
              format="webp"
              :alt="contents.pictureFramed.alt"
              sizes="sm:35vw md:75vw"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </div>

    <div class="app-be-part-of-partenaire-introduction__s-row__content">
      <TH4
        class="app-be-part-of-partenaire-introduction__s-row__content__title"
      >
        {{ contents.secondTitle }}
      </TH4>

      <ERichText
        class="app-be-part-of-partenaire-introduction__s-row__content__text"
        :content="contents.secondSubtitle"
      />
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
      this.appearHero(0.85)
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    }
  },
  beforeDestroy() {
    this.tlAppear?.kill()
    this.mm?.kill()
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
          this.$refs.bigVisual,
          {
            y: '40%',
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
          this.$refs.bigVisual,
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
          this.$refs.framedVisual,
          {
            y: '30%',
            rotate: -8,
          },
          {
            y: '0%',
            rotate: -4,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals+=50%'
        )
        .fromTo(
          this.$refs.framedVisual,
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
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.setAllowScroll(true)

        const tweenBigVisual = gsap.to(this.$refs.bigVisual, {
          yPercent: -20,
          rotate: 0,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        const tweenFramedVisual = gsap.to(this.$refs.framedVisual, {
          yPercent: -25,
          rotate: 0,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        return () => {
          tweenBigVisual?.kill()
          tweenFramedVisual?.kill()
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
.app-be-part-of-partenaire-introduction {
  position: relative;
  margin-bottom: desktop-vw(-120px);

  @include mobile {
    margin-bottom: mobile-vw(100px);
  }

  picture {
    @include noise();
  }

  &__f-row {
    &__content {
      grid-column: 2 / span 6;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      width: 100%;

      @include mobile {
        grid-row: 1;
        grid-column: 1 / span 6;
        width: 100%;
      }

      &__title {
        text-transform: uppercase;
        margin-bottom: desktop-vw(20px);

        @include mobile {
          margin-bottom: mobile-vw(25px);
        }
      }
      &__text.P2 {
        text-transform: uppercase;
        width: 62%;
      }
    }
    &__visual {
      grid-column: 7 / span 6;
      grid-row: 1;
      transform: rotate(3deg);
      aspect-ratio: 650/785;
      width: 100%;
      left: columns(0);
      position: relative;
      margin-top: desktop-vw(80px);

      @include mobile {
        position: absolute;
        grid-column: 1 / span 4;
        top: mobile-vw(260px);
        grid-row: 2;
        aspect-ratio: 195/235;
        transform: rotate(-4deg);
        left: 0;
        margin-top: 0px;
      }
    }
  }

  &__s-row {
    &__content {
      grid-column: 8 / span 4;
      grid-row: 2;
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: desktop-vw(80px);

      @include mobile {
        grid-row: 3;
        grid-column: 1 / span 6;
      }

      &__title.H4 {
        margin-bottom: desktop-vw(30px);

        @include mobile {
          margin-bottom: mobile-vw(30px);
          width: 80%;
          margin-left: auto;
          text-align: right;
        }
      }
      &__text.app-element-rich-text {
        width: 80%;
        margin-left: auto;

        .P2.wysiwyg-text {
          @include font-adihausDIN-medium();
        }
      }
    }

    &__visual {
      grid-column: 2 / span 5;
      grid-row: 2;
      aspect-ratio: 545/670;
      width: 100%;
      position: relative;
      top: -60%;
      transform: rotate(-4deg);
      width: 105%;

      @include mobile {
        top: 0;
        grid-column: 3 / span 4;
        transform: rotate(6deg);
        width: 100%;
        right: var(--layout-margin);
        aspect-ratio: 230/280;
        margin-top: mobile-vw(80px);
        margin-bottom: mobile-vw(185px);
      }
    }
  }
}
</style>
