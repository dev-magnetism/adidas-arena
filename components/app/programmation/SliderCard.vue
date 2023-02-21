<template>
  <div :style="styles" class="app-programmation-slider-card">
    <div class="app-programmation-slider-card__visual">
      <div class="app-programmation-slider-card__visual__wrapper">
        <div
          :class="{ visible }"
          class="app-programmation-slider-card__layer"
        />
        <nuxt-picture
          class="app-programmation-slider-card__visual__picture"
          provider="directus"
          sizes="sm:100vw md:25vw"
          :src="content.visual"
          :alt="`visual-${content.name}`"
        />
      </div>
    </div>

    <div class="app-programmation-slider-card__informations">
      <div class="app-programmation-slider-card__head">
        <TP2
          class="type"
          weight="bold"
          :color="whitedTexts ? 'white' : 'black'"
        >
          {{ content.type }}
        </TP2>
        <TP2
          class="date"
          weight="medium"
          :color="whitedTexts ? 'white' : 'black'"
        >
          {{ content.date }}
        </TP2>
      </div>
      <TH2 :color="whitedTexts ? 'white' : 'black'" weight="bold">
        {{ content.name }}
      </TH2>

      <TP2
        class="app-programmation-slider-card__from-price"
        weight="medium"
        :color="whitedTexts ? 'white' : 'black'"
      >
        À partir de {{ content.from_price }}€
      </TP2>

      <a
        class="app-programmation-slider-card__cta"
        :href="content.link"
        target="_blank"
        @click.stop="() => {}"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <SvgCtaUnion ref="arrow" :color="ctaColor" />
      </a>
    </div>
    <span
      :class="{ full: content.full }"
      class="app-programmation-slider-card__full"
    >
      <TP2 weight="bold" :color="ctaColor">Complet</TP2>
    </span>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapMutations } from 'vuex'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: 'red',
    },
    rotateNegative: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    styles() {
      return {
        '--bg':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
        '--rotation': `${
          this.genRand(1, 2.5, 2) * (this.rotateNegative ? -1 : 1)
        }deg`,
      }
    },

    ctaColor() {
      return this.theme === 'blue'
        ? 'blue-adidas'
        : this.theme === 'red'
        ? 'red-adidas'
        : 'black'
    },
    whitedTexts() {
      return this.theme === 'blue' || this.theme === 'red'
    },
  },
  mounted() {
    if (this.$viewport.isMobile) return

    this.initTimelineArrow()
  },
  beforeDestroy() {
    this.tlArrow?.kill()
  },
  methods: {
    onMouseEnter() {
      if (this.$viewport.isMobile) return

      this.setCursorState('hide')

      this.tlArrow?.play()
    },
    onMouseLeave() {
      if (this.$viewport.isMobile) return

      this.setCursorState('slider')

      this.tlArrow?.reverse()
    },
    initTimelineArrow() {
      if (this.$viewport.isMobile) return

      this.tlArrow = gsap.timeline({ paused: true })

      this.tlArrow.to(this.$refs.arrow.$el, {
        x: `${this.$viewport.width * 0.048611111111}px`, // width cta
        duration: 0.5,
        ease: 'power3.inOut',
      })

      this.tlArrow.set(this.$refs.arrow.$el, {
        x: `${this.$viewport.width * -0.048611111111}px`, // width cta
      })

      this.tlArrow.to(this.$refs.arrow.$el, {
        x: 0,
        duration: 0.25,
        ease: 'power3.out',
      })
    },
    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
    ...mapMutations({
      setCursorState: 'setCursorState',
      setCursorSliderHold: 'setCursorSliderHold',
      setCursorSliderDisabled: 'setCursorSliderDisabled',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation-slider-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  position: relative;
  border: 1px solid var(--c-black);
  transform: rotate(var(--rotation));
  flex: 0 0 32.5%;
  min-width: 0;

  &:nth-child(2n + 2) {
    top: desktop-vw(50px);

    @include mobile {
      top: mobile-vw(30px);
    }
  }

  &:first-child {
    margin-left: var(--layout-margin);

    @include mobile {
      margin-left: var(--layout-margin);
    }
  }

  &:last-child {
    margin-right: var(--layout-margin);

    @include mobile {
      margin-right: var(--layout-margin);
    }
  }

  @include mobile {
    flex: 0 0 75%;
  }

  &__full {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--c-grey);
    border: 1px solid var(--c-black);
    border-top: none;
    border-right: none;
    padding: desktop-vw(5px) desktop-vw(8px);
    display: none;

    &.full {
      display: block;
    }

    @include mobile {
      padding: mobile-vw(5px) mobile-vw(8px);
    }

    .P2 {
      text-transform: uppercase;
    }
  }

  &__visual {
    width: 100%;
    display: block;
    position: relative;
    z-index: 0;
  }

  &__visual__wrapper {
    aspect-ratio: 435/435;
    width: 100%;
    display: block;
    position: relative;
    overflow: hidden;
    overflow: hidden;
  }

  picture {
    width: 100%;
    display: block;
    position: relative;
    height: 100%;
    @include noise();
    will-change: transform;

    img {
      display: block;
      transform: scale(1.3);
      transition: transform 0.95s var(--ease-out-quart);
    }
  }

  &__informations {
    display: flex;
    flex-direction: column;
    padding: desktop-vw(15px) desktop-vw(25px);
    height: 100%;
    border-top: 1px solid var(--c-black);

    @include mobile {
      padding: mobile-vw(15px) mobile-vw(15px);
      margin-top: mobile-vw(0px);
    }
  }

  &__head {
    display: flex;
    justify-content: space-between;

    .P2 {
      text-transform: uppercase;
    }
    .type {
    }

    .date {
    }
  }

  .H2.bold {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    margin-top: desktop-vw(5px);
    margin-bottom: desktop-vw(40px);

    @include mobile {
      margin-top: mobile-vw(5px);
      margin-bottom: mobile-vw(40px);
      font-size: mobile-vw(46px);
      line-height: mobile-vw(42px);
    }
  }

  &__from-price.P2 {
    margin-top: auto;
  }

  &__cta {
    position: absolute;
    bottom: 0;
    height: desktop-vw(55px);
    width: desktop-vw(70px);
    background: var(--c-grey);
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--c-black);
    border-right: none;
    border-bottom: none;
    overflow: hidden;

    @include mobile {
      height: mobile-vw(50px);
      width: mobile-vw(55px);
    }
  }
}
</style>
