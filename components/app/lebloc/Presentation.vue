<template>
  <div class="app-le-bloc-presentation grid-inner">
    <ERichText
      class="app-le-bloc-presentation__title"
      :content="contents.title"
    />
    <EParallax
      ref="bigVisual"
      :speed="0.75"
      class="app-le-bloc-presentation__visual"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          provider="directus"
          :src="contents.picture.src"
          format="webp"
          :alt="contents.picture.alt"
          class="picture-absolute"
          sizes="sm:35vw md:75vw"
          loading="lazy"
        />
      </EKinesis>
    </EParallax>

    <EParallax :speed="1" class="app-le-bloc-presentation__framed-visual">
      <EKinesis :speed="6.5">
        <EFramedPicture ref="framedVisual" color="blue-adidas">
          <EKinesis :speed="-2.5">
            <nuxt-picture
              class="picture-absolute"
              provider="directus"
              :src="contents.pictureFramed.src"
              :alt="contents.pictureFramed.alt"
              format="webp"
              sizes="sm:35vw md:70vw"
              loading="lazy"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>
    <EKinesis :speed="2.5" class="app-le-bloc-presentation__text">
      <TH4 tag="p">{{ contents.paragraphTitle }}</TH4>

      <ERichText :content="contents.paragraph" />
    </EKinesis>
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
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.revert()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const tweenBigVisual = gsap.fromTo(
          this.$refs.bigVisual.$el,
          {
            rotate: -6,
          },
          {
            rotate: -2,
            scrollTrigger: {
              trigger: this.$refs.bigVisual.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        const tweenFramedVisual = gsap.fromTo(
          this.$refs.framedVisual.$el,
          {
            rotate: 8,
          },
          {
            rotate: 4,
            scrollTrigger: {
              trigger: this.$refs.framedVisual.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        return () => {
          tweenBigVisual?.kill()
          tweenFramedVisual?.kill()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-le-bloc-presentation {
  position: relative;
  padding-bottom: desktop-vw(750px);

  @include mobile {
    padding-bottom: mobile-vw(100px);
  }

  picture {
    @include noise();
  }

  &__title {
    grid-column: 1 / span 4;

    @include mobile {
      grid-column: 1 / span 6;
      grid-row: 1;
    }
  }

  &__visual.app-parallax {
    position: absolute;
    grid-column: 4 / span 4;
    width: 100%;
    aspect-ratio: 440 / 545;
    top: desktop-vw(200px);
    transform: rotate(-2deg);
    height: auto;

    @include mobile {
      grid-row: 2;
      position: relative;
      top: 0;
      grid-column: 1 / span 4;
      aspect-ratio: 205 / 250;
      margin-bottom: mobile-vw(130px);
    }
  }

  &__framed-visual.app-parallax {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    top: desktop-vw(450px);
    height: auto;

    @include mobile {
      grid-row: 2;
      grid-column: 4 / span 3;
      aspect-ratio: 165 / 200;
    }

    .app-element-framed-picture {
      transform: rotate(4deg);
      height: 100%;
      padding: desktop-vw(20px);

      @include mobile {
        padding: mobile-vw(8px);
      }
    }
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 9 / span 3;

    @include mobile {
      grid-row: 3;
      grid-column: 2 / span 5;
      margin-top: mobile-vw(0px);
    }

    .H4 {
      margin-bottom: desktop-vw(30px);
    }

    .P2 {
      text-transform: initial;
      font-size: desktop-vw(18px);
      @include font-ITCFranklinGothicLT-BkCp();

      @include mobile{
        font-size: mobile-vw(16px);
      }
    }
  }
}
</style>
