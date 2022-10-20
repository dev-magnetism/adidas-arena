<template>
  <div class="app-projet-two-columns grid-inner">
    <div class="app-projet-two-columns__f-r grid">
      <div class="app-projet-two-columns__f-r__visuals">
        <div class="app-projet-two-columns__f-r__fake-transparent" />
        <div class="app-projet-two-columns__f-r__card">
          <AtomsCornerPoints :size-points="8" />
          <div class="app-projet-two-columns__f-r__card__content">
            <TH2
              weight="bold"
              class="app-projet-two-columns__f-r__card__content__title"
            >
              {{ contents.firstRow.cardTitle }}
            </TH2>
            <TH2
              weight="bold"
              class="app-projet-two-columns__f-r__card__content__subtitle"
            >
              <ELottieWord id="Cercle_3" />
              {{ contents.firstRow.cardSubtitle }}
            </TH2>
            <TH3
              weight="medium"
              class="app-projet-two-columns__f-r__card__content__paragraph"
            >
              {{ contents.firstRow.cardParagraph }}
            </TH3>
          </div>
          <AtomsCTA bg="blue-adidas" color="white">
            {{ contents.firstRow.cardCtaText }}
          </AtomsCTA>
        </div>
      </div>
      <div class="app-projet-two-columns__f-r__content">
        <ERichText
          class="app-projet-two-columns__f-r__content__title"
          :content="contents.firstRow.title"
        />
        <ERichText
          class="app-projet-two-columns__f-r__content__paragraph"
          :content="contents.firstRow.paragraph"
        />
      </div>
      <ELottie
        id="Petite_Fleche_02"
        class="app-projet-two-columns__f-r__lottie-arrow"
      />
    </div>

    <div class="app-projet-two-columns__s-r grid">
      <div class="app-projet-two-columns__s-r__content">
        <ERichText
          class="app-projet-two-columns__s-r__content__title"
          :content="contents.secondRow.title"
        />
        <ERichText
          class="app-projet-two-columns__s-r__content__paragraph"
          :content="contents.secondRow.paragraph"
        />
      </div>

      <div class="app-projet-two-columns__s-r__visuals">
        <nuxt-picture
          class="app-projet-two-columns__s-r__visual"
          provider="directus"
          :src="contents.secondRow.picture"
          format="webp"
          :alt="contents.secondRow.pictureAlt"
        />
        <div class="app-projet-two-columns__s-r__card">
          <AtomsCornerPoints :size-points="8" />
          <div class="app-projet-two-columns__s-r__card__content">
            <TH2
              weight="bold"
              class="app-projet-two-columns__s-r__card__content__title"
            >
              <ELottieWord id="Cercle_4" />
              {{ contents.secondRow.cardTitle }}
            </TH2>
            <TH2
              weight="bold"
              class="app-projet-two-columns__s-r__card__content__subtitle"
            >
              {{ contents.secondRow.cardSubtitle }}
            </TH2>
            <TH3
              weight="medium"
              class="app-projet-two-columns__s-r__card__content__paragraph"
            >
              {{ contents.secondRow.cardParagraph }}
            </TH3>
          </div>
        </div>
      </div>
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
.app-projet-two-columns {
  padding-top: desktop-vw(100px);

  &__s-r {
    grid-row: 2;
    grid-column: 1 / span 12;
    width: 100%;

    &__visuals {
      grid-column: 6 / span 6;
      position: relative;
    }

    &__visual {
      aspect-ratio: 345 / 430;
      display: block;
      width: columns(3.25);
      position: absolute;
      transform: rotate(-3deg);
      top: desktop-vw(-80px);
      left: 0;
    }

    &__card {
      width: columns(3.95);
      margin-left: auto;
      transform: rotate(5deg);
      position: relative;
      top: desktop-vw(-300px);

      &__content {
        padding: desktop-vw(45px) desktop-vw(40px) desktop-vw(45px)
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

        &__title {
          font-size: desktop-vw(160px);
          line-height: desktop-vw(160px);
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
          font-size: desktop-vw(88px);
          line-height: desktop-vw(106px);
        }

        &__paragraph {
          font-size: desktop-vw(32px);
          line-height: desktop-vw(32px);
          opacity: 0.4;
          margin-top: desktop-vw(20px);
        }
      }
    }

    &__content {
      grid-column: 1 / span 4;

      &__title.app-element-rich-text {
        width: columns(2.5);
      }

      &__paragraph.app-element-rich-text {
        margin-top: desktop-vw(25px);
        margin-left: auto;
        width: columns(3);

        .P1.wysiwyg-text {
          text-transform: uppercase;
        }
      }
    }
  }

  &__f-r {
    grid-row: 1;
    grid-column: 1 / span 12;
    margin-bottom: desktop-vw(200px);
    position: relative;

    &__lottie-arrow.app-element-lottie {
      position: absolute;
      grid-column: 6 / span 1;
      width: 135%;
      aspect-ratio: 85 / 35;

      svg {
        path {
          stroke: var(--c-blue-adidas);
        }
      }
    }

    &__visuals {
      grid-column: 2 / span 4;
      position: relative;
      margin-top: desktop-vw(120px);
    }

    &__card {
      z-index: 1;
      position: relative;
      width: 85%;
      background: white;
      margin-left: auto;
      transform: rotate(-2.85deg);
      top: desktop-vw(50px);

      &__content {
        padding: desktop-vw(25px) desktop-vw(40px) desktop-vw(15px)
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

        &__title {
          font-size: desktop-vw(160px);
          line-height: desktop-vw(160px);
        }

        &__subtitle {
          font-size: desktop-vw(88px);
          line-height: desktop-vw(106px);
          display: inline-block;
          position: relative;

          .app-element-lottie-word {
            position: absolute;
            width: 160%;
            height: auto;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            align-items: center;
          }
        }

        &__paragraph {
          font-size: desktop-vw(32px);
          line-height: desktop-vw(32px);
          opacity: 0.4;
        }
      }

      .app-atoms-cta {
        width: 100%;
      }
    }

    &__fake-transparent {
      aspect-ratio: 250 / 315;
      width: 60%;
      transform: rotate(1.5deg);
      position: absolute;
      top: 0;
      left: 0;

      @include fake-transparent();
    }
    &__content {
      grid-column: 8 / span 4;
      height: 100%;

      &__title.app-element-rich-text {
      }

      &__paragraph.app-element-rich-text {
        margin-top: desktop-vw(25px);

        .P1.wysiwyg-text {
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
