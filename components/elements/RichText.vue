<template>
  <component :is="processedHtml" ref="component"></component>
</template>

<script>
import JSSoup from 'jssoup'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

export default {
  props: {
    content: {
      type: String,
      default: '',
      require: true,
    },
    split: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  computed: {
    processedHtml() {
      const lotties = this.soup.findAll(undefined, 'lottie-word')
      const texts = this.soup.findAll(undefined, 'wysiwyg-text')
      const strokeTexts = this.soup.findAll('em')
      const boldTexts = this.soup.findAll('strong')

      texts.forEach((text) => {
        const componentName = text.attrs.class
          .replace('wysiwyg-text', '')
          .replace(/ /g, '')

        text.name = `T${componentName}`

        delete text.attrs.style
        delete text.attrs.class
      })

      boldTexts.forEach((text) => {
        text.name = `span`

        delete text.attrs.style
        delete text.attrs.class

        text.attrs.class = 'bold'
      })

      strokeTexts.forEach((text) => {
        text.name = `AtomsTextStroke`

        delete text.attrs.style
        delete text.attrs.class
      })

      lotties.forEach((lottie) => {
        lottie.name = 'ELottieWord'
        lottie.attrs.class = lottie.attrs.id

        delete lottie.attrs.style
      })

      return {
        template:
          '<div class="app-element-rich-text">' +
          this.soup.prettify() +
          '</div>',
      }
    },
  },
  created() {
    this.soup = new JSSoup(this.content)
  },
  mounted() {
    document.fonts.ready.then(() => {
      if (!this.split) return

      this.initSplitText()
    })
  },
  methods: {
    initSplitText() {
      this.splitting = new SplitText(this.$refs.component.$children[0].$el, {
        type: 'lines',
        linesClass: 'H1__child line',
      })

      gsap.fromTo(
        this.splitting.lines,
        {
          yPercent: 100,
          // opacity: 0,
        },
        {
          yPercent: 0,
          stagger: 0.1,
          opacity: 1,
          // duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: this.$el,
            start: 'top bottom',
            end: 'center center',
            // toggleActions: 'play none none reset',
            // markers: true,
            scrub: 0.5,
          },
        }
      )
    },
  },
}
</script>
