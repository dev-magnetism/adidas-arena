import Vue from 'vue'
import { gsap } from 'gsap'

const raf = new Vue({
  data() {
    return {
      rafs: {},
    }
  },
  created() {
    if (!process.client) return

    gsap.ticker.add((time, deltaTime, frame) => {
      const deltaRatio = gsap.ticker.deltaRatio()
      Object.values(this.rafs)
        .sort((a, b) => a.priority - b.priority)
        .forEach(({ callback, once, id }) => {
          const args = { time, deltaTime, frame, deltaRatio }
          callback(args)

          if (once) {
            this.remove(id, callback)
          }
        })
    })
  },
  beforeDestroy() {
    delete this.rafs
  },
  methods: {
    add(id, callback, priority = 0, once = false) {
      if (typeof callback !== 'function') {
        console.error('add() : Callback argument must be a function')
      } else if (this.rafs[id]) {
        console.error(`id : This id: ${id} is already used`)
      } else {
        this.rafs[id] = { id, callback, priority, once }
      }
    },
    remove(id, callback) {
      if (typeof callback !== 'function') {
        console.error('add() : Callback argument must be a function')
      } else if (!this.rafs[id]) {
        console.error(`id: This id : ${id} doesn't exist`)
      } else {
        delete this.rafs[id]
      }
    },
  },
})

Vue.prototype.$raf = raf

export default raf
