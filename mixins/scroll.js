import { mapState } from 'vuex'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
    }),
  },
  watch: {
    menuActive(payload) {
      if (!this.lenis) return

      if (payload) {
        this.lenis.stop()
      } else {
        this.lenis.start()
      }
    },
  },
  mounted() {
    window.scrollTo(0, 0)

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    })

    this.lenis.on('scroll', this.onScrollLenis)

    window.lenis = this.lenis

    ScrollTrigger.refresh()

    this.$raf.add(`scroller-${this._uid}`, this.onFrame, 0)
  },
  beforeDestroy() {
    this.$raf.remove(`scroller-${this._uid}`, this.onFrame)

    this.lenis.destroy()

    // window.lenis = null
  },
  methods: {
    onScrollLenis(args) {
      this.$nuxt.$emit('app:scroll', { ...args })
    },
    onFrame({ time, deltaTime }) {
      this.lenis.raf(time * 1000)
    },
  },
}
