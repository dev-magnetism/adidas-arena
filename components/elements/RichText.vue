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
      this.$refs.component.$children.forEach((child) => {
        if (this.overflow) {
          this.splittingParent = this.nestedLinesSplit(child.$el, {
            type: 'lines',
            linesClass: 'H1__parent',
          })

          this.splitting = this.nestedLinesSplit(child.$el, {
            type: 'lines',
            linesClass: 'H1__child line',
          })
        } else {
          this.splitting = this.nestedLinesSplit(child.$el, {
            type: 'lines',
            linesClass: 'line',
          })
        }

        let scrollTrigger

        if (this.scrub) {
          scrollTrigger = {
            trigger: child.$el,
            start: 'top bottom',
            end: 'center center',
            scrub: 0.5,
          }
        } else {
          scrollTrigger = {
            trigger: child.$el,
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
    nestedLinesSplit(target, vars) {
      const split = new SplitText(target, vars)
      const words = vars.type.includes('words')
      const chars = vars.type.includes('chars')
      const insertAt = function (a, b, i) {
        const l = b.length

        for (let j = 0; j < l; j++) {
          a.splice(i++, 0, b[j])
        }
        return l
      }

      let children
      let child
      let i

      if (typeof target === 'string') {
        target = document.querySelectorAll(target)
      }
      if (target.length > 1) {
        for (i = 0; i < target.length; i++) {
          split.lines = split.lines.concat(
            this.nestedLinesSplit(target[i], vars).lines
          )
        }
        return split
      }

      children = (words ? split.words : []).concat(chars ? split.chars : [])
      for (i = 0; i < children.length; i++) {
        children[i]._protect = true
      }

      children = split.lines
      for (i = 0; i < children.length; i++) {
        child = children[i].firstChild
        if (!child._protect && child.nodeType !== 3) {
          children[i].parentNode.insertBefore(child, children[i])
          children[i].parentNode.removeChild(children[i])
          children.splice(i, 1)
          i +=
            insertAt(children, this.nestedLinesSplit(child, vars).lines, i) - 1
        }
      }
      return split
    },
  },
  render(h) {
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
        '<div class="app-element-rich-text">' + this.soup.prettify() + '</div>',
    })
  },
}
</script>

<style lang="scss">
.app-element-rich-text {
  & > .H1 {
    //   font-size: min(130px, desktop-vw(130px)) !important;
    // line-height: min(140px, desktop-vw(140px)) !important;
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
