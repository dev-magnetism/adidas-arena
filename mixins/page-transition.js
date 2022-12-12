import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


export default {
  basic: {
    css: false,
    mode: 'out-in',
    enter(el, done) {
      done()
    },
    leave(el, done) {
      const layerBlue = document.querySelector('.app-transition-layer.blue')
      const layerRed = document.querySelector('.app-transition-layer.red')

      this.tl = gsap
        .timeline({
          delay: 0.35,
        })
        .fromTo(
          layerBlue,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power3.inOut',
          }
        )
        .fromTo(
          layerRed,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {


              this.$nuxt.$emit('menu:reset')

              ScrollTrigger.getAll().forEach((t) => t.kill())

              done()
            },
          },
          '<10%'
        )
        .to([layerRed, layerBlue], {
          scaleY: 0,
          transformOrigin: 'center bottom',
          duration: 0.85,
          delay: 0.45,
          ease: 'power3.inOut',
        })
        .set([layerRed, layerBlue], {
          transformOrigin: 'center top',
        })
    },
  },
}
