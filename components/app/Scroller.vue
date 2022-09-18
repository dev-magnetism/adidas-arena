<template>
  <div ref="scroller" class="app-scroller">
    <div ref="inner" class="app-scroller__inner">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import Lenis from '@studio-freight/lenis'

export default {
  computed: {},
  mounted() {
    window.scrollTo(0, 0)

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    this.lenis.on('scroll', this.onScroll)

    window.lenis = this.lenis
    this.setLenis(this.lenis)

    this.$raf.add('scroller', this.onFrame, 0)
  },
  beforeDestroy() {
    this.$raf.remove('scroller', this.onFrame)
  },
  methods: {
    onScroll(args) {
      this.$nuxt.$emit('app:scroll', { ...args })
    },
    onFrame({ time, deltaTime }) {
      this.lenis.raf(time * 1000)
    },
    ...mapMutations({
      setLenis: 'setLenis',
    }),
  },
}
</script>
