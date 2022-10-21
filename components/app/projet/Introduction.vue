<template>
  <div class="app-projet-introduction grid-inner">
    <div class="app-projet-introduction__row-framed-content">
      <ERichText :content="contents.title" />
      <ERichText :content="contents.subtitle" />
    </div>

    <EParallax
      ref="framed"
      :speed="0.65"
      class="app-projet-introduction__row-framed-visual"
    >
      <EKinesis :speed="5">
        <EFramedPicture color="red-adidas">
          <EKinesis :speed="-3.5">
            <nuxt-picture
              provider="directus"
              :src="contents.pictureFramedImage"
              format="webp"
              :alt="contents.pictureFramedAlt"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>

    <div
      ref="visualBigger"
      class="app-projet-introduction__row-second-visual-principal"
    >
      <EParallax :speed="1">
        <EKinesis :speed="5">
          <TH3> {{ contents.pictureLabelText }} </TH3>
          <nuxt-picture
            provider="directus"
            :src="contents.pictureLabelImage"
            :alt="contents.pictureLabelAlt"
            format="webp"
          />
        </EKinesis>
      </EParallax>
    </div>

    <EParallax
      ref="visualTransparent"
      :speed="0.35"
      class="app-projet-introduction__row-second-visual-transparent"
    >
      <EKinesis :speed="15">
        <nuxt-picture
          :src="contents.pictureLogoImage"
          provider="directus"
          format="webp"
          :alt="contents.pictureLogoAlt"
        />
        <AtomsCornerPoints :size-points="6" />
      </EKinesis>
    </EParallax>

    <div class="app-projet-introduction__row-second-content">
      <EParallax :speed="0.35">
        <TH4>{{ contents.whyTitle }}</TH4>

        <ERichText :content="contents.whyParagraph" />
      </EParallax>
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
    gsap.fromTo(
      this.$refs.visualBigger,
      {
        rotate: -6,
      },
      {
        rotate: -2,
        scrollTrigger: {
          trigger: this.$refs.visualBigger,
          scrub: 0.5,
          end: 'bottom top',
        },
      }
    )

    gsap.fromTo(
      this.$refs.framed.$el,
      {
        rotate: 8,
      },
      {
        rotate: 4,
        scrollTrigger: {
          trigger: this.$refs.framed.$el,
          scrub: 0.5,
          end: 'bottom top',
        },
      }
    )
    gsap.fromTo(
      this.$refs.visualTransparent.$el,
      {
        rotate: -9,
      },
      {
        rotate: -4,
        scrollTrigger: {
          trigger: this.$refs.visualTransparent.$el,
          scrub: 0.5,
          end: 'bottom top',
        },
      }
    )
  },
}
</script>

<style lang="scss">
.app-projet-introduction {
  position: relative;

  &__row-framed-content {
    grid-column: 2 / span 6;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    width: 90%;

    .H2 {
      line-height: desktop-vw(110px);
    }

    .P2.wysiwyg-text {
      width: 80%;
      text-transform: uppercase;
      @include font-adihausDIN-bold();
      font-weight: 700;

      &:first-child {
        margin-top: desktop-vw(15px);
      }
    }
  }

  &__row-framed-visual {
    grid-column: 7 / span 5;
    grid-row: 1;
    aspect-ratio: 545 / 670;
    margin-top: desktop-vw(50px);
    width: 95%;
    margin-left: desktop-vw(50px);
    z-index: 2;
    transform: rotate(4deg);

    .app-element-framed-picture {
      height: 100%;
    }
  }

  &__row-second-visual-transparent {
    position: absolute;
    grid-row: 2;
    width: 100%;
    grid-column: 6 / span 2;
    top: 20%;
    transform: rotate(-9deg);
    aspect-ratio: 200 / 130;
    left: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    transform-origin: center center;

    .app-element-kinesis {
      display: flex;
      justify-content: center;
      align-items: center;

      @include fake-transparent();
    }

    picture {
      display: block;
      width: 55%;
      height: auto;
    }
  }

  &__row-second-content {
    grid-column: 9 / span 3;
    margin-top: desktop-vw(100px);
    grid-row: 2;

    .P2 {
      &:first-child {
        margin-top: desktop-vw(30px);
      }
    }
  }

  &__row-second-visual-principal {
    grid-column: 2 / span 6;
    position: relative;
    transform: translateY(-30%) rotate(-1.8deg);
    width: 95%;
    margin-left: desktop-vw(25px);
    grid-row: 2;
    margin-top: desktop-vw(-25px);
    // transform-origin: right bottom;

    .app-element-kinesis {
      display: flex;
    }

    .H3 {
      font-size: desktop-vw(22px);
      line-height: desktop-vw(28px);
      letter-spacing: -0.04em;
      align-self: flex-end;
      writing-mode: vertical-rl;
      transform: scale(-1);

      margin-right: desktop-vw(20px);
    }

    picture {
      aspect-ratio: 595 / 740;
      width: 100%;
      display: block;
    }
  }
}
</style>
