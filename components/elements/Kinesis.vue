<template>
  <div class="app-element-kinesis">
    <slot />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    speed: {
      type: Number,
      default: 65,
    },
  },
  mounted() {
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.kill()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        console.log(context)
        context.add('onMouseMove', (e) => {
          const x = (e.clientX / this.$viewport.width - 0.5) * 2 * this.speed
          const y = (e.clientY / this.$viewport.height - 0.5) * 2 * this.speed

          gsap.to(this.$el, {
            x,
            y,
            duration: 1,
            ease: 'expo.out',
          })
        })

        window.addEventListener('mousemove', context.onMouseMove)

        return () => {
          window.removeEventListener('mousemove', context.onMouseMove)
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-element-kinesis {
  width: 100%;
  height: 100%;
  will-change: transform;
}
</style>
