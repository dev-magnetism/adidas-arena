<script>
import { mapState } from 'vuex'
import JSSoup from 'jssoup'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import TH1 from '@/components/texts/H1.vue'
import TH2 from '@/components/texts/H2.vue'
import TH2Bis from '@/components/texts/H2Bis.vue'
import TH3 from '@/components/texts/H3.vue'
import TH4 from '@/components/texts/H4.vue'
import TH5 from '@/components/texts/H5.vue'
import TP1 from '@/components/texts/P1.vue'
import TP2 from '@/components/texts/P2.vue'
import ELottieWord from '@/components/elements/LottieWord.vue'

const TEXT_COMPONENTS = {
  TH1,
  TH2,
  TH2Bis,
  TH3,
  TH4,
  TH5,
  TP1,
  TP2,
  ELottieWord,
}

const TEXT_TYPES = ['H2Bis', 'H1', 'H2', 'H3', 'H4', 'H5', 'P1', 'P2']
const TYPE_RE = /\b(H2Bis|H1|H2|H3|H4|H5|P1|P2)\b/

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
      if (!this.split || this.$viewport.isMobile || this.splitting) return

      this.initSplitText()
    })
  },

  methods: {
    getTypeFromClass(cls) {
      if (!cls || typeof cls !== 'string') return null
      const match = cls.match(TYPE_RE)
      return match ? match[1] : null
    },

    collectTextNodes(soup) {
      const seen = new Set()
      const nodes = []
      const classes = ['wysiwyg-text', ...TEXT_TYPES]
      classes.forEach((cls) => {
        soup.findAll(undefined, cls).forEach((el) => {
          if (seen.has(el)) return
          seen.add(el)
          nodes.push(el)
        })
      })
      return nodes
    },

    buildTemplate() {
      try {
        const soup = new JSSoup(this.content || '')

        const lotties = soup.findAll(undefined, 'lottie-word')
        const texts = this.collectTextNodes(soup)
        const strokeTexts = soup.findAll(undefined, 'wysiwyg-stroke')
        const strongTexts = soup.findAll('strong')

        strongTexts.forEach((text) => {
          if (!text.attrs) return
          delete text.attrs.class
          delete text.attrs.style
        })

        texts.forEach((text) => {
          if (!text.attrs) text.attrs = {}
          const type =
            this.getTypeFromClass(text.attrs.class) ||
            (text.name && TEXT_TYPES.includes(text.name) ? text.name : null)

          if (!type) return

          text.name = `T${type}`

          if (this.tag === null && type.includes('P')) {
            text.attrs.tag = 'p'
            if (!text.attrs.weight) text.attrs.weight = 'regular'
          } else if (this.tag === null) {
            text.attrs.tag = type === 'H2Bis' ? 'h2' : type.toLowerCase()
          } else {
            text.attrs.tag = this.tag
          }

          delete text.attrs.style
          text.attrs.class = 'wysiwyg-text'
        })

        strokeTexts.forEach((text) => {
          if (text.attrs) delete text.attrs.style
        })

        lotties.forEach((lottie) => {
          if (!lottie.attrs) lottie.attrs = {}
          lottie.name = 'ELottieWord'
          lottie.attrs.class = `${lottie.attrs.class || ''} ${
            lottie.attrs.id || ''
          }`.trim()
          delete lottie.attrs.style
        })

        return (
          '<div class="app-element-rich-text"><template v-once>' +
          soup.prettify() +
          '</template></div>'
        )
      } catch (error) {
        console.error('[RichText] parse error', error)
        return '<div class="app-element-rich-text"></div>'
      }
    },

    getInnerCtor() {
      const template = this.buildTemplate()
      if (this._rtTemplate === template && this._rtCtor) return this._rtCtor
      this._rtTemplate = template
      this.splitting = null
      this._rtCtor = {
        name: 'ERichTextInner',
        components: TEXT_COMPONENTS,
        template,
      }
      return this._rtCtor
    },

    initSplitText() {
      const children = Object.values(this.$el.children || {})
      children.forEach((child) => {
        if (!child || child.nodeType !== 1) return

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
    return h(this.getInnerCtor())
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
