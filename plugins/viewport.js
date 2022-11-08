import Events from 'events'
import Vue from 'vue'

/* eslint-disable nuxt/no-globals-in-created */

const viewport = new Vue({
  data() {
    if (!process.client) return {} // for nuxt.js

    return {
      isMobile: window.innerWidth < 800,
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight,
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
      this.isMobile = window.innerWidth < 800

      this.events.emit('resize', this.$data)
    },
  },
})

Vue.prototype.$viewport = viewport

export default viewport
