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
    margin-bottom: mobile-vw(100px);
  }

  &__title.app-element-rich-text {
    grid-column: 3 / span 8;
    text-align: center;

    @include mobile {
      grid-column: 1 / span 6;
    }

    .H2.wysiwyg-text {
      @include mobile {
        font-size: mobile-vw(72px);
        line-height: mobile-vw(88px);
      }

      .app-element-lottie-word.Cercle_3 {
        svg {
          position: absolute;
          width: 100% !important;
          height: auto !important;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(5deg) !important;

          @include mobile {
            width: 100% !important;
          }

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
      margin-top: mobile-vw(80px);
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
