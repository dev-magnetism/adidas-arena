<template>
  <div class="app-be-part-of-hospitalite-presentation grid-inner">
    <ERichText
      class="app-be-part-of-hospitalite-presentation__title"
      :content="contents.title"
    />
    <EParallax
      ref="bigVisual"
      :speed="1"
      class="app-be-part-of-hospitalite-presentation__visual"
    >
      <nuxt-picture
        provider="directus"
        :src="contents.picture.src"
        format="webp"
        :alt="contents.picture.alt"
      />
    </EParallax>
    <EParallax
      ref="framedVisual"
      class="app-be-part-of-hospitalite-presentation__framed-visual"
      :speed="0.85"
    >
      <EKinesis :speed="5">
        <EFramedPicture color="blue-adidas">
          <EKinesis :speed="-3.5">
            <nuxt-picture
              class="picture-absolute"
              provider="directus"
              :src="contents.pictureFramed.src"
              format="webp"
              :alt="contents.pictureFramed.alt"
            />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>
    <div class="app-be-part-of-hospitalite-presentation__text">
      <TH4>{{ contents.paragraphTitle }}</TH4>

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
    if (this.$viewport.isMobile) return

    gsap.fromTo(
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

    gsap.fromTo(
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
  },
}
</script>

<style lang="scss">
.app-be-part-of-hospitalite-presentation {
  position: relative;
  padding-bottom: desktop-vw(950px);

  @include mobile {
    padding-bottom: mobile-vw(80px);
  }

  &__title {
    grid-column: 1 / span 5;

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
    top: desktop-vw(250px);
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
    top: desktop-vw(550px);

    @include mobile {
      grid-column: 4 / span 3;
      grid-row: 2;
      position: relative;
      top: mobile-vw(180px);
      padding: mobile-vw(8px);
    }

    picture {
      @include noise();
    }
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 8 / span 4;

    @include mobile {
      grid-column: 1 / span 6;
      grid-row: 3;
      margin-top: mobile-vw(0px);
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
