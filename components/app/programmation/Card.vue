<template>
  <div :style="bgColor" class="app-programmation-card">
    <div class="app-programmation-card__visual">
      <div :class="{ visible }" class="app-programmation-card__layer" />

      <nuxt-picture
        provider="directus"
        sizes="sm:100vw md:40vw"
        :src="content.visual"
        :alt="`visual-${content.name}`"
        loading="lazy"
      />
    </div>

    <div class="app-programmation-card__informations">
      <div class="app-programmation-card__head">
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
        class="app-programmation-card__from-price"
        weight="medium"
        :color="whitedTexts ? 'white' : 'black'"
      >
        À partir de {{ content.from_price }}€
      </TP2>

      <a
        class="app-programmation-card__cta"
        :href="content.link"
        target="_blank"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <SvgCtaUnion ref="arrow" :color="ctaColor" />
      </a>
    </div>
    <span v-if="content.full" class="app-programmation-card__full">
      <TP2 weight="bold" :color="ctaColor">Complet</TP2>
    </span>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    theme() {
      return Math.random() < 0.5 ? 'red' : Math.random() < 0.5 ? 'blue' : 'grey'
    },
    bgColor() {
      return {
        '--bg':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
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

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.$el,
      start: 'top+=20% bottom',
      toggleActions: 'play none none none',
      onToggle: () => {
        this.visible = true
      },
    })

    this.initTimelineArrow()
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()
    this.tlArrow?.kill()
  },
  methods: {
    onMouseEnter() {
      if (this.$viewport.isMobile) return

      this.tlArrow?.play()
    },
    onMouseLeave() {
      if (this.$viewport.isMobile) return

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
  },
}
</script>

<style lang="scss">
.app-programmation-card {
  grid-column: span 4;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--c-black);
  background-color: var(--bg);

  @include mobile {
    grid-column: span 6;
    padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(15px) mobile-vw(15px);
  }

  &:nth-child(3n + 1) {
    .app-programmation-card__layer {
      transition-delay: 0.1s;
    }
  }
  &:nth-child(3n + 2) {
    .app-programmation-card__layer {
      transition-delay: 0.3s;
    }
  }
  &:nth-child(3n + 3) {
    .app-programmation-card__layer {
      transition-delay: 0.5s;
    }
  }

  &__layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg);
    z-index: 9999;
    transform: scaleY(1);
    transform-origin: center bottom;
    transition: transform 0.8s var(--ease-in-out-cubic);

    &.visible {
      transform: scaleY(0);
    }

    @include mobile {
      display: none;
    }
  }

  &__full {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--c-grey);
    border: 1px solid var(--c-black);
    display: block;
    border-top: none;
    border-right: none;
    padding: desktop-vw(5px) desktop-vw(8px);

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

  picture {
    aspect-ratio: 435 / 435;
    width: 100%;
    display: block;
    position: relative;
    @include noise();

    img {
      display: block;
    }
  }

  &__informations {
    display: flex;
    flex-direction: column;
    padding: desktop-vw(15px) desktop-vw(25px);
    height: 100%;
    border-top: 1px solid var(--c-black);

    @include mobile {
      padding: 0px;
      margin-top: mobile-vw(15px);
      border-top: 0px solid var(--c-black);
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
