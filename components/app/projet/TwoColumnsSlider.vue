<template>
  <div class="app-projet-two-columns-slider full-width">
    <div ref="wrapper" class="app-projet-two-columns-slider__wrapper">
      <div class="app-projet-two-columns-slider__f-card">
        <AtomsCornerPoints :size-points="6" />
        <div class="app-projet-two-columns-slider__f-card__content">
          <TH2
            weight="bold"
            class="app-projet-two-columns-slider__f-card__content__title"
          >
            {{ content.firstRow.cardTitle }}
          </TH2>
          <TH2
            weight="bold"
            class="app-projet-two-columns-slider__f-card__content__subtitle"
          >
            <ELottieWord id="Cercle_3" />
            {{ content.firstRow.cardSubtitle }}
          </TH2>
          <TH3
            weight="medium"
            class="app-projet-two-columns-slider__f-card__content__paragraph"
          >
            {{ content.firstRow.cardParagraph }}
          </TH3>
        </div>
        <AtomsCTA bg="blue-adidas" color="white">
          {{ content.firstRow.cardCtaText }}
        </AtomsCTA>
      </div>
      <div class="app-projet-two-columns-slider__s-card">
        <AtomsCornerPoints :size-points="6" />
        <div class="app-projet-two-columns-slider__s-card__content">
          <TH2
            weight="bold"
            class="app-projet-two-columns-slider__s-card__content__title"
          >
            <ELottieWord id="Cercle_4" />
            {{ content.secondRow.cardTitle }}
          </TH2>
          <TH2
            weight="bold"
            class="app-projet-two-columns-slider__s-card__content__subtitle"
          >
            {{ content.secondRow.cardSubtitle }}
          </TH2>
          <TH3
            weight="medium"
            class="app-projet-two-columns-slider__s-card__content__paragraph"
          >
            {{ content.secondRow.cardParagraph }}
          </TH3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmblaCarousel from 'embla-carousel'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  mounted() {
    this.embla = EmblaCarousel(this.$el, {
      //   containScroll: 'keepSnaps',
      skipSnaps: true,
      align: 'center',
      slidesToScroll: 1,
    })
  },
  beforeDestroy() {},
  methods: {},
}
</script>

<style lang="scss">
.app-projet-two-columns-slider {
  grid-row: 2;
  grid-column: 1 / span 6;
  width: 100%;
  margin-bottom: mobile-vw(20px);
  overflow: hidden;
  width: 100vw;
  padding-top: mobile-vw(70px);
  padding-bottom: mobile-vw(20px);

  @include desktop {
    display: none;
  }

  &__wrapper {
    display: flex;
    flex-direction: row;
    will-change: transform;
    column-gap: mobile-vw(40px);
  }

  &__f-card {
    transform: rotate(-1.35deg);
    position: relative;
    flex: 0 0 70%;
    display: flex;
    flex-direction: column;

    &__content {
      padding: mobile-vw(25px) mobile-vw(25px) mobile-vw(10px) mobile-vw(25px);
      background: linear-gradient(
          rgba(251, 245, 238, 0.8) 0.1em,
          transparent 0.1em
        ),
        linear-gradient(
          90deg,
          rgba(251, 245, 238, 0.8) 0.1em,
          transparent 0.1em
        ),
        white;
      background-size: 1.3em 1.3em;

      &__title {
        font-size: mobile-vw(112px);
        line-height: mobile-vw(112px);
        position: relative;
        display: inline-block;

        .app-element-lottie-word {
          position: absolute;
          width: 150%;
          height: auto;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          align-items: center;
        }
      }

      &__subtitle {
        font-size: mobile-vw(64px);
        line-height: mobile-vw(64px);
        position: relative;
        display: inline-block;

        .app-element-lottie-word {
          position: absolute;
          width: 140%;
          height: auto;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          align-items: center;
        }
      }

      &__paragraph {
        font-size: mobile-vw(24px);
        line-height: mobile-vw(24px);
        opacity: 0.4;
        margin-top: mobile-vw(10px);
      }
    }
    .app-atoms-cta.arrow {
      width: 100%;
      margin-top: auto;
      padding: mobile-vw(15px) mobile-vw(5px) mobile-vw(15px) mobile-vw(15px);

      .P2.app-atoms-cta__text {
        font-size: mobile-vw(16px);
        line-height: mobile-vw(24px);
        text-decoration: underline;
      }
    }
  }

  &__s-card {
    transform: translateY(mobile-vw(-55px)) rotate(1.35deg);
    position: relative;
    flex: 0 0 77.5%;

    &__content {
      padding: mobile-vw(25px) mobile-vw(25px) mobile-vw(30px) mobile-vw(25px);
      background: linear-gradient(
          rgba(251, 245, 238, 0.8) 0.1em,
          transparent 0.1em
        ),
        linear-gradient(
          90deg,
          rgba(251, 245, 238, 0.8) 0.1em,
          transparent 0.1em
        ),
        white;
      background-size: 1.3em 1.3em;
      height: 100%;

      &__title {
        font-size: mobile-vw(112px);
        line-height: mobile-vw(112px);
        position: relative;
        display: inline-block;

        .app-element-lottie-word {
          position: absolute;
          width: 150%;
          height: auto;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          align-items: center;
        }
      }

      &__subtitle {
        font-size: mobile-vw(64px);
        line-height: mobile-vw(64px);
      }

      &__paragraph {
        font-size: mobile-vw(24px);
        line-height: mobile-vw(24px);
        opacity: 0.4;
        margin-top: mobile-vw(10px);
      }
    }
  }
}
</style>
