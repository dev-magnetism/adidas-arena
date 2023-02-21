<template>
  <div class="app-projet-plan">
    <div class="app-projet-plan__inner grid-inner">
      <div class="app-projet-plan__content">
        <ERichText
          class="app-projet-plan__content__title"
          :content="contents.title"
        />

        <TP1 weight="bold" class="app-projet-plan__content__subtitle"
          >{{ contents.subtitle }}
        </TP1>
        <ERichText
          class="app-projet-plan__content__paragraph"
          :content="contents.paragraph"
        />
      </div>
      <div class="app-projet-plan__visual">
        <AtomsCornerPoints :size-points="8" />
        <AtomsTitleTag
          ref="mainPlace"
          class="app-projet-plan__visual__main-place"
          bg="blue-adidas"
          color="white"
          >{{ contents.chapelle }}</AtomsTitleTag
        >
        <AtomsTitleTag
          ref="secondPlace"
          class="app-projet-plan__visual__second-place"
          bg="blue-adidas"
          color="white"
          >{{ contents.basilique }}</AtomsTitleTag
        >
        <SvgPlan ref="svg" class="app-projet-plan__svg" />
        <SvgPlanMobile ref="svgMobile" class="app-projet-plan__svg-mobile" />
        <div ref="circle" class="app-projet-plan__visual__circle-01" />
        <div
          ref="littleArrow2"
          class="app-projet-plan__visual__little-arrow-2"
        />
        <div
          ref="littleArrow3"
          class="app-projet-plan__visual__little-arrow-3"
        />
        <div
          ref="littleArrow1"
          class="app-projet-plan__visual__little-arrow-1"
        />
        <div ref="cross" class="app-projet-plan__visual__cross" />
        <div ref="crossCircle" class="app-projet-plan__visual__cross-circle" />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
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
        cross: 0,
        crossCircle: 0,
        littleArrow1: 0,
        littleArrow2: 0,
        littleArrow3: 0,
      },
    }
  },
  mounted() {
    if (this.$viewport.isMobile) {
      this.initLottieAnimationsMobile()
    } else {
      this.initLottieAnimationsDesktop()
      this.initTimelineDesktop()
    }
  },
  beforeDestroy() {
    this.tl?.kill()
  },
  methods: {
    initTimelineDesktop() {
      const outside = this.$refs.svg.$el.getElementById('outside').children
        .length
        ? this.$refs.svg.$el
            .getElementById('outside')
            .querySelectorAll('path, rect, circle, ellipse, polyline')
        : this.$refs.svg.$el.getElementById('outside')

      const border = this.$refs.svg.$el.getElementById('border').children.length
        ? this.$refs.svg.$el
            .getElementById('border')
            .querySelectorAll('path, rect, circle, ellipse, polyline')
        : this.$refs.svg.$el.getElementById('border')

      const inside = this.$refs.svg.$el.getElementById('inside').children.length
        ? this.$refs.svg.$el
            .getElementById('inside')
            .querySelectorAll('path, rect, circle, ellipse, polyline')
        : this.$refs.svg.$el.getElementById('inside')

      const arena = this.$refs.svg.$el.getElementById('arena').children.length
        ? this.$refs.svg.$el
            .getElementById('arena')
            .querySelectorAll('path, rect, circle, ellipse, polyline')
        : this.$refs.svg.$el.getElementById('arena')

      this.tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: this.$el,
          start: 'top+=15% bottom',
          end: 'bottom-=10% bottom',
          scrub: 1,
        },
      })

      this.tl.fromTo(
        outside,
        { opacity: 0 },
        {
          opacity: 1,
        }
      )

      this.tl.fromTo(
        border,
        { drawSVG: false },
        {
          drawSVG: true,
        },
        '>-100%'
      )
      this.tl.fromTo(
        inside,
        { drawSVG: false },
        {
          drawSVG: true,
          stagger: 0.025,
        },
        '<60%'
      )

      this.tl.addLabel('arena-circle', '<45%')
      this.tl.fromTo(
        arena,
        { opacity: 0 },
        {
          opacity: 1,
        },
        'arena-circle'
      )
      this.tl.to(
        this.playhead,
        {
          circle: this.animationCircle.totalFrames - 1,
          onUpdate: () =>
            this.animationCircle.goToAndStop(this.playhead.circle, true),
        },
        'arena-circle+=45%'
      )
      this.tl.addLabel('lotties')

      this.tl.to(
        this.playhead,
        {
          cross: this.animationCross.totalFrames - 1,
          onUpdate: () =>
            this.animationCross.goToAndStop(this.playhead.cross, true),
        },
        'lotties'
      )

      this.tl.to(
        this.playhead,
        {
          crossCircle: this.animationCrossCircle.totalFrames - 1,
          onUpdate: () =>
            this.animationCrossCircle.goToAndStop(
              this.playhead.crossCircle,
              true
            ),
        },
        'lotties+=25%'
      )

      this.tl.to(
        this.playhead,
        {
          littleArrow1: this.animationLittleArrow1.totalFrames - 1,
          onUpdate: () =>
            this.animationLittleArrow1.goToAndStop(
              this.playhead.littleArrow1,
              true
            ),
        },
        'lotties+=50%'
      )

      this.tl.to(
        this.playhead,
        {
          littleArrow2: this.animationLittleArrow2.totalFrames - 1,
          onUpdate: () =>
            this.animationLittleArrow2.goToAndStop(
              this.playhead.littleArrow2,
              true
            ),
        },
        'lotties+=75%'
      )

      this.tl.to(
        this.playhead,
        {
          littleArrow3: this.animationLittleArrow3.totalFrames - 1,
          onUpdate: () =>
            this.animationLittleArrow3.goToAndStop(
              this.playhead.littleArrow3,
              true
            ),
        },
        'lotties+=100%'
      )

      this.tl.fromTo(
        this.$refs.mainPlace.$el,
        {
          opacity: 0,
          yPercent: 50,
          rotate: -8,
        },
        {
          opacity: 1,
          yPercent: 0,
          rotate: -4,
          transformOrigin: 'left center',
        },
        'lotties'
      )
      this.tl.fromTo(
        this.$refs.secondPlace.$el,
        {
          opacity: 0,
          yPercent: 35,
          rotate: 0,
        },
        {
          opacity: 1,
          yPercent: 0,
          rotate: -4,
          transformOrigin: 'left center',
        },
        'lotties+=30%'
      )
    },
    initLottieAnimationsDesktop() {
      this.animationCircle = lottie.loadAnimation({
        container: this.$refs.circle,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Cercle_5.json`),
      })
      this.animationCross = lottie.loadAnimation({
        container: this.$refs.cross,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Croix_01.json`),
      })
      this.animationCrossCircle = lottie.loadAnimation({
        container: this.$refs.crossCircle,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Croix_circle.json`),
      })
      this.animationLittleArrow1 = lottie.loadAnimation({
        container: this.$refs.littleArrow1,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Petite_Fleche_01.json`),
      })
      this.animationLittleArrow2 = lottie.loadAnimation({
        container: this.$refs.littleArrow2,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Petite_Fleche_02.json`),
      })
      this.animationLittleArrow3 = lottie.loadAnimation({
        container: this.$refs.littleArrow3,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: require(`@/assets/lotties/Petite_Fleche_03.json`),
      })
    },
    initLottieAnimationsMobile() {
      this.animationCircle = lottie.loadAnimation({
        container: this.$refs.circle,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: require(`@/assets/lotties/Cercle_5.json`),
      })
      this.animationCross = lottie.loadAnimation({
        container: this.$refs.cross,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: require(`@/assets/lotties/Croix_01.json`),
      })

      this.animationLittleArrow1 = lottie.loadAnimation({
        container: this.$refs.littleArrow1,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: require(`@/assets/lotties/Petite_Fleche_01.json`),
      })
      this.animationLittleArrow2 = lottie.loadAnimation({
        container: this.$refs.littleArrow2,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: require(`@/assets/lotties/Petite_Fleche_02.json`),
      })
      this.animationLittleArrow3 = lottie.loadAnimation({
        container: this.$refs.littleArrow3,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: require(`@/assets/lotties/Petite_Fleche_03.json`),
      })
    },
  },
}
</script>

<style lang="scss">
.app-projet-plan {
  height: 300vh;
  position: relative;
  width: 100%;
  margin-top: desktop-vw(80px);

  @include mobile {
    margin-top: mobile-vw(80px);
    height: 100%;
  }

  &__inner {
    position: sticky;
    top: 0;
    align-items: center;
    height: 100vh;

    @include mobile {
      height: 100%;
      position: relative;
    }
  }

  &__svg {
    @include mobile {
      display: none;
    }
  }

  &__svg-mobile {
    @include desktop {
      display: none;
    }
  }

  &__content {
    grid-column: 1 / span 4;
    margin-top: desktop-vw(50px);

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
      margin-top: mobile-vw(0px);
    }

    &__title {
      .H4 {
        line-height: desktop-vw(32px);

        @include mobile {
          line-height: mobile-vw(42px);
        }
      }
    }

    &__subtitle {
      margin-bottom: desktop-vw(25px);
      width: 65%;
      margin-top: desktop-vw(25px);

      @include mobile {
        margin-top: mobile-vw(25px);
        margin-bottom: mobile-vw(25px);
      }
    }

    &__paragraph.app-element-rich-text {
      text-transform: initial;
      width: 65%;

      .P2.wysiwyg-text {
        @include font-adihausDIN-medium();
      }
    }
  }

  &__visual {
    grid-column: 5 / span 7;
    aspect-ratio: 860/540;
    transform: rotate(4deg);
    width: 107.5%;
    position: relative;

    @include mobile {
      grid-row: 1;
      grid-column: 1 / span 6;
      width: 90%;
      aspect-ratio: 315/400;
      left: 5%;
      margin-bottom: mobile-vw(30px);
    }

    &::after {
      content: '';
      background: url('/imgs/projet/plan-bg.webp');
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      mix-blend-mode: multiply;
      pointer-events: none;
      z-index: -9;
    }

    &__circle-01 {
      width: desktop-vw(180px);
      position: relative;
      aspect-ratio: 200 / 100;
      transform: rotate(6deg);
      position: absolute;
      top: desktop-vw(140px);
      right: desktop-vw(225px);

      @include mobile {
        width: mobile-vw(200px);
        top: mobile-vw(85px);
        right: mobile-vw(80px);
      }

      svg {
      }
    }
    &__little-arrow-1 {
      width: desktop-vw(45px);
      position: relative;
      aspect-ratio: 30 / 15;
      position: absolute;
      top: desktop-vw(160px);
      right: desktop-vw(400px);

      @include mobile {
        width: mobile-vw(65px);
        top: mobile-vw(100px);
        right: mobile-vw(235px);
      }

      svg {
        width: auto !important;
        height: auto !important;
      }
    }
    &__little-arrow-2 {
      width: desktop-vw(75px);
      position: relative;
      aspect-ratio: 50 / 20;
      transform: rotate(-8deg);
      position: absolute;
      top: desktop-vw(130px);
      right: desktop-vw(180px);

      @include mobile {
        width: mobile-vw(75px);
        top: mobile-vw(65px);
        right: mobile-vw(50px);
      }

      svg {
        width: auto !important;
        height: auto !important;
      }
    }
    &__little-arrow-3 {
      width: desktop-vw(35px);
      position: relative;
      aspect-ratio: 25 / 35;
      position: absolute;
      top: desktop-vw(235px);
      right: desktop-vw(235px);

      @include mobile {
        width: mobile-vw(35px);
        top: mobile-vw(185px);
        right: mobile-vw(115px);
      }

      svg {
        width: auto !important;
        height: auto !important;
      }
    }
    &__cross {
      width: desktop-vw(40px);
      position: relative;
      aspect-ratio: 40 / 40;
      transform: rotate(-8deg);
      position: absolute;
      top: desktop-vw(165px);
      right: desktop-vw(275px);

      @include mobile {
        width: mobile-vw(40px);
        top: mobile-vw(110px);
        right: mobile-vw(140px);
      }

      svg {
      }
    }
    &__cross-circle {
      width: desktop-vw(45px);
      position: relative;
      aspect-ratio: 35 / 35;
      position: absolute;
      top: desktop-vw(310px);
      left: desktop-vw(275px);

      svg {
      }
    }

    &__main-place {
      z-index: 1;
      position: relative;
      border: 2px solid var(--c-black);
      transform: rotate(-4deg);
      position: absolute;
      top: desktop-vw(50px);
      right: desktop-vw(180px);
      padding: desktop-vw(8px) desktop-vw(15px);
      will-change: transform;

      @include mobile {
        padding: mobile-vw(8px) mobile-vw(15px);
        left: 50%;
        transform: rotate(-4deg) translateX(-50%);
        width: 65%;
      }

      & > .P2 {
        @include h4();

        @include mobile {
          font-size: mobile-vw(24px);
          line-height: mobile-vw(24px);
        }
      }
    }

    &__second-place.app-atoms-title-tag {
      z-index: 1;
      position: relative;
      border: 2px solid var(--c-black);
      transform: rotate(-4deg);
      position: absolute;
      top: desktop-vw(265px);
      left: desktop-vw(255px);
      padding: desktop-vw(5px) desktop-vw(10px);
      will-change: transform;

      @include mobile {
        display: none;
      }

      & > .P2 {
        text-transform: uppercase;
      }
    }

    svg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
