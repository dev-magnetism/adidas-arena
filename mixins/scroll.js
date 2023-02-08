import { mapState, mapMutations } from 'vuex'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
      allLoadedFake: (state) => state.allLoadedFake,
      preloaderHidden: (state) => state.preloaderHidden,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      overlayContactOpen: (state) => state.overlayContactOpen,
      popinNewsletterOpen: (state) => state.popinNewsletterOpen,
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
    popinNewsletterOpen(payload) {
      if (!this.lenis) return

      if (payload) {
        this.lenis.stop()
      } else {
        this.lenis.start()
      }
    },
    overlayContactOpen(payload) {
      if (!this.lenis) return

      if (payload) {
        this.lenis.stop()
      } else {
        this.lenis.start()
      }
    },
    preloaderHidden(payload) {
      if (!this.lenis) return

      if (payload) {
        this.lenis.start()
      }
    },
  },
  mounted() {
    window.scrollTo(0, 0)

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothTouch: true,
      touchMultiplier: 3,
    })

    // this.lenis = new Lenis({
    //   duration: 1.2,
    //   easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    //   direction: 'vertical',
    //   gestureDirection: 'vertical',
    //   smooth: true,
    // })

    if (!this.allLoadedFake) this.lenis.stop()

    this.lenis.on('scroll', this.onScrollLenis)

    window.lenis = this.lenis

    ScrollTrigger.refresh()

    this.$raf.add(`scroller-${this._uid}`, this.onFrame, -1)
  },
  beforeDestroy() {
    this.$raf.remove(`scroller-${this._uid}`, this.onFrame)

    this.lenis.destroy()

    window.lenis = null
  },
  methods: {
    onScrollLenis(args) {
      ScrollTrigger.update()

      if (!this.$viewport.isMobile) {
        if (Math.abs(args.scroll) >= 50) {
          this.setHeaderReduced(true)
        } else {
          this.setHeaderReduced(false)
        }
      }

      this.$nuxt.$emit('app:scroll', { ...args })
    },
    onFrame({ time, deltaTime }) {
      this.lenis.raf(time * 1000)
    },
    ...mapMutations({
      setHeaderReduced: 'setHeaderReduced',
    }),
  },
}
