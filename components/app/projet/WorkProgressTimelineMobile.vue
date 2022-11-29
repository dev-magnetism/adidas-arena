<template>
  <div class="app-projet-work-progress-timeline-mobile">
    <span />
    <div class="app-projet-work-progress-timeline-mobile__items">
      <div
        v-for="(item, index) in content.items"
        :key="index"
        :class="{ active: index === $parent.indexSketch }"
        class="app-projet-work-progress-timeline-mobile__item"
        @click="onChangeIndex(index)"
      >
        <TP1 color="beige">
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
</template>

<script>
import lottie from 'lottie-web'

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

    const crossEls = this.$el.querySelectorAll(
      '.app-projet-work-progress-timeline-mobile__cross'
    )

    crossEls.forEach((cross, index) => {
      const animation = lottie.loadAnimation({
        container: cross,
        renderer: 'svg',
        animationData: lottieAnimation,
        autoplay: false,
        loop: false,
      })

      this.lottiesCross.push(animation)
    })
  },
  beforeDestroy() {
    this.lottiesCross.forEach((lottie) => {
      lottie.destroy()
    })
  },
  methods: {
    onChangeIndex(index) {
      if (this.$parent.indexSketch === index) return

      this.lottiesCross[this.$parent.indexSketch].setSpeed(3.5)
      this.lottiesCross[this.$parent.indexSketch].setDirection(-1)
      this.lottiesCross[this.$parent.indexSketch].play()

      this.$emit('indexChanged', index)

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
  overflow: hidden;
  grid-row: 4;
  margin-top: mobile-vw(65px);

  @include desktop {
    display: none;
  }

  &__items {
    display: inline-flex;
    //  column-gap: var(--layout-columns-gap);
    flex-direction: row;
    will-change: transform;
  }

  &__item {
    display: flex;
    flex-direction: column;
    flex: 1;
    cursor: pointer;
    width: 40vw;

    &:not(:last-child) {
      margin-right: desktop-vw(25px);
    }

    &:not(.active) {
      opacity: 0.5;
    }

    .P1 {
      align-self: flex-start;
      position: relative;
      font-size: 16px;
      line-height: 21px;
      @include font-adihausDIN-cn-bold();
    }

    .P2 {
      margin-top: desktop-vw(5px);
      font-size: mobile-vw(18px);
      line-height: mobile-vw(18px);
      max-width: 100%;
      text-transform: uppercase;
      @include font-adihausDIN-cn();
    }
  }

  span {
    width: 100%;
    height: 1px;
    background: var(--c-beige);
    display: block;
    margin-bottom: mobile-vw(20px);
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
}
</style>
