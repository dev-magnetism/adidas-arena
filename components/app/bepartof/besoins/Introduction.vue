<template>
  <div class="app-be-part-of-besoins-introduction grid-inner">
    <div class="app-be-part-of-besoins-introduction__f-row__content">
      <ERichText
        ref="title"
        class="app-be-part-of-besoins-introduction__f-row__content__title"
        :content="contents.title"
        tag="h1"
      />

      <TP2
        ref="paragraph"
        weight="bold"
        class="app-be-part-of-besoins-introduction__f-row__content__subtitle"
      >
        {{ contents.subtitle }}
      </TP2>
      <ul
        ref="list"
        class="app-be-part-of-besoins-introduction__f-row__content__subtitle-list"
      >
        <li v-for="(item, index) in contents.subtitleList" :key="index">
          <TP2 weight="medium">
            {{ item.text }}
          </TP2>
        </li>
      </ul>
    </div>

    <div
      ref="bigVisual"
      class="app-be-part-of-besoins-introduction__f-row__visual"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          ref="picture"
          provider="directus"
          :src="contents.pictureFramed.src"
          format="webp"
          :alt="contents.pictureFramed.alt"
          class="picture-absolute"
          sizes="sm:35vw md:90vw"
        />
        <ELottie id="Cadre_02" />
      </EKinesis>
    </div>

    <div
      ref="pointsVisual"
      class="app-be-part-of-besoins-introduction__s-row__visual"
    >
      <EKinesis :speed="8.5">
        <AtomsCornerPoints :size-points="8" />
        <nuxt-picture
          ref="picture"
          provider="directus"
          :src="contents.picture.src"
          format="webp"
          :alt="contents.picture.alt"
          class="picture-absolute"
          sizes="sm:35vw md:65vw"
        />
      </EKinesis>
    </div>

    <div class="app-be-part-of-besoins-introduction__s-row__content">
      <TH4
        tag="h2"
        class="app-be-part-of-besoins-introduction__s-row__content__title"
      >
        {{ contents.secondTitle }}
      </TH4>
      <TP2
        weight="medium"
        class="app-be-part-of-besoins-introduction__s-row__content__text"
      >
        {{ contents.paragraph }}
      </TP2>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapState, mapMutations } from 'vuex'
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
            this.initScrollTrigger()
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
            stagger: 0.075,
            ease: 'power3.out',
          },
          'texts'
        )
        .fromTo(
          [this.$refs.list, this.$refs.paragraph.$el],
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
          [this.$refs.list, this.$refs.paragraph.$el],
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
            y: '50%',
            rotate: -10,
          },
          {
            y: '0%',
            rotate: -5,
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
    },
    initScrollTrigger() {
      this.setAllowScroll(true)

      gsap.to(this.$refs.bigVisual, {
        yPercent: -20,
        rotate: 0,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
        },
      })

      gsap.to(this.$refs.pointsVisual, {
        rotate: 2,
        yPercent: -30,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
        },
      })
    },
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-be-part-of-besoins-introduction {
  position: relative;
  margin-bottom: desktop-vw(130px);
  row-gap: desktop-vw(85px);

  @include mobile {
    overflow-x: hidden;
  }

  &__f-row {
    &__content {
      grid-column: 2 / span 5;
      grid-row: 1;

      @include mobile {
        grid-column: 1 / span 6;
      }

      &__title {
      }

      &__subtitle {
        text-transform: uppercase;
        margin-top: desktop-vw(20px);
        width: 65%;

        @include mobile {
          margin-top: mobile-vw(20px);
        }
      }
      &__subtitle-list {
        margin-top: desktop-vw(25px);
        width: 80%;

        li {
          list-style-position: outside;
          margin-left: 1em;
        }

        @include mobile {
          margin-top: mobile-vw(20px);
        }
      }
    }
    &__visual {
      position: relative;
      grid-column: 8 / span 5;
      aspect-ratio: 650 / 785;
      left: columns(-1);
      margin-top: desktop-vw(150px);
      transform: rotate(-5deg);
      grid-row: 1;

      @include mobile {
        grid-column: 2 / span 5;
        left: 0;
        top: 0;
        grid-row: 2;
        margin-top: mobile-vw(20px);
        aspect-ratio: 270/320;
        margin-bottom: mobile-vw(185px);
      }

      picture {
        z-index: 0;
        @include noise();
      }

      svg,
      canvas {
        position: absolute;
        top: 50%;
        left: 0;
        height: 115% !important;
        width: auto !important;
        left: 50%;
        transform: translate(-50%, -50%) rotate(4deg) !important;
      }
    }
  }

  &__s-row {
    &__content {
      grid-column: 9 / span 4;
      grid-row: 2;

      @include mobile {
        grid-column: 1 / span 6;
        grid-row: 3;
      }

      &__title {
        @include mobile {
          text-align: right;
        }
      }

      &__text {
        margin-left: columns(1.35);
        margin-top: desktop-vw(30px);
        width: 65%;

        @include mobile {
          margin-top: mobile-vw(30px);
          margin-left: auto;
          width: 75%;
        }
      }
    }
    &__visual {
      grid-column: 4 / span 4;
      aspect-ratio: 460/550;
      transform: rotate(5.5deg);
      left: 0;
      position: absolute;
      top: desktop-vw(-100px);
      grid-row: 2;
      width: 100%;

      @include mobile {
        grid-column: 1 / span 4;
        top: 0;
        aspect-ratio: 230/290;
        top: mobile-vw(230px);
      }

      picture {
        z-index: 0;
        @include noise();
      }
    }
  }
}
</style>
