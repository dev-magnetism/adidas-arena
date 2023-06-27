<template>
  <div class="app-actualites-block-numbers grid-inner">
    <div class="app-actualites-block-numbers__wrapper">
      <div
        v-for="(card, index) in content.items"
        :key="`block-number-${index}`"
        class="app-actualites-block-numbers__number"
      >
        <EKinesis :speed="randomIntFromInterval(4, 8)">
          <AtomsCornerPoints :size-points="8" />
          <div class="app-actualites-block-numbers__number__content">
            <TH2
              tag="p"
              weight="bold"
              class="app-actualites-block-numbers__number__content__title"
            >
              {{ card.number }}
            </TH2>
            <TH2
              tag="p"
              weight="bold"
              class="app-actualites-block-numbers__number__content__subtitle"
            >
              {{ card.number_of }}
            </TH2>
            <TH4
              tag="p"
              weight="medium"
              class="app-actualites-block-numbers__number__content__paragraph"
            >
              {{ card.paragraph }}
            </TH4>
          </div>
        </EKinesis>
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
  mounted() {
    this.embla = EmblaCarousel(this.$el, {
      active: true,
      dragFree: false,
      skipSnaps: false,
      speed: 10,
      containScroll: 'keepSnaps',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 800px)': { active: false },
      },
    })
  },
  beforeDestroy() {
    this.embla?.destroy()
  },
  methods: {
    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
  },
}
</script>

<style lang="scss">
.app-actualites-block-numbers {
  position: relative;

  @include mobile {
    overflow: hidden;
    padding: mobile-vw(20px) 0px;
  }

  &__wrapper {
    grid-column: 3 / span 8;
    display: flex;
    flex-flow: row wrap;
    gap: var(--layout-columns-gap);

    @include mobile {
      grid-column: 1 / span 6;
      flex-flow: row nowrap;
      gap: calc(var(--layout-columns-gap) * 2.5);
    }
  }

  &__title {
    margin-bottom: desktop-vw(30px);
  }

  &__number {
    position: relative;
    width: 100%;
    flex: 0 0 calc(50% - var(--layout-columns-gap));
    align-self: flex-start;

    @include mobile {
      flex: 0 0 75%;
      min-width: 0;
    }

    &:first-child {
      @include mobile {
        margin-left: columns(0.75);
      }
    }

    &:nth-child(2n + 1) {
      left: calc(-1 * var(--layout-columns-gap));
      transform: rotate(6deg);

      @include mobile {
        left: 0;
        transform: rotate(4deg);
      }
    }

    &:nth-child(2n + 2) {
      left: var(--layout-columns-gap);
      transform: rotate(-6deg);
      margin-top: desktop-vw(185px);

      @include mobile {
        left: 0;
        margin-top: 0px;
        transform: rotate(-5deg);
      }
    }

    .app-actualites-block-numbers__number__content {
      padding: desktop-vw(80px) desktop-vw(40px) desktop-vw(40px)
        desktop-vw(40px);
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
      width: 100%;

      @include mobile {
        padding: mobile-vw(50px) mobile-vw(30px) mobile-vw(40px) mobile-vw(30px);
      }

      &__title {
        font-size: desktop-vw(190px);
        line-height: desktop-vw(105px);
        position: relative;
        display: inline-block;

        @include mobile {
          font-size: mobile-vw(130px);
          line-height: mobile-vw(70px);
        }
      }

      &__subtitle {
        font-size: desktop-vw(64px);
        line-height: desktop-vw(64px);

        @include mobile {
          font-size: mobile-vw(42px);
          line-height: mobile-vw(42px);
        }
      }

      &__paragraph {
        opacity: 0.4;
        margin-top: desktop-vw(20px);
        font-size: desktop-vw(32px);
        line-height: desktop-vw(32px);

        @include mobile {
          font-size: mobile-vw(22px);
          line-height: mobile-vw(22px);
        }
      }
    }
  }
}
</style>
