<template>
  <div class="app-home-hero block-inner">
    <div class="app-home-hero__inner grid">
      <ERichText class="app-home-hero__title" :content="contents.title" />
      <!-- <TH1 class="app-home-hero__title">
        <AtomsTextStroke>BIENVENUE À </AtomsTextStroke> L'ADIDAS ARENA, ICI
        C'EST CHEZ VOUS !
      </TH1> -->
      <div ref="firstVisual" class="app-home-hero__first-visual">
        <nuxt-picture
          class="picture-absolute"
          provider="directus"
          :src="contents.pictureTop.src"
          :alt="contents.pictureTop.alt"
          format="webp"
        />
      </div>
      <div ref="secondVisual" class="app-home-hero__second-visual">
        <nuxt-picture
          class="picture-absolute"
          provider="directus"
          :src="contents.pictureBottom.src"
          :alt="contents.pictureBottom.alt"
          format="webp"
        />
      </div>
      <div
        v-if="$mq !== 'sm'"
        class="app-home-hero__scroll-indicator"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <TP1>Scroll</TP1>
        <div class="app-home-hero__scroll-indicator__icon">
          <SvgHomeHeroUnion ref="union" />
        </div>
      </div>
      <div class="app-home-hero__localisation">
        <TP1 class="app-home-hero__localisation__city">
          {{ contents.city }}
        </TP1>
        <TP1 class="app-home-hero__localisation__place">
          {{ contents.localisation }}
        </TP1>
      </div>
      <div class="app-home-hero__map">
        <div class="app-home-hero__map__baseline">
          <AtomsTitleTag
            class="app-home-hero__map__coordinate"
            bg="beige"
            color="black"
            >48.897704 - 2.359456
          </AtomsTitleTag>
          <AtomsCTA
            class="app-home-hero__map__visit"
            :arrow="false"
            bg="red-adidas"
            :external="true"
            color="black"
            link="https://translate.google.fr/"
            >Visiter le lieu
          </AtomsCTA>
        </div>
        <AtomsCornerPoints />
        <nuxt-picture
          class="picture-absolute"
          src="imgs/map.png"
          format="webp"
          alt="placeholder"
        />
        <SvgHomeHeroSticker
          v-if="$mq !== 'sm'"
          class="app-home-hero__sticker"
        />
        <SvgHomeHeroStars v-if="$mq !== 'sm'" class="app-home-hero__stars" />
      </div>
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
    const mm = gsap.matchMedia()

    mm.add('(min-width: 800px)', () => {
      this.tl = gsap.timeline({ repeat: -1, paused: true })

      this.tl.to(this.$refs.union.$el, {
        yPercent: 105,
        duration: 0.675,
      })
      this.tl.set(this.$refs.union.$el, {
        yPercent: -105,
      })
      this.tl.to(this.$refs.union.$el, {
        yPercent: 0,
        duration: 0.675,
      })
    })
  },
  beforeDestroy() {
    this.tl?.kill()
  },
  methods: {
    onMouseEnter() {
      if (this.$mq === 'sm') return

      if (this.tl._repeat === 0) {
        this.tl.repeat(-1)
        this.tl.restart()
      } else {
        this.tl.play()
      }
    },
    onMouseLeave() {
      if (this.$mq === 'sm') return

      this.tl.repeat(0)
    },
  },
}
</script>

