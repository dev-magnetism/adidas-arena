import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  basic: {
    css: false,
    mode: 'out-in',
    enter(el, done) {
      console.log('here enter', this.$route.name)

      if (this.$route.name.includes('index')) {
        this.$nuxt.$emit('reset:exterior')
      }

      // if (this.$route.name.includes('arena')) {
      //   this.$nuxt.$emit('reset:exterior')
      // }
      if (this.$route.name.includes('arena')) {
        this.$nuxt.$emit('reset:interior')
      }

      if (this.$route.name.includes('le-bloc')) {
        this.$nuxt.$emit('reset:interior')
      }

      if (this.$route.name.includes('be-part-of-guests')) {
        this.$nuxt.$emit('reset:interior')
      }

      done()
    },
    leave(el, done) {
      const layerBlue = document.querySelector('.app-transition-layer.blue')
      const layerRed = document.querySelector('.app-transition-layer.red')

      console.log('here leave', this.$route.name)

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
              this.$store.commit('setHeaderWhite', false)
              this.$store.commit('setHeaderReduced', false)
              this.$store.commit('setCursorState', 'hide')

              if (
                this.$route.name.includes('projet') ||
                this.$route.name.includes('be-part-of-partenariat') ||
                this.$route.name.includes('be-part-of-besoins')
              ) {
                this.$store.commit('setExteriorVisible', false)
                this.$store.commit('setInteriorVisible', false)
              }

              console.log(this.$route.name)

              if (
                this.$route.name.includes('le-bloc') ||
                this.$route.name.includes('be-part-of-guests') ||
                this.$route.name.includes('arena')
              ) {
                this.$store.commit('setExteriorVisible', false)
              }

              if (this.$route.name.includes('index')) {
                this.$store.commit('setInteriorVisible', false)
              }
              // if (
              //   this.$route.name.includes('index') ||
              //   this.$route.name.includes('arena')
              // ) {
              //   this.$store.commit('setInteriorVisible', false)
              // }

              console.log('transition full done', this.$route.name)

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
