// import Vue from 'vue'

import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
// import { VelocityTracker } from 'gsap/utils/VelocityTracker'
// import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
// import { Observer } from 'gsap/Observer'

gsap.config({
  force3D: true,
})

gsap.registerPlugin(
  //   ScrollSmoother,
  //   Flip,
  //   VelocityTracker,
  SplitText,
  //   Observer,
  ScrollTrigger
)

// Vue.prototype.$gsap = gsap
