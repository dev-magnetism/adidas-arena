<template>
  <button 
    class="app-atoms-cta"
    :class="classes"
    :style="{
      'background-color': `var(--c-${bg})`,
      '--layer-color': `var(--c-${layerColor})`,
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"

    data-tf-popup="ZAHIdrU3" 
    data-tf-opacity="100" 
    data-tf-size="70" 
    data-tf-iframe-props="title=Test Adidas Arena" 
    data-tf-transitive-search-params 
    data-tf-medium="snippet" 
    data-tf-hidden="list_name=Les Yonex Internationaux de France,api_key=EBu7rZdGJLInGv" 
  >
    <TP2 class="app-atoms-cta__text" weight="bold" 
        :color="mousehover ? 'grey' : color"><slot /></TP2>
    <div v-if="arrow" class="app-atoms-cta__arrow">
      <SvgCtaUnion ref="arrow" :color="mousehover ? 'grey' : color" />
    </div>
    <script src="https://embed.typeform.com/next/embed.js"></script>
  </button>
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
    color: {
      type: String,
      required: false,
      default: 'grey',
    },
    layerColor: {
      type: String,
      required: false,
      default: 'red-adidas',
    },
  },
  data() {
    return {
      mousehover: false,
    }
  },
  computed: {
    classes() {
      return [
        {
          arrow: this.arrow,
        },
      ]
    },
  },
  mounted() {
    if (!this.arrow || this.$viewport.isMobile) return

    this.tl = gsap.timeline({ paused: true })

    this.tl.to(this.$refs.arrow.$el, {
      xPercent: 100,
      duration: 0.5,
      ease: 'power3.inOut',
    })
    this.tl.set(this.$refs.arrow.$el, {
      xPercent: -100,
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
      if (this.$viewport.isMobile) return
      this.mousehover = true
      this.tl?.play()
    },
    onMouseLeave() {
      if (this.$viewport.isMobile) return
      this.mousehover = false
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
  overflow: hidden;
  cursor: pointer;

  &.arrow {
    padding: desktop-vw(15px) desktop-vw(5px) desktop-vw(15px) desktop-vw(25px);

    @include mobile {
      padding: mobile-vw(18px) mobile-vw(5px) mobile-vw(18px) mobile-vw(25px);
    }
  }

  &::after {
    content: '';
    width: 100%;
    height: calc(100% + 2px);
    position: absolute;
    background: var(--c-red-adidas);
    left: 0;
    top: 0;
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.7s var(--ease-out-expo);
    will-change: transform;
  }

  @include hover {
    cursor: pointer;

    &:hover {
      &::after {
        transform: scaleY(1);
      }
    }
  }

  &__text {
    position: relative;
    z-index: 1;
    flex: 0 0 80%;
  }

  .P2,
  .P2.bold,
  .P2.medium,
  .P2.regular {
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
    z-index: 1;
    flex: 0 0 20%;

    svg {
      width: 100%;
      vertical-align: middle;
      will-change: transform;
      z-index: 1;

      @include mobile {
        padding: 0px mobile-vw(15px) mobile-vw(0px) mobile-vw(5px);
      }
    }
  }
}
</style>
