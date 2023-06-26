<template>
  <div class="app-actualites-block-numbers grid-inner">
    <div class="app-actualites-block-numbers__wrapper">
      <EParallax
        v-for="(card, index) in content.items"
        :key="`block-number-${index}`"
        :speed="0.5"
        class="app-actualites-block-numbers__number"
      >
        <EKinesis :speed="7.5">
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
      </EParallax>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-actualites-block-numbers {
  &__wrapper {
    grid-column: 3 / span 8;
    display: flex;
    flex-flow: row wrap;
    gap: var(--layout-columns-gap);
  }

  &__title {
    margin-bottom: desktop-vw(30px);
  }

  &__number.app-parallax {
    position: relative;
    width: 100%;
    flex: 1 1 0;
    align-self: flex-start;

    &:nth-child(2n + 1) {
      left: calc(-1 * var(--layout-columns-gap));
      transform: rotate(6deg);
    }

    &:nth-child(2n + 2) {
      left: var(--layout-columns-gap);
      transform: rotate(-6deg);
      margin-top: desktop-vw(185px);
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

      &__title {
        font-size: desktop-vw(190px);
        line-height: desktop-vw(105px);
        position: relative;
        display: inline-block;
      }

      &__subtitle {
        font-size: desktop-vw(64px);
        line-height: desktop-vw(64px);
      }

      &__paragraph {
        opacity: 0.4;
        margin-top: desktop-vw(20px);
        font-size: desktop-vw(32px);
        line-height: desktop-vw(32px);
      }
    }
  }
}
</style>
