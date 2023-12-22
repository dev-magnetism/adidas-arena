<script>
import { mapState } from 'vuex'
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
    tag: {
      type: String,
      require: false,
      default: null,
    },
  },
  computed: {
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
    }),
  },
  mounted() {
    document.fonts.ready.then(() => {
      if (!this.split || this.$viewport.isMobile) return

      this.initSplitText()
    })
  },

  methods: {
    initSplitText() {
      Object.values(this.$el.children).forEach((child) => {
        if (this.overflow) {
          this.splitting = new SplitText(child, {
            type: 'lines',
            linesClass: 'line-child line',
          })

          this.splittingParent = new SplitText(child, {
            type: 'lines',
            linesClass: 'line-parent',
          })
        } else {
          this.splitting = new SplitText(child, {
            type: 'lines',
            linesClass: 'line',
          })
        }

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

        if (this.splitting.lines.length) {
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
        }
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
    const soup = new JSSoup(this.content)

    const lotties = soup.findAll(undefined, 'lottie-word')
    const texts = soup.findAll(undefined, 'wysiwyg-text')
    const strokeTexts = soup.findAll(undefined, 'wysiwyg-stroke')
    const strongTexts = soup.findAll('strong')

    strongTexts.forEach((text) => {
      delete text.attrs.class
      delete text.attrs.style
    })


    texts.forEach((text) => {
      const componentName = text.attrs.class
        .replace('wysiwyg-text', '')
        .replace(/ /g, '')

      text.name = `T${componentName}`

      if (this.tag === null && componentName.includes('P')) {
        text.attrs.tag = 'p'
      } else if (this.tag === null) {
        text.attrs.tag = componentName
      } else {
        text.attrs.tag = this.tag
      }

      delete text.attrs.class
      delete text.attrs.style
      text.attrs.class = 'wysiwyg-text'
    })

    strokeTexts.forEach((text) => {
      delete text.attrs.style
    })

    lotties.forEach((lottie) => {
      lottie.name = 'ELottieWord'
      lottie.attrs.class += ` ${lottie.attrs.id}`

      delete lottie.attrs.style
    })

    return h({
      template:
        '<div class="app-element-rich-text">' + soup.prettify() + '</div>',
    })
  },
}
</script>

<style lang="scss">
.app-element-rich-text {
  .line-child {
    display: inline-block !important;
  }

  .line-parent {
    overflow: hidden;
    // display: inline-block !important;
  }

  strong,
  em,
  span {
    display: inline-block !important;
  }
}
</style>
