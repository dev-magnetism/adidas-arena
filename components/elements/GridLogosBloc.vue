<template>
  <div :class="{ big, transparent }" class="app-element-grid-logos-bloc">
    <AtomsCornerPoints :size-points="6" position="1,2,3,4" />
    <nuxt-img
      v-if="!transparent"
      ref="img"
      format="webp"
      :src="src"
      alt="test"
    />
    <SvgYou v-if="transparent" class="app-element-grid-logos-bloc__you" />

    <span
      v-if="!transparent"
      ref="overlay"
      :style="{
        'background-color': isBlue
          ? `var(--c-blue-adidas)`
          : `var(--c-red-adidas)`,
      }"
      class="app-element-grid-logos-bloc__overlay"
    />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    big: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: '',
    },
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isBlue() {
      return Math.random() > 0.5
    },
  },
  beforeDestroy() {
    this.tl?.kill()
  },
  mounted() {
    if (this.transparent) return

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.$el,
        start: 'top bottom',
        toggleActions: 'play none none none',
      },
    })

    this.tl.set(this.$refs.img.$el, {
      opacity: 0,
    })

    this.tl.fromTo(
      this.$refs.overlay,
      {
        scaleY: 0,
      },
      {
        delay: 0.25,
        scaleY: 1,
        duration: 0.375,
        ease: 'power4.out',
        transformOrigin: 'top center',
      }
    )

    this.tl.set(this.$refs.img.$el, {
      opacity: 1,
    })

    this.tl.to(this.$refs.overlay, {
      scaleY: 0,
      duration: 0.45,
      ease: 'power4.out',
      transformOrigin: 'bottom center',
    })
  },
}
</script>

<style lang="scss">
.app-element-grid-logos-bloc {
  aspect-ratio: 128 / 128;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c-white);
  cursor: pointer;

  &.transparent {
    &:hover {
      .app-element-grid-logos-bloc__you {
        transform: scale(1);
      }
    }
  }

  &__you {
    width: 50%;
    transform: scale(0);
    transition: transform 0.3s var(--ease-in-out-cubic);
  }

  .app-atoms-corner-points {
    outline: 1px solid var(--border-color) !important;
    border: none !important;
  }

  img {
    width: 50%;
    height: auto;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleY(0);
  }

  &.transparent {
    @include fake-transparent();
  }

  &.big {
    aspect-ratio: 256 / 256;
  }
}
</style>
