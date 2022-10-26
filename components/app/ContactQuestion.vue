<template>
  <div class="app-contact-question grid-inner">
    <ERichText class="app-contact-question__title" :content="contents.title" />

    <div class="app-contact-question__ask">
      <AtomsCTA>Poser une question</AtomsCTA>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-contact-question {
  margin-bottom: desktop-vw(140px);
  position: relative;
  row-gap: 0;

  @include mobile {
    margin-bottom: mobile-vw(130px);
  }

  &__title {
    grid-column: 4 / span 6;
    text-align: center;

    @include mobile {
      grid-column: 1 / span 6;
    }

    .H2.wysiwyg-text {
      font-size: desktop-vw(100px);
      line-height: desktop-vw(120px);

      @include mobile {
        font-size: mobile-vw(72px);
        line-height: mobile-vw(88px);
      }

      .app-element-lottie-word.Cercle_3 {
        svg {
          position: absolute;
          width: 115% !important;
          height: auto !important;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(5deg) !important;

          path {
            stroke: var(--c-blue-adidas);
          }
        }
      }
    }
  }

  &__ask {
    grid-column: 5 / span 4;
    display: flex;
    justify-content: center;
    margin-top: desktop-vw(90px);

    @include mobile {
      grid-column: 1 / span 6;
    }

    .app-atoms-cta {
      width: 75%;

      @include mobile {
        width: 100%;
      }
    }
  }
}
</style>
