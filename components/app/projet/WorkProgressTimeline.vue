<template>
  <div class="app-projet-work-progress-timeline">
    <div class="app-projet-work-progress-timeline__line" />
    <div class="app-projet-work-progress-timeline__items">
      <div
        v-for="(item, index) in content.items"
        :key="index"
        :class="{ active: index === $parent.indexSketch }"
        class="app-projet-work-progress-timeline__item"
        @click="onChangeIndex(index)"
      >
        <TP1 weight="bold" color="grey">
          <span ref="cross" class="app-projet-work-progress-timeline__cross" />
          {{ item.work_progress_items_title }}
        </TP1>
        <TP2 color="grey">
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
      '.app-projet-work-progress-timeline__cross'
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
.app-projet-work-progress-timeline {
  grid-row: 3;
  grid-column: 1 / span 8;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @include mobile {
    display: none;
  }

  &__items {
    display: flex;
  }

  &__item {
    display: flex;
    flex-direction: column;
    flex: 1;
    cursor: pointer;
    transition: opacity 0.45s var(--ease-out-cubic);

    &:not(:last-child) {
      margin-right: desktop-vw(25px);
    }

    &:not(.active) {
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }

    .P1.bold {
      align-self: flex-start;
      position: relative;
      font-size: 16px;
      line-height: 21px;
      @include font-adihausDIN-cn-bold();
    }

    .P2.regular {
      margin-top: desktop-vw(5px);
      font-size: desktop-vw(18px);
      line-height: desktop-vw(18px);
      max-width: desktop-vw(150px);
      text-transform: uppercase;
      @include font-adihausDIN-cn();
    }
  }

  &__line {
    width: 100%;
    height: 1px;
    display: block;
    margin-bottom: desktop-vw(20px);
    background: white;
  }

  &__cross {
    position: absolute;
    bottom: calc(100% + 1.2vw);
    left: 50%;
    transform: translate(-50%, 50%);
    width: desktop-vw(25px);
    height: auto;
    display: block;

    svg {
      path {
        stroke: var(--c-white);
      }
    }
  }
}
</style>
