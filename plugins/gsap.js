// import Vue from 'vue'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Observer } from 'gsap/Observer'

gsap.config({
  force3D: true,
})

gsap.registerPlugin(Observer, ScrollTrigger, DrawSVGPlugin, SplitText)

// Vue.prototype.$gsap = gsap
