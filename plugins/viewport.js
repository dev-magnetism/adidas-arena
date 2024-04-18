import Events from 'events'
import Vue from 'vue'

/* eslint-disable nuxt/no-globals-in-created */

const viewport = new Vue({
  data() {
    if (!process.client) return {} // for nuxt.js

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight,
      isTabletOrMobile: null,
      isMobile: null,
      isTablet: null,
      isLandscape: null,
      isDesktop: null,
      isLargeDesktop: null,
      isFirefox: navigator.userAgent.toLowerCase().includes('firefox'),
    }
  },
  created() {
    if (!process.client) return // for nuxt.js

    this.events = new Events()
    this.events.setMaxListeners(50)
    this.onWindowResize()

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  },
  methods: {
    onWindowResize() {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.ratio = this.width / this.height

      this.isMobile = window.matchMedia('(max-width: 768px)').matches
      this.isTabletOrMobile = window.matchMedia('(max-width: 1024px)').matches
      this.isTablet =
        !this.isMobile && window.matchMedia('(max-width: 1024px)').matches
      this.isDesktop = window.matchMedia('(min-width: 1025px)').matches
      this.isLargeDesktop = window.matchMedia('(min-width: 1920px)').matches
      this.isLandscape = window.matchMedia('(orientation: landscape)').matches

      // console.log(
      //   this.isMobile,
      //   this.isTablet,
      //   this.isTabletOrMobile,
      //   this.isDesktop,
      //   this.isLandscape
      // )

      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      const vh = this.height * 0.01

      document.documentElement.style.setProperty('--vh', `${vh}px`)

      this.events.emit('resize', this.$data)
    },
  },
})

Vue.prototype.$viewport = viewport

export default viewport
