<template>
  <svg
    class="app-svg-sticker"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 127 128"
    xml:space="preserve"
  >
    <defs>
        <path id="circlePath" d="M 63.672, 64.09 m -42, 0 a 42,42 0 0,1 84,0 a 42,42 0 0,1 -84,0 "/>
    </defs>
    <circle cx="127" cy="128" r="64" fill="none"/>
    <g id="bg">
      <circle
        transform="rotate(-45.001 63.672 64.09)"
        cx="63.7"
        cy="64.1"
        fill="#e3530f"
        r="63.5"
      />
      <path
        d="M63.7 1.1c34.7 0 63 28.3 63 63s-28.3 63-63 63-63-28.3-63-63 28.2-63 63-63m0-1c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64S99 .1 63.7.1z"
        fill="#181818"
      />
    </g>
    <path
      d="M63.2 83.9c11 .1 19.9-8.8 20-19.8.1-11-8.8-19.9-19.8-20m-.2 39.8c-11-.1-19.8-9-19.8-20m19.8 20c5.6 0 10.2-8.9 10.2-19.8.1-11-4.4-19.9-10-19.9m-.2 39.7c-5.6 0-10.1-9-10-19.9.1-11 4.6-19.9 10.2-19.8m-20 19.7c.1-11 9-19.8 20-19.8m-20 19.8 40.1.2M50.9 48.3s13.2 6.1 24.9.1m-.1 31.3s-13.2-6.1-24.9-.1"
      fill="none"
      stroke="#181818"
    />
    <g ref="path">
      <use xlink:href="#circlePath" fill="none"/>
      <text fill="#181818">
          <textPath xlink:href="#circlePath">{{ content }}</textPath>
      </text>
    </g>
  </svg>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  mounted() {
    this.tween = gsap.to(this.$refs.path, {
      rotation: '360',
      repeat: -1,
      transformOrigin: 'center',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play pause resume reset',
      },
      ease: 'none',
      duration: 10,
    })

    if (!this.$viewport.isMobile) {
      this.scrollTrigger = ScrollTrigger.create({
        trigger: this.$el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity()) * 0.000015

          const progress = this.tween.progress() + velocity
          this.tween.progress(progress)
        },
      })
    }
  },
  beforeDestroy() {
    this.tween?.kill()

    this.scrollTrigger?.kill()
  },
  methods: {
    getStickerText() {
      const date = new Date()
      const year = date.getFullYear()
      const getSpaces = (nb) => '\u00A0'.repeat(nb)
      const getMonthText = (month, nbSpaces) => `${month} ${year}${getSpaces(nbSpaces)}${month} ${year}${getSpaces(nbSpaces)}${month} ${year}`

      const texts = [
        getMonthText('Janvier', 11),
        getMonthText('Février', 11),
        getMonthText('Mars', 15),
        getMonthText('Avril', 15),
        getMonthText('Mai', 18),
        getMonthText('Juin', 16),
        getMonthText('Juillet', 12),
        getMonthText('Août', 15),
        getMonthText('Septembre', 4),
        getMonthText('Octobre', 9),
        getMonthText('Novembre', 5),
        getMonthText('Décembre', 5)
      ]

      return texts[date.getMonth()]
    }
  },
  data() {
    return {
      content: this.getStickerText()
    }
  }
}
</script>

<style lang="scss">
.app-svg-sticker {
  #path {
    transform-origin: center;
  }

  #circlePath {
    transform-origin: center;
  }

  text {
    font-size: 16px;
    text-transform: uppercase;
    @include font-ITCFranklinGothicLT-BkCp();
    letter-spacing: -0.9px;
  }
}
</style>
