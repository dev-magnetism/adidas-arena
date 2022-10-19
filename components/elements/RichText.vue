<script>
// import JSSoup from 'jssoup'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
// import { decode } from 'html-entities'
// import { parse } from 'node-html-parser'
import { html2json, json2html } from 'html2json'
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
  computed: {},

  created() {},

  mounted() {
    document.fonts.ready.then(() => {
      if (!this.split) return

      this.initSplitText()
    })
  },

  methods: {
    initSplitText() {
      Object.values(this.$el.children).forEach((child) => {
        if (this.overflow) {
          this.splitting = this.nestedLinesSplit(child, {
            type: 'lines',
            linesClass: 'H1__child line',
          })

          this.splittingParent = this.nestedLinesSplit(child, {
            type: 'lines',
            linesClass: 'H1__parent',
          })
        } else {
          this.splitting = this.nestedLinesSplit(child, {
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
        i += insertAt(children, this.nestedLinesSplit(child, vars).lines, i) - 1
      }
    }
    return split
  },
  render(h) {
    const contentJson = html2json(this.content)

    contentJson.child.forEach((json) => {
      const componentName = json.attr.class[0]

      delete json.attr.class[0]

      json.tag = `T${componentName}`
      delete json.attr.style

      json.child.forEach((child) => {
        if (child.tag === 'em') {
          child.tag = `AtomsTextStroke`

          delete child.attr?.style
          delete child.attr?.class
        } else if (child.tag === 'strong') {
          child.tag = `span`
          child.attr = { class: ['bold'] }
        } else if (child.tag === 'span' && child.attr.id) {
          child.tag = 'ELottieWord'
          child.attr.class = ['lottie-word', child.attr.id]

          delete child.attr?.style
        }
      })
    })

    return h({
      template:
        '<div class="app-element-rich-text">' +
        json2html(contentJson) +
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
