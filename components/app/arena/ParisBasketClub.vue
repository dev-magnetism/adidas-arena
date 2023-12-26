<template>
  <div class="app-arena-paris-basket-club grid-inner">
    <EParallax
      ref="frameWrapper"
      class="app-arena-paris-basket-club__visual-with-frame"
      :speed="0.75"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          ref="picture"
          provider="directus"
          :src="contents.pictureFramed.src"
          format="webp"
          :alt="contents.pictureFramed.alt"
          class="picture-absolute"
          sizes="sm:35vw md:60vw"
        />
        <ELottie id="Cadre_01" start="top bottom-=15%" />
      </EKinesis>
    </EParallax>
    <EKinesis
      :speed="7.5"
      class="app-arena-paris-basket-club__visual-transparent"
    >
      <nuxt-picture
        provider="directus"
        :src="contents.pictureLogo.src"
        format="webp"
        :alt="contents.pictureLogo.alt"
        sizes="sm:35vw md:60vw"
      />
      <AtomsCornerPoints :size-points="8" />
    </EKinesis>
    <EParallax
      ref="withoutFrame"
      class="app-arena-paris-basket-club__visual-without-frame"
      :speed="0.85"
    >
      <EKinesis :speed="5">
        <nuxt-picture
          ref="picture"
          provider="directus"
          :src="contents.picture.src"
          format="webp"
          :alt="contents.picture.alt"
          sizes="sm:35vw md:60vw"
        />
      </EKinesis>
    </EParallax>
    <ELottie
      id="Fleche_2"
      start="top bottom-=15%"
      class="app-arena-paris-basket-club__lottie-arrow"
    />
    <div class="app-arena-paris-basket-club__content">
      <ERichText
        class="app-arena-paris-basket-club__content__title"
        :content="contents.title"
      />

      <TP1 class="app-arena-paris-basket-club__content__subtitle" weight="bold">
        {{ contents.subtitle }}
      </TP1>

      <ERichText
        class="app-arena-paris-basket-club__content__paragraph"
        :content="contents.paragraph"
      />

      <AtomsLink :href="contents.linkHref">
        <TP1 class="app-atoms-link-underline__text" weight="bold">
          {{ contents.linkText }}
        </TP1>
      </AtomsLink>
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
    this.mm?.revert()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const tweenFrame = gsap.fromTo(
          this.$refs.frameWrapper.$el,
          {
            rotate: -10,
          },
          {
            rotate: -6,
            scrollTrigger: {
              trigger: this.$refs.frameWrapper.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )
        const tweenWithoutFrame = gsap.fromTo(
          this.$refs.withoutFrame.$el,
          {
            rotate: 6,
          },
          {
            rotate: 2,
            scrollTrigger: {
              trigger: this.$refs.withoutFrame.$el,
              scrub: 0.5,
              end: 'bottom top',
            },
          }
        )

        return () => {
          tweenFrame?.kill()
          tweenWithoutFrame?.kill()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-arena-paris-basket-club {
  position: relative;
  margin-top: desktop-vw(80px);
  padding-top: desktop-vw(50px);

  @include mobile {
    margin-top: mobile-vw(50px);
    padding-top: mobile-vw(50px);
  }

  &__lottie-arrow.app-element-lottie {
    position: absolute;
    grid-column: 6 / span 1;
    width: 40%;
    top: desktop-vw(180px);
    left: desktop-vw(45px);
    transform: rotate(45deg);
    aspect-ratio: 12 / 48;
    height: auto !important;

    @include mobile {
      display: none;
    }
  }

  &__visual-transparent.app-element-kinesis {
    position: absolute;
    width: columns(1.5);
    grid-column: 6 / span 2;
    top: desktop-vw(25px);
    transform: rotate(7deg);
    aspect-ratio: 128 / 128;
    // left: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;

    @include mobile {
      aspect-ratio: 64/64;
      width: 70%;
      grid-column: 5 / span 2;
      top: mobile-vw(25px);
    }

    @include fake-transparent();

    picture {
      display: block;
      width: 55%;
      height: auto;
    }
  }

  &__visual-with-frame {
    position: relative;
    grid-column: 2 / span 4;
    aspect-ratio: 440 / 550;
    width: 100%;
    top: 0;
    left: 0;
    transform: rotate(-6deg);
    margin-bottom: desktop-vw(300px);

    @include mobile {
      grid-column: 1 / span 4;
      aspect-ratio: 210 / 260;
      margin-bottom: mobile-vw(140px);
    }

    picture {
      @include noise();
    }

    .app-element-lottie {
      width: 110%;
      top: 50%;
      left: 50%;
      height: auto;
      transform: translate(-50%, -50%) rotate(6deg);
    }
  }
  &__visual-without-frame {
    position: absolute;
    left: 0;
    grid-column: 5 / span 3;
    aspect-ratio: 280 / 380;
    width: 100%;
    top: desktop-vw(300px);
    left: 0;
    transform: rotate(2deg);

    @include mobile {
      grid-column: 4 / span 3;
      top: mobile-vw(180px);
      aspect-ratio: 150 / 205;
    }

    picture {
      @include noise();
    }
  }

  &__content {
    grid-column: 9 / span 4;

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
    }

    &__title {
      margin-bottom: desktop-vw(25px);

      .H2 {
        @include font-ITCFranklinGothicLT-DmCp();
      }

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-black);
        -webkit-text-fill-color: transparent;
      }

      @include mobile {
        margin-bottom: mobile-vw(25px);
      }
    }

    &__subtitle,
    &__paragraph.app-element-rich-text {
      opacity: 0.8;
    }

    &__subtitle {
      margin-bottom: desktop-vw(15px);

      @include mobile {
        margin-bottom: mobile-vw(25px);
      }
    }

    &__paragraph.app-element-rich-text {
      .P2 {
        font-size: desktop-vw(18px);
        @include font-ITCFranklinGothicLT-BkCp();

        @include mobile{
          font-size: mobile-vw(16px);
        }
      }
    }

    .app-atoms-link {
      margin-top: desktop-vw(50px);

      @include mobile {
        margin-top: mobile-vw(25px);
      }

      &::after {
        background: var(--c-black);
      }
    }

    .P2 {
      text-transform: initial;
    }
  }
}
</style>
