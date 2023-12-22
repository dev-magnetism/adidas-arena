<template>
  <div class="app-element-kinesis">
    <slot />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  props: {
    speed: {
      type: Number,
      default: 65,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  mounted() {
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()
    this.mm?.revert()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.scrollTrigger = ScrollTrigger.create({
          trigger: this.$el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (e) => {
            this.active = e.isActive
          },
        })

        context.add('onMouseMove', (e) => {
          if (!this.active) return

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
          this.active = false
          this.scrollTrigger?.kill()
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
