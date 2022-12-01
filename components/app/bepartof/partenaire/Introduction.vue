<template>
  <div class="app-be-part-of-partenaire-introduction grid-inner">
    <div class="app-be-part-of-partenaire-introduction__f-row__content">
      <ERichText
        class="app-be-part-of-partenaire-introduction__f-row__content__title"
        :content="contents.title"
      />
      <TP2
        class="app-be-part-of-partenaire-introduction__f-row__content__text"
        weight="bold"
      >
        {{ contents.subtitle }}
      </TP2>
    </div>

    <EParallax
      ref="bigVisual"
      :speed="0.45"
      class="app-be-part-of-partenaire-introduction__f-row__visual"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          class=""
          provider="directus"
          :src="contents.picture.src"
          format="webp"
          :alt="contents.picture.alt"
        />
      </EKinesis>
    </EParallax>

    <EParallax
      ref="framedVisual"
      class="app-be-part-of-partenaire-introduction__s-row__visual"
      :speed="0.55"
    >
      <EKinesis :speed="7.5">
        <EFramedPicture class="" color="red-adidas">
          <EKinesis :speed="-3.5">
            <nuxt-picture
              provider="directus"
              :src="contents.pictureFramed.src"
              format="webp"
              :alt="contents.pictureFramed.alt"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>

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

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    if (this.$viewport.isMobile) return

    gsap.fromTo(
      this.$refs.bigVisual.$el,
      {
        rotate: 6,
      },
      {
        rotate: 2,
        scrollTrigger: {
          trigger: this.$refs.bigVisual.$el,
          scrub: 0.5,
          end: 'bottom top',
        },
      }
    )

    gsap.fromTo(
      this.$refs.framedVisual.$el,
      {
        rotate: -6,
      },
      {
        rotate: -2,
        scrollTrigger: {
          trigger: this.$refs.framedVisual.$el,
          scrub: 0.5,
          end: 'bottom top',
        },
      }
    )
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

  &__f-row {
    &__content {
      grid-column: 2 / span 5;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      width: 95%;

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
      &__text {
        text-transform: uppercase;
        width: 80%;
      }
    }
    &__visual.app-parallax {
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

    &__visual.app-parallax {
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
