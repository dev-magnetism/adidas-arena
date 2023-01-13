<template>
  <div class="app-projet-work-progress">
    <div class="app-projet-work-progress__inner grid-inner">
      <ERichText
        class="app-projet-work-progress__title"
        :content="contents.title"
      />
      <div class="app-projet-work-progress__infos">
        <div class="app-projet-work-progress__infos__items">
          <div class="app-projet-work-progress__infos__item">
            <TP2 color="grey" weight="bold">
              {{ contents.firstRow.surtitle }}
            </TP2>
            <TH4 color="grey" weight="bold">
              {{ contents.firstRow.title }}
            </TH4>
          </div>
          <div class="app-projet-work-progress__infos__item">
            <TP2 color="grey" weight="bold">
              {{ contents.secondRow.surtitle }}
            </TP2>
            <TH4 color="grey" weight="bold">
              {{ contents.secondRow.title }}
            </TH4>
          </div>
        </div>
        <div class="app-projet-work-progress__infos__description">
          <TP2
            class="app-projet-work-progress__infos__description__title"
            color="grey"
            weight="bold"
          >
            {{ contents.column.surtitle }}
          </TP2>
          <TP2
            class="app-projet-work-progress__infos__description__text"
            color="grey"
          >
            {{ contents.column.description }}
          </TP2>
        </div>
      </div>

      <div
        ref="sketch"
        :class="{
          'is-visible': sketchVisible,
          'lights-visible': lightsVisible,
        }"
        class="app-projet-work-progress__sketch"
      />

      <AppProjetWorkProgressTimeline
        v-if="!$viewport.isMobile"
        ref="timeline"
        :content="timelineContent"
        @indexChanged="onIndexChanged"
      />
      <AppProjetWorkProgressTimelineMobile
        v-else
        :content="timelineContent"
        @indexChanged="onIndexChanged"
      />

      <div class="app-projet-work-progress__bottom-description">
        <ERichText :split="false" :content="contents.description" />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      indexSketch: 0,
      frameArena: 0,
      frameLights: 0,
      sketchVisible: false,
      lightsVisible: false,
    }
  },
  computed: {
    timelineContent() {
      return {
        items: this.contents.items,
      }
    },
  },
  watch: {
    sketchVisible(newVal) {
      if (!newVal || this.$viewport.isMobile) return

      setTimeout(() => {
        this.$refs.timeline.lottiesCross[0].setSpeed(1)
        this.$refs.timeline.lottiesCross[0].setDirection(1)
        this.$refs.timeline.lottiesCross[0].play()
      }, 500)
    },

    indexSketch(newVal, oldVal) {
      const target =
        this.timelineContent.items[newVal].work_progress_items_frame_start

      this.tweenArena?.kill()

      const multiplicator = this.$viewport.isMobile ? 1.5 : 2
      const ease = this.$viewport.isMobile ? 'power2.out' : 'power1.out'

      this.tweenArena = gsap.to(this, {
        frameArena: target,
        duration: Math.abs(oldVal - newVal) * multiplicator,
        ease,
        onUpdate: () => {
          this.animationArena.goToAndStop(this.frameArena, true)
        },
      })

      if (newVal === 3 || newVal === 4) {
        this.lightsVisible = true
        this.tweenLights.play()
      } else {
        this.lightsVisible = false
        this.tweenLights.pause()
      }
    },
  },
  mounted() {
    if (!this.$viewport.isMobile) {
      ScrollTrigger.create({
        trigger: this.$refs.sketch,
        start: this.$viewport.isMobile ? 'top center' : 'top+=25% center',
        onEnter: () => {
          this.sketchVisible = true
        },
        toggleActions: 'play none none none',
      })
    } else {
      this.sketchVisible = true
    }

    const lottieArena = require(`@/assets/lotties/Arena_Construct.json`)
    const lottieLights = require(`@/assets/lotties/Lights.json`)

    this.animationArena = lottie.loadAnimation({
      container: this.$refs.sketch,
      renderer: 'svg',
      animationData: lottieArena,
      autoplay: false,
      loop: false,
    })

    this.animationLight = lottie.loadAnimation({
      container: this.$refs.sketch,
      renderer: 'svg',
      animationData: lottieLights,
      autoplay: false,
      loop: false,
    })

    this.tweenLights = gsap.to(this, {
      frameLights: this.animationLight.totalFrames - 1,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      paused: true,
      ease: 'power1.out',
      onUpdate: () => {
        this.animationLight.goToAndStop(this.frameLights, true)
      },
    })
  },
  beforeDestroy() {
    this.animationArena.destroy()
    this.animationLight.destroy()
    this.tweenLights?.kill()
    this.tweenArena?.kill()
  },
  methods: {
    onIndexChanged(index) {
      this.indexSketch = index
    },
  },
}
</script>

