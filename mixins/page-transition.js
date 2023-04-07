import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import useWebGL from '~/hooks/webgl'

export default {
  basic: {
    css: false,
    mode: 'out-in',
    enter(el, done) {
      if (this.$route.name.includes('index')) {
        this.$nuxt.$emit('reset:exterior')
      }

      if (this.$route.name.includes('arena')) {
        this.$nuxt.$emit('reset:interior')
      }

      if (this.$route.name.includes('le-bloc')) {
        this.$nuxt.$emit('reset:interior')
      }

      if (this.$route.name.includes('be-part-of-guests')) {
        this.$nuxt.$emit('reset:interior')
      }

      if (
        this.$route.name.includes('mentions-legales') ||
        this.$route.name.includes('cookies') ||
        this.$route.name.includes('communique-de-presse')
      ) {
        this.$store.commit('setHeaderHide', true)
      } else {
        this.$store.commit('setHeaderHide', false)
      }

      done()
    },
    leave(el, done) {
      this.$store.commit('setAllowScroll', false)
      this.$store.commit('setWebglInFront', false)
      this.$store.commit('setAppCursor', 'initial')

      const layerBlue = document.querySelector('.app-transition-layer.blue')
      const layerRed = document.querySelector('.app-transition-layer.red')

      gsap
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

              if (
                this.$route.name.includes('projet') ||
                this.$route.name.includes('be-part-of-partenariat') ||
                this.$route.name.includes('be-part-of-besoins') ||
                this.$route.name.includes('programmation')
              ) {
                this.$store.commit('setExteriorVisible', false)
                this.$store.commit('setInteriorVisible', false)
              }

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
  fromIndexToArena: {
    css: false,
    mode: 'out-in',
    enter(el, done) {
      const { layerPass, camera } = useWebGL()

      gsap
        .timeline({
          onComplete: () => {
            // done()
          },
        })
        .addLabel('step-0')
        .fromTo(
          camera,
          { zoom: 25 },
          {
            zoom: this.$viewport.isMobile ? 8 : 12,
            duration: 1.25,
            ease: 'power2.inOut',
            onUpdate: () => {
              camera.updateProjectionMatrix()
            },
          },
          'step-0'
        )

        .addLabel('step-1', '<10%')
        .fromTo(
          el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'step-1'
        )
        .fromTo(
          layerPass.material.uniforms.uOpacity,
          {
            value: 1,
          },
          {
            value: 0,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'step-1'
        )

      done()
    },
    leave(el, done) {
      this.$store.commit('setAllowScroll', false)
      this.$store.commit('setWebglInFront', false)

      const { layerPass, camera } = useWebGL()

      const params = {
        duration: 1.65,
        ease: 'power3.inOut',
      }

      gsap
        .timeline({
          delay: 0.35,
          onComplete: () => {
            this.$store.commit('setHeaderWhite', false)
            this.$store.commit('setHeaderReduced', false)
            this.$store.commit('setCursorState', 'hide')

            this.$store.commit('setExteriorVisible', false)

            this.$nuxt.$emit('menu:reset')

            ScrollTrigger.getAll().forEach((t) => t.kill())

            done()
          },
        })
        .addLabel('step-0')
        .fromTo(
          el,
          {
            opacity: 1,
          },
          {
            opacity: 0,
            duration: 1,
            ease: 'power3.inOut',
          },
          'step-0'
        )
        .to(
          camera.position,
          {
            y: 122,
            ...params,
          },
          'step-0'
        )
        .to(
          camera,
          {
            zoom: 35,
            ...params,
            onUpdate: () => {
              camera.updateProjectionMatrix()
            },
          },
          'step-0'
        )
        .addLabel('step-1', '<25%')
        .fromTo(
          layerPass.material.uniforms.uOpacity,
          {
            value: 0,
          },
          {
            value: 1,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          'step-1'
        )
    },
  },
}
