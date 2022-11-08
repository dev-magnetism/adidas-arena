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
            <TP2 color="beige" weight="bold">
              {{ contents.firstRow.surtitle }}
            </TP2>
            <TH4 color="beige" weight="bold">
              {{ contents.firstRow.title }}
            </TH4>
          </div>
          <div class="app-projet-work-progress__infos__item">
            <TP2 color="beige" weight="bold">
              {{ contents.secondRow.surtitle }}
            </TP2>
            <TH4 color="beige" weight="bold">
              {{ contents.secondRow.title }}
            </TH4>
          </div>
        </div>
        <div class="app-projet-work-progress__infos__description">
          <TP2
            class="app-projet-work-progress__infos__description__title"
            color="beige"
            weight="bold"
          >
            {{ contents.column.surtitle }}
          </TP2>
          <TP2
            class="app-projet-work-progress__infos__description__text"
            color="beige"
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
      ></div>

      <div class="app-projet-work-progress__timeline">
        <span />
        <div class="app-projet-work-progress__timeline__items">
          <div
            v-for="(item, index) in contents.items"
            :key="index"
            :class="{ active: index === indexSketch }"
            class="app-projet-work-progress__timeline__item"
            @click="onChangeIndex(index)"
          >
            <TP1 color="beige">
              <div ref="cross" class="app-projet-work-progress__cross" />
              {{ item.work_progress_items_title }}
            </TP1>
            <TP2 weight="bold" color="beige">
              {{ item.work_progress_items_subtitle }}
            </TP2>
          </div>
        </div>
      </div>
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
      lottiesAnimation: [],
      frameArena: 0,
      frameLights: 0,
      sketchVisible: false,
      lightsVisible: false,
    }
  },
  watch: {
    sketchVisible(newVal) {
      if (!newVal) return

      setTimeout(() => {
        this.lottiesAnimation[0].setSpeed(1)
        this.lottiesAnimation[0].setDirection(1)
        this.lottiesAnimation[0].play()
      }, 500)
    },
    indexSketch(newVal, oldVal) {
      const target = this.contents.items[newVal].work_progress_items_frame_start

      this.tweenArena?.kill()

      this.tweenArena = gsap.to(this, {
        frameArena: target,
        duration: Math.abs(oldVal - newVal) * 2,
        ease: 'power1.out',
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

      this.lottiesAnimation[oldVal].setSpeed(3.5)
      this.lottiesAnimation[oldVal].setDirection(-1)
      this.lottiesAnimation[oldVal].play()

      this.lottiesAnimation[newVal].setSpeed(1)
      this.lottiesAnimation[newVal].setDirection(1)
      this.lottiesAnimation[newVal].play()
    },
  },
  mounted() {
    ScrollTrigger.create({
      trigger: this.$refs.sketch,
      start: 'top center',
      onEnter: () => {
        this.sketchVisible = true
      },
      toggleActions: 'play none none none',
    })

    const lottieAnimation = require(`@/assets/lotties/Croix_01.json`)
    const lottieArena = require(`@/assets/lotties/Arena_Construct.json`)
    const lottieLights = require(`@/assets/lotties/Lights.json`)

    const crossEls = this.$el.querySelectorAll(
      '.app-projet-work-progress__cross'
    )

    crossEls.forEach((cross, index) => {
      const animation = lottie.loadAnimation({
        container: cross,
        renderer: 'svg',
        animationData: lottieAnimation,
        autoplay: false,
        loop: false,
      })

      this.lottiesAnimation.push(animation)
    })

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
      autoplay: false,
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
    onChangeIndex(index) {
      if (this.indexSketch === index) return

      this.indexSketch = index
    },
  },
}
</script>

<style lang="scss">
.app-projet-work-progress {
  margin-top: desktop-vw(195px);
  padding-top: desktop-vw(80px);
  padding-bottom: desktop-vw(80px);
  z-index: 1;
  position: relative;

  &__sketch {
    grid-row: 2;
    justify-self: center;
    width: 100%;
    grid-column: 2 / span 10;
    margin-top: desktop-vw(70px);
    margin-bottom: desktop-vw(20px);
    aspect-ratio: 1200 / 515;
    position: relative;

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
    }
  }

  &__cross {
    position: absolute;
    bottom: calc(100% + 1.2vw);
    left: 50%;
    transform: translate(-50%, 50%);
    width: desktop-vw(25px);
    height: auto;

    svg {
      path {
        stroke: var(--c-white);
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
  }

  &__timeline {
    grid-row: 3;
    grid-column: 1 / span 8;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &__items {
      display: flex;
    }

    &__item {
      display: flex;
      flex-direction: column;
      flex: 1;
      cursor: pointer;

      &:not(:last-child) {
        margin-right: desktop-vw(25px);
      }

      &:not(.active) {
        opacity: 0.5;
      }

      .P1 {
        align-self: flex-start;
        position: relative;
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);
        @include font-adihausDIN-cn-bold();
      }

      .P2 {
        margin-top: desktop-vw(5px);
        font-size: desktop-vw(18px);
        line-height: desktop-vw(18px);
        max-width: desktop-vw(150px);
        text-transform: uppercase;
        @include font-adihausDIN-cn();
      }
    }

    span {
      width: 100%;
      height: 1px;
      background: var(--c-beige);
      display: block;
      margin-bottom: desktop-vw(20px);
    }
  }

  &__bottom-description {
    grid-row: 3;
    grid-column: 10 / span 3;

    .app-element-rich-text {
      .P2.wysiwyg-text {
        text-transform: uppercase;
        @include font-adihausDIN-medium();
        color: var(--c-beige) !important;
      }
    }
  }

  &__title.app-element-rich-text {
    grid-column: 1 / span 5;
    width: 90%;

    .H1.wysiwyg-text {
      color: var(--c-beige) !important;

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-beige) !important;
      }
    }
  }

  &__infos {
    grid-column: 9 / span 4;
    display: flex;
    align-self: center;
    border: 1px solid var(--c-beige);

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
      border-right: 1px solid var(--c-beige);

      &:not(:last-child) {
        border-bottom: 1px solid var(--c-beige);
      }

      .P2 {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(16px);
        letter-spacing: -0.04em;
        @include font-adihausDIN-cn-bold();
      }

      .H4 {
        font-size: desktop-vw(24px);
        line-height: desktop-vw(20px);
        letter-spacing: -0.04em;
        margin-top: desktop-vw(5px);
        @include font-adihausDIN-cn-bold();
      }
    }

    &__description {
      flex: 1;
      padding: desktop-vw(10px) desktop-vw(12px) desktop-vw(15px)
        desktop-vw(12px);

      &__title.P2 {
        margin-bottom: desktop-vw(5px);
        font-size: desktop-vw(12px);
        line-height: desktop-vw(16px);
        letter-spacing: -0.04em;
        @include font-adihausDIN-cn-bold();
      }

      &__text {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(16px);
      }
    }
  }
}
</style>
