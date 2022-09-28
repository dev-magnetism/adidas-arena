// import Vue from 'vue'

import { gsap } from 'gsap'
// import { VelocityTracker } from 'gsap/utils/VelocityTracker'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Observer } from 'gsap/Observer'

gsap.config({
  force3D: true,
})

gsap.registerPlugin(
  Draggable,
  SplitText,
  Observer,
  ScrollTrigger,
  DrawSVGPlugin
)

// Vue.prototype.$gsap = gsap
