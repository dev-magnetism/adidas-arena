<script>
import JSSoup from 'jssoup'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { decode } from 'html-entities'

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
    overflow: {
      type: Boolean,
      default: false,
      require: true,
    },
    scrub: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  computed: {
    // processedHtml() {
    //   return {
    //     template:
    //       '<div class="app-element-rich-text">' +
    //       this.soup.prettify() +
    //       '</div>',
    //   }
    // },
  },

  watch: {
    $el: {
      deep: true,
      handler() {
        console.log('init $el')

        // document.fonts.ready.then(() => {
        //   if (!this.split) return
        //   console.log('init split watch')

        //   this.initSplitText()
        // })
      },
    },
  },

  created() {
    // this.soup = new JSSoup(this.content)
  },

  mounted() {
    document.fonts.ready.then(() => {
      if (!this.split) return

      console.log('init split')

      this.initSplitText()
    })
  },

  methods: {
    initSplitText() {
      console.log('$el', this)

      Object.values(this.$el.children).forEach((child) => {
        console.log('child foreach', child)
        if (this.overflow) {
          this.splitting = new SplitText(child, {
            type: 'lines',
            linesClass: 'H1__child line',
          })

          this.splittingParent = new SplitText(child, {
            type: 'lines',
            linesClass: 'H1__parent',
          })
        } else {
          this.splitting = new SplitText(child, {
            type: 'lines',
            linesClass: 'line',
          })
        }

        console.log('splitting', this.splitting)

        let scrollTrigger

        if (this.scrub) {
          scrollTrigger = {
            trigger: child,
            start: 'top bottom',
            end: 'center center',
            scrub: 0.5,
          }
        } else {
          scrollTrigger = {
            trigger: child,
            start: 'top bottom',
            end: 'center center',
            toggleActions: 'play none none none',
          }
        }

        gsap.fromTo(
          this.splitting.lines,
          {
            yPercent: this.overflow ? -100 : 100,
          },
          {
            yPercent: 0,
            stagger: 0.08,
            delay: this.scrub ? 0 : 0.2,
            duration: 0.85,
            ease: 'expo.out',
            scrollTrigger,
          }
        )
      })
    },
  },
  render(h) {
    const soup = new JSSoup(this.content)

    const lotties = soup.findAll(undefined, 'lottie-word')
    const texts = soup.findAll(undefined, 'wysiwyg-text')
    const strokeTexts = soup.findAll('em')
    const boldTexts = soup.findAll('strong')

    texts.forEach((text) => {
      const componentName = text.attrs.class
        .replace('wysiwyg-text', '')
        .replace(/ /g, '')

      text.name = `T${componentName}`

      delete text.attrs.class
      delete text.attrs.style

      text.attrs.class = 'wysiwyg-text'
    })

    boldTexts.forEach((text) => {
      const string = text.getText()

      const stringDecode = decode(string)

      const finalString = stringDecode.replace(/\S+/g, (a, b, c) => {
        return `<span class="bold">` + a + '</span>'
      })

      text.replaceWith(finalString)

      delete text.attrs.style
      delete text.attrs.class
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

    return h({
      template:
        '<div class="app-element-rich-text">' +
        '<TH2> Test </TH2>' +
        this.content +
        '</div>',
    })
  },
}
</script>

<style lang="scss">
.app-element-rich-text {
  & > .H1,
  & > .H2 {
    // display: block;
  }
  .line {
    // display: inline-block !important;
  }

  strong,
  .bold {
    // display: inline-block !important;
  }
}
</style>