<style lang="scss">
.app-projet-work-progress {
  margin-top: desktop-vw(195px);
  padding-top: desktop-vw(60px);
  padding-bottom: desktop-vw(60px);
  z-index: 1;
  position: relative;

  @include mobile {
    margin-top: mobile-vw(100px);
    padding-top: mobile-vw(60px);
    padding-bottom: mobile-vw(60px);
  }

  &__sketch {
    grid-row: 2;
    justify-self: center;
    width: 100%;
    grid-column: 1 / span 12;
    margin-top: desktop-vw(40px);
    aspect-ratio: 1200 / 515;
    position: relative;

    @include mobile {
      grid-row: 3;
      grid-column: 1 / span 6;
      margin-top: desktop-vw(0px);
      aspect-ratio: 345 / 145;
      overflow: hidden;
    }

    &.is-visible {
      svg {
        &:nth-child(1) {
          opacity: 1;
        }
      }
    }
    &.lights-visible {
      svg {
        &:nth-child(2) {
          opacity: 1;
        }
      }
    }

    svg {
      position: absolute;
      opacity: 0;
      transition: opacity 0.7s var(--ease-out-cubic);

      @include mobile {
        transform: scale(1.3) !important;
      }
    }
  }

  &::before {
    content: '';
    display: block;
    background: linear-gradient(
        rgba(251, 245, 238, 0.01) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.01) 0.1em, transparent 0.1em);
    background-size: 2em 2em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    @include mobile {
      background-size: 1em 1em;
    }
  }
  &::after {
    content: '';
    display: block;
    background: radial-gradient(
      53.1% 72.86% at 70.11% 37.32%,
      #2929d2 0%,
      #343472 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
  }

  &__inner {
    position: relative;
    row-gap: 0;
  }

  &__bottom-description {
    grid-row: 3;
    grid-column: 10 / span 3;

    @include mobile {
      grid-row: 5;
      grid-column: 1 / span 6;
      margin-top: mobile-vw(65px);
    }

    .app-element-rich-text {
      .P2.wysiwyg-text {
        text-transform: uppercase;
        @include font-adihausDIN-medium();
        color: var(--c-grey) !important;
      }
    }
  }

  &__title.app-element-rich-text {
    grid-column: 1 / span 5;
    width: 90%;

    @include mobile {
      grid-column: 1 / span 6;
      width: 80%;
      grid-row: 1;
    }

    .H1.wysiwyg-text {
      color: var(--c-grey) !important;
      @include font-adihausDIN-cn-bold();

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-grey) !important;
      }
    }
  }

  &__infos {
    grid-column: 9 / span 4;
    display: flex;
    align-self: center;
    border: 1px solid var(--c-grey);

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
      margin-top: mobile-vw(15px);
      margin-bottom: mobile-vw(50px);
    }

    &__items {
      flex: 2;
      display: flex;
      flex-direction: column;
    }

    &__item {
      padding: desktop-vw(10px) desktop-vw(12px);
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-right: 1px solid var(--c-grey);

      @include mobile {
        padding: mobile-vw(10px) mobile-vw(12px);
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--c-grey);
      }

      .P2 {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(16px);
        letter-spacing: -0.04em;
        text-transform: uppercase;
        @include font-adihausDIN-cn-bold();

        @include mobile {
          font-size: mobile-vw(12px);
          line-height: mobile-vw(16px);
        }
      }

      .H4 {
        font-size: desktop-vw(24px);
        line-height: desktop-vw(20px);
        letter-spacing: -0.04em;
        margin-top: desktop-vw(5px);
        @include font-adihausDIN-cn-bold();

        @include mobile {
          font-size: mobile-vw(24px);
          line-height: mobile-vw(20px);
          margin-top: 0px;
        }
      }
    }

    &__description {
      flex: 1;
      padding: desktop-vw(10px) desktop-vw(12px) desktop-vw(15px)
        desktop-vw(12px);

      @include mobile {
        padding: mobile-vw(10px) mobile-vw(12px);
      }

      &__title.P2 {
        margin-bottom: desktop-vw(5px);
        font-size: desktop-vw(12px);
        line-height: desktop-vw(16px);
        letter-spacing: -0.04em;
        @include font-adihausDIN-cn-bold();
        text-transform: uppercase;

        @include mobile {
          font-size: mobile-vw(12px);
          line-height: mobile-vw(16px);
        }
      }

      &__text {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(16px);

        @include mobile {
          font-size: mobile-vw(12px);
          line-height: mobile-vw(16px);
        }
      }
    }
  }
}
</style>
