<template>
  <div class="app-home-projet grid-inner">
    <div class="app-home-projet__rotated">
      <div class="app-home-projet__wrapper">
        <AtomsCornerPoints
          ref="points"
          :border-color="!$viewport.isMobile ? 'beige' : 'black'"
          :points-color="!$viewport.isMobile ? 'beige' : 'black'"
        />
        <div ref="inner" class="app-home-projet__inner">
          <div class="app-home-projet__main">
            <AppHomeProjetHeader
              :content-left="contents.headerContentLeft"
              :content-right="contents.headerContentRight"
            />
            <AppHomeProjetBigVisual />
            <AppHomeProjetPlan ref="plan" />

            <EFramedPicture
              v-if="!$viewport.isMobile"
              :fake-transparent="true"
              color="white"
              class="app-home-projet__framed-picture projet-visual"
            >
              <nuxt-picture
                class="projet-visual"
                format="webp"
                alt="alt"
                :src="contents.projetPicture2"
                provider="directus"
              />
            </EFramedPicture>

            <nuxt-picture
              v-if="!$viewport.isMobile"
              class="app-home-projet__visual__top-upper projet-visual"
              :src="contents.projetPicture1"
              provider="directus"
              format="webp"
              alt="alt"
            />

            <TH2 ref="title" weight="bold" class="app-home-projet__title">{{
              contents.bigTitle
            }}</TH2>
          </div>
          <div
            v-if="!$viewport.isMobile"
            ref="fakeVisual"
            class="app-home-projet__fake-visual"
          ></div>
          <div ref="lottieCircle" class="app-home-projet__circle" />
          <div ref="lottieCrossCircle" class="app-home-projet__cross-circle" />
          <div ref="lottieValidCircle" class="app-home-projet__valid-circle" />
          <div ref="lottieCross" class="app-home-projet__cross" />
          <div ref="lottieArrowBlue" class="app-home-projet__arrow-blue" />
          <div ref="lottieArrow" class="app-home-projet__arrow" />
          <div ref="lottieLittleArrow" class="app-home-projet__little-arrow" />

          <AtomsCTA class="app-home-projet__cta" color="beige" bg="blue-adidas">
            {{ contents.projetCtaTitle }}
          </AtomsCTA>

          <AtomsTitleTag
            class="app-home-projet__tag-top app-projet-tag-5"
            bg="white"
            color="black"
          >
            {{ contents.projetTag1 }}
          </AtomsTitleTag>

          <AtomsTitleTag
            v-if="!$viewport.isMobile"
            class="app-home-projet__tag-top-upper app-projet-tag-4"
            bg="white"
            color="black"
          >
            {{ contents.projetTag2 }}
          </AtomsTitleTag>
          <AtomsTitleTag
            class="app-home-projet__tag-top-left app-projet-tag-3"
            bg="white"
            color="black"
          >
            {{ contents.projetTag3 }}
          </AtomsTitleTag>
          <AtomsTitleTag
            class="app-home-projet__tag-middle app-projet-tag-2"
            bg="white"
            color="black"
          >
            {{ contents.projetTag4 }}
          </AtomsTitleTag>
          <AtomsTitleTag
            v-if="!$viewport.isMobile"
            bg="white"
            color="black"
            class="app-home-projet__tag-bottom app-projet-tag-1"
          >
            {{ contents.projetTag5 }}
          </AtomsTitleTag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import lottie from 'lottie-web'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      playhead: {
        circle: 0,
        validCircle: 0,
        crossCircle: 0,
        cross: 0,
        arrowBlue: 0,
        arrow: 0,
        littleArrow: 0,
      },
    }
  },

  mounted() {
    document.fonts.ready.then(() => {
      this.initSplitText()
    })
  },
  beforeDestroy() {
    this.tl?.kill()
  },
  methods: {
    initSplitText() {
      this.split = new SplitText(this.$refs.title.$el, {
        type: 'chars',
        charsClass: 'char',
      })

      this.tl = gsap.timeline({
        defaults: { duration: 1, ease: 'expo.out' },
        scrollTrigger: {
          trigger: this.$el,
          start: 'top center',
          toggleActions: 'play none none none',
        },
      })

      this.initLottieAnimations()

      this.initTimeline()
    },
    initTimeline() {
      // DESKTOP
      if (!this.$viewport.isMobile) {
        this.tl.fromTo(
          [this.$refs.inner, this.$refs.fakeVisual],
          {
            scale: 0,
          },
          {
            transformOrigin: 'left bottom',
            scale: 1,
            stagger: 0.05,
          }
        )
        this.tl.fromTo(
          this.$refs.points.$el,
          {
            scale: 0,
          },
          {
            transformOrigin: 'left bottom',
            scale: 1,
          },
          '<0%'
        )

        this.tl.fromTo(
          '.projet-visual',
          {
            scale: 0,
          },
          {
            transformOrigin: 'left bottom',
            scale: 1,
            stagger: 0.2,
          },
          '>-80%'
        )

        this.tl.addLabel('projet-2-3', '<25%')
        this.tl.addLabel('lotties', 'projet-2-3+=.5')
        this.tl.fromTo(
          this.$refs.plan.$el,
          {
            scale: 0,
          },
          {
            scale: 1,
          },
          'projet-2-3'
        )
        this.tl.fromTo(
          '.app-projet-tag-1',
          {
            opacity: 0,
            yPercent: 25,
            rotate: -6,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotate: -12,
          },
          'projet-2-3'
        )
        this.tl.to(
          this.playhead,
          {
            circle: this.animationCircle.totalFrames - 1,
            duration: 2,
            onUpdate: () =>
              this.animationCircle.goToAndStop(this.playhead.circle, true),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            validCircle: this.animationValidCircle.totalFrames - 1,
            duration: 2,
            delay: 0.15,
            onUpdate: () =>
              this.animationValidCircle.goToAndStop(
                this.playhead.validCircle,
                true
              ),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            littleArrow: this.animationLittleArrow.totalFrames - 1,
            duration: 2,
            delay: 0.3,
            onUpdate: () =>
              this.animationLittleArrow.goToAndStop(
                this.playhead.littleArrow,
                true
              ),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            duration: 2,
            delay: 0.45,
            cross: this.animationCross.totalFrames - 1,
            onUpdate: () =>
              this.animationCross.goToAndStop(this.playhead.cross, true),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            duration: 2,
            delay: 0.6,
            crossCircle: this.animationCrossCircle.totalFrames - 1,
            onUpdate: () =>
              this.animationCrossCircle.goToAndStop(
                this.playhead.crossCircle,
                true
              ),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            duration: 2,
            delay: 0.75,
            arrowBlue: this.animationArrowBlue.totalFrames - 1,
            onUpdate: () =>
              this.animationArrowBlue.goToAndStop(
                this.playhead.arrowBlue,
                true
              ),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            duration: 2,
            delay: 1,
            arrow: this.animationArrow.totalFrames - 1,
            onUpdate: () =>
              this.animationArrow.goToAndStop(this.playhead.arrow, true),
          },
          'lotties'
        )
        this.tl.fromTo(
          '.app-home-projet__plan__body__visual-wrapper',
          {
            scale: 1.65,
          },
          {
            scale: 1,
          },
          'projet-2-3-=10%'
        )
        this.tl.fromTo(
          '.app-home-projet__plan__header-fake',
          {
            scaleY: 0,
          },
          {
            scaleY: 1,
          },
          'projet-2-3+=40%'
        )
        this.tl.fromTo(
          '.app-home-projet__plan__border',
          {
            scaleY: 0,
          },
          {
            scaleY: 1,
          },
          'projet-2-3+=40%'
        )
        this.tl.fromTo(
          '.app-home-projet__plan__header',
          {
            height: 0,
          },
          {
            height: '100%',
          },
          'projet-2-3+=30%'
        )

        this.tl.fromTo(
          '.app-projet-tag-2',
          {
            opacity: 0,
            yPercent: 150,
            rotate: -6,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 1.45,
            transformOrigin: 'center',
          },
          'projet-2-3'
        )

        this.tl.fromTo(
          '.app-projet-tag-3',
          {
            opacity: 0,
            yPercent: 100,
            rotate: 4,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotate: -2.5,
          },
          'projet-2-3'
        )

        this.tl.fromTo(
          '.app-projet-tag-4',
          {
            opacity: 0,
            yPercent: 35,
            rotate: 4,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotate: -2,
          },
          '>-75%'
        )
        this.tl.addLabel('charsHeader', '<10%')

        this.tl.fromTo(
          this.split.chars,
          {
            xPercent: -105,
          },
          {
            xPercent: 0,
            stagger: 0.09,
          },
          'charsHeader'
        )
        this.tl.to(
          ['.header-line-1', '.header-line-2'],

          {
            scaleX: 1,
            stagger: 0.05,
          },
          'charsHeader'
        )
        this.tl.to(
          ['.header-line-3', '.header-line-4'],

          {
            scaleY: 1,
            stagger: 0.2,
          },
          'charsHeader+=55%'
        )
        this.tl.fromTo(
          [
            '.info-text-1',
            '.info-text-2',
            '.info-text-3',
            '.info-text-4',
            '.info-text-5',
            '.info-text-6',
          ],
          {
            y: 10,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,

            stagger: 0.085,
          },
          'charsHeader+=20%'
        )
        this.tl.fromTo(
          '.app-projet-tag-5',
          {
            opacity: 0,
            yPercent: 50,
            rotate: -6,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
          },
          '<+=0%'
        )
        this.tl.fromTo(
          '.app-home-projet__cta',
          {
            opacity: 0,
            yPercent: 50,
          },
          {
            opacity: 1,
            yPercent: 0,
          },
          'charsHeader+=100%'
        )
      }

      // MOBILE
      if (this.$viewport.isMobile) {
        this.tl.addLabel('lotties')
        this.tl.to(
          this.playhead,
          {
            circle: this.animationCircle.totalFrames - 1,
            duration: 0.85,
            onUpdate: () =>
              this.animationCircle.goToAndStop(this.playhead.circle, true),
          },
          'lotties'
        )
        this.tl.to(
          this.playhead,
          {
            validCircle: this.animationValidCircle.totalFrames - 1,
            duration: 0.85,
            delay: 0.15,
            onUpdate: () =>
              this.animationValidCircle.goToAndStop(
                this.playhead.validCircle,
                true
              ),
          },
          'lotties'
        )

        this.tl.to(
          this.playhead,
          {
            duration: 0.85,
            delay: 0.45,
            cross: this.animationCross.totalFrames - 1,
            onUpdate: () =>
              this.animationCross.goToAndStop(this.playhead.cross, true),
          },
          'lotties'
        )

        this.tl.to(
          this.playhead,
          {
            duration: 0.85,
            delay: 0.5,
            arrow: this.animationArrow.totalFrames - 1,
            onUpdate: () =>
              this.animationArrow.goToAndStop(this.playhead.arrow, true),
          },
          'lotties'
        )
      }
    },
    initLottieAnimations() {
      if (!this.$viewport.isMobile) {
        this.animationCrossCircle = lottie.loadAnimation({
          container: this.$refs.lottieCrossCircle,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: require(`@/assets/lotties/Croix_circle.json`),
        })
        this.animationArrowBlue = lottie.loadAnimation({
          container: this.$refs.lottieArrowBlue,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: require(`@/assets/lotties/Fleche_2.json`),
        })
        this.animationLittleArrow = lottie.loadAnimation({
          container: this.$refs.lottieLittleArrow,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: require(`@/assets/lotties/Petite_Fleche_01.json`),
        })
      }

      this.animationCross = lottie.loadAnimation({
        container: this.$refs.lottieCross,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Croix_01.json`),
      })

      this.animationCircle = lottie.loadAnimation({
        container: this.$refs.lottieCircle,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Cercle_5.json`),
      })
      this.animationValidCircle = lottie.loadAnimation({
        container: this.$refs.lottieValidCircle,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Valid_circle.json`),
      })

      this.animationArrow = lottie.loadAnimation({
        container: this.$refs.lottieArrow,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Fleche_2.json`),
      })
    },
  },
}
</script>

