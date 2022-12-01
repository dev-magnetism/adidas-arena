<template>
  <div class="app-projet-work-progress-timeline-mobile full-width">
    <div class="app-projet-work-progress-timeline-mobile__line" />
    <div
      ref="wrapper"
      class="app-projet-work-progress-timeline-mobile__wrapper"
    >
      <div ref="items" class="app-projet-work-progress-timeline-mobile__items">
        <div
          v-for="(item, index) in content.items"
          ref="item"
          :key="index"
          :class="{ active: index === $parent.indexSketch }"
          class="app-projet-work-progress-timeline-mobile__item"
          @click="onChangeIndex(index)"
        >
          <TP1 weight="bold" color="beige">
            <div
              ref="cross"
              class="app-projet-work-progress-timeline-mobile__cross"
            />
            {{ item.work_progress_items_title }}
          </TP1>
          <TP2 color="beige">
            {{ item.work_progress_items_subtitle }}
          </TP2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web'
import EmblaCarousel from 'embla-carousel'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      lottiesCross: [],
    }
  },
  mounted() {
    const lottieAnimation = require(`@/assets/lotties/Croix_01.json`)

    this.embla = EmblaCarousel(this.$refs.wrapper, {
      skipSnaps: true,
      align: 'center',
    })

    this.embla.on('select', this.onScrollSnap)

    const crossEls = this.$el.querySelectorAll(
      '.app-projet-work-progress-timeline-mobile__cross'
    )

    crossEls.forEach((cross, index) => {
      const animation = lottie.loadAnimation({
        container: cross,
        renderer: 'svg',
        animationData: lottieAnimation,
        autoplay: index === 0,
        loop: false,
      })

      this.lottiesCross.push(animation)
    })
  },
  beforeDestroy() {
    this.embla.off('select', this.onScrollSnap)

    this.lottiesCross.forEach((lottie) => {
      lottie.destroy()
    })
  },
  methods: {
    onScrollSnap() {
      this.lottiesCross[this.$parent.indexSketch].setSpeed(3.5)
      this.lottiesCross[this.$parent.indexSketch].setDirection(-1)
      this.lottiesCross[this.$parent.indexSketch].play()

      const index = this.embla.selectedScrollSnap()

      this.$emit('indexChanged', index)

      this.lottiesCross[this.$parent.indexSketch].setSpeed(1)
      this.lottiesCross[this.$parent.indexSketch].setDirection(1)
      this.lottiesCross[this.$parent.indexSketch].play()
    },
    onChangeIndex(index) {
      if (this.$parent.indexSketch === index) return

      this.lottiesCross[this.$parent.indexSketch].setSpeed(3.5)
      this.lottiesCross[this.$parent.indexSketch].setDirection(-1)
      this.lottiesCross[this.$parent.indexSketch].play()

      this.$emit('indexChanged', index)

      this.embla.scrollTo(index)

      this.lottiesCross[this.$parent.indexSketch].setSpeed(1)
      this.lottiesCross[this.$parent.indexSketch].setDirection(1)
      this.lottiesCross[this.$parent.indexSketch].play()
    },
  },
}
</script>

<style lang="scss">
.app-projet-work-progress-timeline-mobile {
  grid-column: 1 / span 6;
  grid-row: 4;
  padding-top: mobile-vw(65px);
  width: 100vw;
  position: relative;
  overflow: hidden;

  @include desktop {
    display: none;
  }

  &__wrapper {
    position: relative;
    width: 100%;
  }

  &__line {
    position: absolute;
    top: 12vw;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--c-beige);
  }

  &__items {
    display: flex;
    flex-direction: row;
    will-change: transform;
    column-gap: mobile-vw(30px);
  }

  &__item {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    text-align: center;
    flex: 0 0 37.5%;

    &:not(.active) {
      opacity: 0.5;
    }

    .P1.bold {
      position: relative;
      font-size: 16px;
      line-height: 21px;
      @include font-adihausDIN-cn-bold();
    }

    .P2.regular {
      margin-top: desktop-vw(5px);
      font-size: mobile-vw(18px);
      line-height: mobile-vw(18px);
      max-width: 100%;
      text-transform: uppercase;
      @include font-adihausDIN-cn();
    }
  }

  &__cross {
    position: absolute;
    bottom: calc(100% + 4.5vw);
    left: 50%;
    transform: translate(-50%, 50%);
    width: mobile-vw(20px);
    height: auto;

    svg {
      path {
        stroke: var(--c-white);
      }
    }
  }
}
</style>
