<template>
  <SmartLink
    class="app-atoms-cta"
    :class="classes"
    :style="{
      'background-color': `var(--c-${bg})`,
      '--color-underline': `var(--c-${color})`,
    }"
    :href="link"
    :internal="!external"
    :external="external"
    :blank="target"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <TP2 class="app-atoms-cta__text" weight="bold" :color="color"><slot /></TP2>
    <div v-if="arrow" class="app-atoms-cta__arrow">
      <SvgCtaUnion ref="arrow" :color="color" />
    </div>
  </SmartLink>
</template>

<script>
import { gsap } from 'gsap'
export default {
  props: {
    arrow: {
      type: Boolean,
      required: false,
      default: true,
    },
    bg: {
      type: String,
      required: false,
      default: 'blue-adidas',
    },
    external: {
      type: Boolean,
      required: false,
      default: false,
    },
    link: {
      type: String,
      required: false,
      default: undefined,
    },
    color: {
      type: String,
      required: false,
      default: 'beige',
    },
    target: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    classes() {
      return [
        {
          arrow: this.arrow,
          // medium: this.weight === 'medium',
        },
      ]
    },
  },
  mounted() {
    if (!this.arrow) return

    this.tl = gsap.timeline({ paused: true })

    this.tl.to(this.$refs.arrow.$el, {
      xPercent: 75,
      duration: 0.5,
      ease: 'power3.inOut',
    })
    this.tl.set(this.$refs.arrow.$el, {
      xPercent: -75,
    })
    this.tl.to(this.$refs.arrow.$el, {
      xPercent: 0,
      duration: 0.25,
      ease: 'power3.out',
    })
  },
  beforeDestroy() {
    this.tl?.kill()
  },
  methods: {
    onMouseEnter() {
      this.tl?.play()
    },
    onMouseLeave() {
      this.tl?.reverse()
    },
  },
}
</script>

<style lang="scss">
.app-atoms-cta {
  border: 1px solid var(--c-black);
  padding: desktop-vw(15px) desktop-vw(25px);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &.arrow {
    padding: desktop-vw(15px) desktop-vw(0px) desktop-vw(15px) desktop-vw(25px);

    @include mobile {
      padding: mobile-vw(18px) mobile-vw(0px) mobile-vw(18px) mobile-vw(25px);
    }
  }

  @include hover {
    cursor: pointer;

    &:hover {
      .app-atoms-cta__text {
        &::after {
          transform: scaleX(1) !important;
        }
      }
    }
  }

  &__text {
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      position: absolute;
      background: var(--color-underline);
      bottom: -3px;
      left: 0;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.4s var(--ease-out-cubic);
      will-change: transform;

      @include mobile {
        transform: scaleX(1);
      }
    }
  }

  .P2 {
    font-size: desktop-vw(24px);
    line-height: desktop-vw(32px);
    text-transform: uppercase;
    @include font-adihausDIN-cn-bold();

    @include mobile {
      font-size: mobile-vw(24px);
      line-height: mobile-vw(32px);
    }
  }

  &__arrow {
    overflow: hidden;

    svg {
      padding: 0px desktop-vw(15px);
      width: 100%;
      vertical-align: middle;
      will-change: transform;

      @include mobile {
        padding: 0px mobile-vw(15px) mobile-vw(0px) mobile-vw(5px);
      }
    }
  }
}
</style>