<style lang="scss">
.app-home-projet {
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(50% 50% at 50% 50%, #3a4f68 0%, #15191e 100%);
  margin-top: desktop-vw(200px);
  margin-bottom: desktop-vw(70px);
  padding-top: desktop-vw(135px);
  padding-bottom: desktop-vw(135px);

  picture {
    img {
      display: block;
    }
  }

  @include mobile {
    background: none;
    padding-top: mobile-vw(0px);
    padding-bottom: mobile-vw(0px);
    margin-top: mobile-vw(75px);
    margin-bottom: mobile-vw(100px);
  }

  &__wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }

  &__inner {
    width: 100%;
    height: 100%;
    display: block;
    transform: scale(0);
    transform-origin: left bottom;
    overflow: hidden;

    @include mobile {
      transform: scale(1);
    }

    position: relative;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(
          rgba(251, 245, 238, 0.5) 0.1em,
          transparent 0.1em
        ),
        linear-gradient(
          90deg,
          rgba(251, 245, 238, 0.5) 0.1em,
          transparent 0.1em
        ),
        var(--c-white);
      background-size: 1em 1em;
      width: 100%;
      height: 100%;
      z-index: -3;
    }
  }

  &__circle {
    position: absolute;
    left: columns(5.5);
    top: desktop-vw(420px);
    width: desktop-vw(200px);
    transform: rotate(6deg);
    aspect-ratio: 195 / 125;

    @include mobile {
      width: 60%;
      left: 13%;
      top: 52.5%;
      z-index: 2;
    }

    svg {
      path {
        stroke: var(--c-red-adidas);
      }
    }
  }
  &__valid-circle {
    position: absolute;
    left: columns(6.75);
    top: desktop-vw(30px);
    width: desktop-vw(65px);
    aspect-ratio: 55 / 45;

    @include mobile {
      right: 12%;
      width: 17.5%;
      left: initial;
      top: 15%;
      z-index: 2;
    }
  }
  &__cross {
    position: absolute;
    left: columns(4.75);
    top: desktop-vw(245px);
    width: desktop-vw(55px);
    aspect-ratio: 45 / 45;
    transform: scaleY(-1);

    @include mobile {
      top: 37%;
      width: 18%;
      left: auto;
      left: initial;
      right: 15%;
      z-index: 1;
    }
  }
  &__cross-circle {
    position: absolute;
    left: columns(2);
    bottom: desktop-vw(95px);
    width: desktop-vw(60px);
    aspect-ratio: 40 / 40;

    @include mobile {
      display: none;
    }
  }
  &__little-arrow {
    position: absolute;
    right: columns(4);
    top: desktop-vw(170px);
    width: desktop-vw(65px);
    aspect-ratio: 40 / 20;
    transform: scaleY(-1) rotate(225deg);

    @include mobile {
      display: none;
    }

    svg {
      height: auto !important;
    }
  }
  &__arrow-blue {
    position: absolute;
    right: columns(1.5);
    top: desktop-vw(235px);
    width: desktop-vw(35px);
    aspect-ratio: 30 / 130;
    transform: scaleY(-1) rotate(-35deg);

    @include mobile {
      display: none;
    }

    svg {
      width: auto !important;
    }
  }
  &__arrow {
    position: absolute;
    left: columns(4.5);
    bottom: desktop-vw(110px);
    width: desktop-vw(20px);
    aspect-ratio: 15 / 75;
    transform: scaleY(-1) rotate(130deg);

    @include mobile {
      width: 6.5%;
      top: 38.5%;
      left: 12%;
      transform: scaleY(-1) rotate(235deg);
      bottom: initial;
      z-index: 2;
    }

    svg {
      path {
        stroke: var(--c-red-adidas);
      }
      width: auto !important;
    }
  }

  &__rotated {
    height: 100%;
    width: 105%;
    grid-column: 2 / span 10;
    aspect-ratio: 1165/760;
    position: relative;
    transform: translateX(-2.5%) rotate(-2deg);

    @include mobile {
      width: 100%;
      grid-column: 1 / span 6;
      aspect-ratio: 345/760;
      position: relative;
      transform: none;
    }
  }

  &__main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: desktop-vw(35px) desktop-vw(25px);
    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
    overflow: hidden;

    @include mobile {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      padding: mobile-vw(25px) mobile-vw(20px);
      grid-gap: 0px;
    }
  }

  &__fake-visual {
    @include fake-transparent();
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    aspect-ratio: 130 / 30;
    position: absolute;
    bottom: 0;
    left: 0;
    width: desktop-vw(110px);
    height: desktop-vw(110px);

    @include mobile {
      display: none;
    }
  }

  &__tag-top-left.app-atoms-title-tag {
    left: columns(0.5);
    bottom: 25%;
    transform: rotate(-6deg);
    position: absolute;

    @include mobile {
      bottom: 20%;
      z-index: 2;
    }

    > .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(18px);
      line-height: desktop-vw(20px);

      @include mobile {
        font-size: mobile-vw(18px);
        line-height: mobile-vw(20px);
      }
    }
  }

  &__tag-bottom.app-atoms-title-tag {
    left: columns(2.35);
    bottom: 10%;
    transform: rotate(-6deg);
    width: columns(2.15);
    position: absolute;

    @include mobile {
      display: none;
    }

    > .P2 {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(16px);
    }
  }

  &__tag-top-upper.app-atoms-title-tag {
    left: columns(2.15);
    top: 28%;
    transform: rotate(6deg);
    position: absolute;

    @include mobile {
      display: none;
    }

    & > .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(18px);
      line-height: desktop-vw(20px);
    }
  }

  &__tag-middle.app-atoms-title-tag {
    bottom: 18%;
    left: columns(0.75);
    transform: rotate(-3.45deg);
    position: absolute;

    @include mobile {
      bottom: 15%;
      z-index: 3;
    }

    > .P2 {
      font-size: desktop-vw(15px);
      line-height: desktop-vw(20px);
      text-transform: uppercase;

      @include mobile {
        font-size: mobile-vw(15px);
        line-height: mobile-vw(20px);
      }
    }
  }

  &__cta.app-atoms-cta {
    position: absolute;
    width: columns(2.25);
    // width: desktop-vw(195px);
    bottom: 6.5%;
    left: columns(4);
    padding: desktop-vw(20px) desktop-vw(0px) desktop-vw(20px) desktop-vw(20px);
    position: absolute;
    transform: rotate(-4deg);
    z-index: 1;

    @include mobile {
      padding: mobile-vw(15px) mobile-vw(0px) mobile-vw(15px) mobile-vw(20px);
      left: 10%;
      width: 60%;
      bottom: 2.5%;
      z-index: 4;
    }

    > .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(24px);
      line-height: desktop-vw(23px);

      @include mobile {
        font-size: mobile-vw(24px);
        line-height: mobile-vw(32px);
      }
    }
  }

  &__visual__top-upper {
    position: absolute;
    grid-column: 5 / span 2;
    aspect-ratio: 200/95;
    transform: rotate(-5deg);
    top: 4%;
    left: 20%;
    width: 100%;
    @include noise();

    @include mobile {
      display: none;
    }
  }

  &__tag-top.app-atoms-title-tag {
    position: absolute;
    left: columns(5.5);
    top: 13%;
    padding: desktop-vw(10px);

    @include mobile {
      padding: mobile-vw(10px);
      transform: rotate(1.5deg);
      top: 20%;
      left: 10%;
      width: 100%;
    }

    > .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(18px);
      line-height: desktop-vw(20px);

      @include mobile {
        font-size: mobile-vw(18px);
        line-height: mobile-vw(20px);
      }
    }
  }

  &__framed-picture {
    background-color: var(--c-white);
    grid-column: 8 / span 3;
    aspect-ratio: 250/315;
    width: 82%;
    left: 18%;
    z-index: -2;
    padding: desktop-vw(35px) desktop-vw(35px);
    transform: rotate(-2deg);

    picture {
      @include noise();
    }

    @include mobile {
      display: none;
    }

    > :first-child {
      transform: rotate(-2deg);
    }
  }

  &__find-out-more {
    width: desktop-vw(200px);
  }

  &__title.H2 {
    writing-mode: vertical-rl;
    transform: scale(-1);
    display: inline-block;
    position: absolute;
    bottom: desktop-vw(30px);
    right: desktop-vw(5px);
    font-size: desktop-vw(180px);
    line-height: desktop-vw(180px);

    @include mobile {
      font-size: mobile-vw(130px);
      line-height: mobile-vw(130px);
      transform: scale(-1) rotate(355deg);
      right: mobile-vw(15px);
      bottom: mobile-vw(20px);
      z-index: 3;
    }
  }
}
</style>