<style lang="scss" scoped>
.app-home-hero {
  width: 100%;
  height: 100vh;
  padding-top: desktop-vw(40px);
  padding-bottom: desktop-vw(40px);

  @include mobile {
    height: 100%;
    padding-top: mobile-vw(190px);
    padding-bottom: 0px;
  }

  &__inner {
    width: 100%;
    height: 100%;
    border: 1px solid #181818;
    position: relative;

    @include mobile {
      border: none;
    }
  }

  &__sticker {
    position: absolute;
    grid-column: 8 / span 5;
    transform: translate(-50%, -50%);
    top: 30%;
    left: 0;
    z-index: 9;

    @include mobile {
      display: none;
    }
  }

  &__stars {
    position: absolute;
    grid-column: 7 / span 2;
    transform: translate(-50%, -50%);
    left: -12%;
    top: 17%;
    z-index: 9;

    @include mobile {
      display: none;
    }
  }

  &__map {
    grid-column: 8 / span 5;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    aspect-ratio: 575/725;
    height: auto;
    position: relative;
    right: 0;
    bottom: 0;
    width: 100%;
    max-height: calc(85vh - desktop-vw(80px));

    @include mobile {
      grid-column: 1 / span 6;
      height: auto;
      aspect-ratio: 345 / 665;
      margin-top: mobile-vw(135px);
      width: 100%;
    }

    @include desktop {
      .app-atoms-corner-points {
        border-bottom: none !important;
        border-right: none !important;
      }
    }

    &__baseline {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: desktop-vw(0px) desktop-vw(20px) desktop-vw(20px)
        desktop-vw(20px);
      z-index: 1;
      position: absolute;
      bottom: 0;
      left: 0;

      @include mobile {
        height: 100%;
        padding: mobile-vw(18px) mobile-vw(18px) mobile-vw(18px) mobile-vw(18px);
      }
    }

    &__coordinate,
    &__visit {
      padding: desktop-vw(10px) desktop-vw(15px);

      @include mobile {
        padding: mobile-vw(10px) mobile-vw(15px);
      }

      > :first-child {
        @include font-adihausDIN-medium();
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);

        @include mobile {
          font-size: mobile-vw(16px);
          line-height: mobile-vw(16px);
        }
      }
    }

    &__coordinate {
      @include mobile {
        align-self: flex-start;
      }
    }

    &__visit {
      @include mobile {
        align-self: flex-end;
      }
      > :first-child {
        @include font-adihausDIN-cn-medium();
      }
    }
  }

  &__title.app-element-rich-text {
    grid-column: 2 / span 6;
    align-self: center;
    z-index: 1;
    max-width: min(565px, desktop-vw(565px));
    // font-size: min(130px, desktop-vw(130px));
    // line-height: min(140px, desktop-vw(140px));

    .H1,
    h1 {
      font-size: min(130px, desktop-vw(130px)) !important;
      line-height: min(140px, desktop-vw(140px)) !important;

      @include mobile {
        font-size: min(80px, mobile-vw(80px)) !important;
        line-height: min(86px, mobile-vw(86px)) !important;
      }
    }

    @include mobile {
      grid-column: 1 / span 6;
      max-width: 100%;
    }
  }

  &__first-visual {
    position: absolute !important;
    left: 0;
    top: desktop-vw(-250px);
    // max-width: 350px;
    min-width: 250px;
    grid-column: 1 / span 3;
    width: 100%;
    aspect-ratio: 350 / 440;
    transform: rotate(5deg);

    @include mobile {
      grid-column: 1 / span 4;
      width: 80%;
      min-width: 75%;
      aspect-ratio: 185 / 235;
      top: mobile-vw(-225px);
    }
  }
  &__second-visual {
    position: absolute !important;
    left: 0;
    bottom: calc(min(-20px, desktop-vw(65px)));
    grid-column: 4 / span 3;
    width: 75%;
    min-width: 200px;
    aspect-ratio: 255 / 320;
    transform: rotate(-6deg);

    @include mobile {
      grid-column: 4 / span 2;
      width: 100%;
      min-width: 100%;
      aspect-ratio: 115 / 145;
      top: mobile-vw(300px);
    }
  }

  &__localisation {
    position: absolute;
    bottom: 15px;
    left: 0;
    grid-column: 2 / span 6;
    display: flex;
    flex-direction: column;

    @include mobile {
      display: none;
    }

    &__city {
      @include font-adihausDIN-bold();
    }
    &__place {
    }
  }

  &__scroll-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: desktop-vw(25px) desktop-vw(15px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #181818;
    border-right: 1px solid #181818;

    @include mobile {
      display: none;
    }

    .P1 {
      font-size: 12px;
      line-height: 15px;
    }

    &__icon {
      margin-top: desktop-vw(25px);
      overflow: hidden;
    }

    svg {
      // margin-top: desktop-vw(25px);
    }
  }
}
</style>
