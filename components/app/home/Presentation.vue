<template>
  <div class="app-home-presentation grid-inner">
    <ERichText
      class="app-home-presentation__title"
      :content="contents.content"
      :split="true"
      :overflow="false"
      :scrub="true"
      tag="div"
    />

    <EParallax
      ref="visualBigger"
      :speed="1.35"
      class="app-home-presentation__visual-bigger"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          provider="directus"
          :src="contents.pictureBigVisual"
          :alt="contents.pictureBigVisualAlt"
          format="webp"
          sizes="sm:50vw md:40vw"
          loading="lazy"
        />
      </EKinesis>
    </EParallax>

    <EParallax
      ref="framed"
      :speed="0.7"
      class="app-home-presentation__visual-framed"
    >
      <EKinesis :speed="5">
        <EFramedPicture color="red-adidas">
          <EKinesis :speed="-3.5">
            <nuxt-picture
              provider="directus"
              :src="contents.pictureFramed"
              :alt="contents.pictureFramedAlt"
              format="webp"
              sizes="sm:50vw md:40vw"
              loading="lazy"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>

    <EParallax
      ref="pictureCorner"
      :speed="1"
      class="app-home-presentation__picture-corner-points"
    >
      <EKinesis :speed="15">
        <ECornerPointsPicture :size-points="6">
          <video
            ref="video"
            class="app-home-presentation__visual-smaller picture-absolute"
            autoplay
            loop
            muted
            playsinline
          >
            <source
              :src="`${$img.options.providers.directus.defaults.baseURL}assets/${contents.pictureBorder}.mp4`"
              type="video/mp4"
            />
          </video>
        </ECornerPointsPicture>
      </EKinesis>
    </EParallax>
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
    this.mm?.kill()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const tweenVisual = gsap.fromTo(
          this.$refs.pictureCorner.$el,
          {
            rotate: 5,
          },
          {
            rotate: -2,
            scrollTrigger: {
              trigger: this.$refs.pictureCorner.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        const tweenVisualBigger = gsap.fromTo(
          this.$refs.visualBigger.$el,
          {
            rotate: -6,
          },
          {
            rotate: -2,
            scrollTrigger: {
              trigger: this.$refs.visualBigger.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        const tweenFramed = gsap.fromTo(
          this.$refs.framed.$el,
          {
            rotate: 6,
          },
          {
            rotate: 2,
            scrollTrigger: {
              trigger: this.$refs.framed.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        return () => {
          tweenVisual?.kill()
          tweenVisualBigger?.kill()
          tweenFramed?.kill()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-home-presentation {
  width: 100%;
  padding-top: desktop-vw(130px);
  position: relative;
  padding-bottom: desktop-vw(650px);

  @include mobile {
    margin-top: mobile-vw(85px);
    padding-bottom: 0px;
    padding-top: 0px;
    margin-bottom: mobile-vw(120px);
  }

  &__visual-framed {
    position: absolute;
    aspect-ratio: 545 / 670;
    top: 28vw;
    left: 20px;
    grid-column: 7 / span 5;
    width: 100%;
    transform: translateY(-50%) rotate(2deg);
    z-index: 1;
    margin-top: desktop-vw(225px);

    @include mobile {
      position: relative;
      aspect-ratio: 265/325;
      top: mobile-vw(60px);
      left: 0;
      grid-column: 2 / span 5;
      width: 100%;
      transform: rotate(2deg);
      z-index: 1;
      grid-row: 2;
      margin-top: mobile-vw(0px);
    }

    .app-element-framed-picture {
      width: 100%;
      height: 100%;

      picture {
        @include noise();
      }
    }
  }

  &__visual-bigger {
    position: absolute;
    aspect-ratio: 520 / 650;
    top: 27vw;
    grid-column: 3 / span 5;
    width: 100%;
    transform: rotate(-2deg);
    z-index: 0;
    margin-top: desktop-vw(225px);

    @include mobile {
      position: relative;
      aspect-ratio: 210/265;
      top: mobile-vw(0px);
      grid-column: 1 / span 4;
      width: 100%;
      grid-row: 3;
      margin-top: mobile-vw(0px);
    }

    picture {
      @include noise();
    }
  }

  &__picture-corner-points {
    position: absolute;
    aspect-ratio: 320 / 210;
    top: 40vw;
    grid-column: 6 / span 3;
    left: columns(1);
    width: 100%;
    transform: rotate(5deg);
    z-index: 2;
    margin-top: desktop-vw(225px);

    @include mobile {
      position: absolute;
      aspect-ratio: 155/100;
      grid-column: 4 / span 3;
      width: 100%;
      z-index: 2;
      left: 0;
      bottom: 0;
      grid-row: 3;
      margin-top: 0;
      transform: translateY(75%) rotate(5deg);
    }

    .app-element-corner-points-picture {
      width: 100%;
      height: 100%;
      display: block;
    }

    .app-home-presentation__visual-smaller {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    grid-column: 1 / span 6;
    z-index: 1;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }
}
</style>
