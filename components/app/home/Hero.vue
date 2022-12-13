<template>
  <div class="app-home-hero block-inner">
    <div class="app-home-hero__inner grid">
      <ERichText class="app-home-hero__title" :content="contents.title" />

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
        v-if="!$viewport.isMobile"
        class="app-home-hero__scroll-indicator"
        @click="onClickScrollIndicator"
      >
        <TP1>{{ contents.scroll }}</TP1>
        <div class="app-home-hero__scroll-indicator__icon">
          <SvgHomeHeroUnion ref="union" />
        </div>
      </div>
      <div class="app-home-hero__localisation">
        <TP1 weight="bold" class="app-home-hero__localisation__city">
          {{ contents.city }}
        </TP1>
        <TP1 class="app-home-hero__localisation__place">
          {{ contents.localisation }}
        </TP1>
      </div>
      <div ref="view" class="app-home-hero__view-exterior">
        <div class="app-home-hero__view-exterior__baseline">
          <AtomsTitleTag
            class="app-home-hero__view-exterior__coordinate"
            bg="beige"
            color="black"
          >
            {{ contents.coordinate }}
          </AtomsTitleTag>
          <AtomsCTA
            class="app-home-hero__view-exterior__visit"
            :arrow="false"
            bg="red-adidas"
            :external="true"
            color="black"
            link="https://translate.google.fr/"
          >
            {{ contents.visit }}
          </AtomsCTA>
        </div>
        <AtomsCornerPoints />

        <SvgHomeHeroSticker
          v-if="!$viewport.isMobile"
          class="app-home-hero__sticker"
        />
        <SvgHomeHeroStars
          v-if="!$viewport.isMobile"
          class="app-home-hero__stars"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      exteriorVisible: (state) => state.exteriorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
    }),
  },
  mounted() {
    this.initScrollTrigger()

    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(this.$refs.view)

    this.$raf.add(`home-hero`, this.onFrame)
  },
  beforeDestroy() {
    this.resizeObserver.unobserve(this.$refs.view)

    this.tl?.kill()

    this.$raf.remove(`home-hero`, this.onFrame)
  },
  methods: {
    onFrame() {
      if (!window.lenis && !this.exteriorVisible) return

      const { exterior, camera, renderer, scissors } = useWebGL()

      exterior.position.y =
        window.lenis.scroll / (camera.zoom - camera.zoom * 0.125)

      scissors.current.y = window.lenis.scroll + scissors.mask?.y

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    onResize() {
      const { left, top, height, width } =
        this.$refs.view.getBoundingClientRect()

      const { scissors, renderer } = useWebGL()

      scissors.mask = {
        x: left,
        y: this.$viewport.height - top - height,
        width,
        height,
      }

      scissors.current = { ...scissors.mask }

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    initScrollTrigger() {
      ScrollTrigger.create({
        trigger: this.$el,
        start: 'top bottom',
        end: 'bottom+=15% top',
        onToggle: (self) => this.setExteriorVisible(self.isActive),
      })

      gsap.to(this.$refs.firstVisual, {
        yPercent: -50,
        rotate: -6,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: 'top top',
        },
      })

      gsap.to(this.$refs.secondVisual, {
        yPercent: -50,
        rotate: 6,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: 'top top',
        },
      })

      if (!this.$viewport.isMobile) {
        this.tl = gsap.timeline({ repeat: -1, repeatDelay: 5 })

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
          delay: 0.15,
        })
      }
    },
    onClickScrollIndicator() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-home-presentation', {
        duration: 1.2,
      })
    },
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
    }),
  },
}
</script>

<style lang="scss">
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

  &__view-exterior {
    grid-column: 8 / span 5;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    aspect-ratio: 575/725;
    height: auto;
    position: absolute;
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
      flex-direction: row;

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
        flex-direction: column;
      }
    }

    &__coordinate.app-atoms-title-tag,
    &__visit.app-atoms-cta {
      padding: desktop-vw(10px) desktop-vw(15px);
      display: block;

      @include mobile {
        padding: mobile-vw(10px) mobile-vw(15px);
      }

      .P2.bold {
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
        display: block;
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
    @include noise();

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
    @include noise();

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
