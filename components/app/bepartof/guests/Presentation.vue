<template>
  <div class="app-be-part-of-guests-presentation grid-inner">
    <ERichText
      class="app-be-part-of-guests-presentation__title"
      :content="contents.title"
      tag="h1"
    />
    <EParallax
      ref="bigVisual"
      :speed="0.85"
      class="app-be-part-of-guests-presentation__visual"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          provider="directus"
          :src="contents.picture.src"
          format="webp"
          :alt="contents.picture.alt"
          sizes="sm:35vw md:50vw"
          loading="lazy"
        />
      </EKinesis>
    </EParallax>
    <EParallax
      ref="framedVisual"
      class="app-be-part-of-guests-presentation__framed-visual"
      :speed="1"
    >
      <EKinesis :speed="7.5">
        <EFramedPicture color="blue-adidas">
          <EKinesis :speed="4">
            <nuxt-picture
              class="picture-absolute"
              provider="directus"
              :src="contents.pictureFramed.src"
              format="webp"
              :alt="contents.pictureFramed.alt"
              sizes="sm:35vw md:50vw"
              loading="lazy"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>
    <div class="app-be-part-of-guests-presentation__text">
      <TH4 tag="p">{{ contents.paragraphTitle }}</TH4>

      <ERichText :content="contents.paragraph" />
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
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.kill()
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
.app-be-part-of-guests-presentation {
  position: relative;
  padding-bottom: desktop-vw(720px);

  @include mobile {
    padding-bottom: mobile-vw(80px);
  }

  &__title {
    grid-column: 1 / span 6;

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
    top: desktop-vw(375px);
    transform: rotate(-2deg);

    @include mobile {
      grid-column: 1 / span 4;
      grid-row: 2;
      position: relative;
      top: 0;
      margin-bottom: mobile-vw(150px);
    }

    picture {
      @include noise();
    }
  }

  &__framed-visual.app-parallax {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    transform: rotate(4deg);
    top: desktop-vw(625px);

    @include mobile {
      grid-column: 4 / span 3;
      grid-row: 2;
      position: relative;
      top: mobile-vw(180px);
    }

    .app-element-framed-picture {
      @include mobile {
        padding: mobile-vw(8px);
      }
    }

    picture {
      @include noise();
    }
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 8 / span 5;
    width: 75%;

    @include mobile {
      grid-column: 1 / span 6;
      grid-row: 3;
      margin-top: mobile-vw(0px);
      width: 100%;
    }

    .H4 {
      margin-bottom: desktop-vw(30px);

      @include mobile {
        margin-bottom: mobile-vw(40px);
        text-align: right;
      }
    }

    .P2 {
      margin-left: columns(1.5);
      text-transform: initial;
    }
  }
}
</style>
