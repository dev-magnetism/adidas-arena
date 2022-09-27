<template>
  <component :is="processedHtml"></component>
</template>

<script>
import JSSoup from 'jssoup'

export default {
  props: {
    content: {
      type: String,
      default: '',
      require: true,
    },
  },
  computed: {
    processedHtml() {
      const lotties = this.soup.findAll(undefined, 'lottie-word')
      const texts = this.soup.findAll(undefined, 'wysiwyg-text')
      const strokeTexts = this.soup.findAll('em')

      texts.forEach((text) => {
        const componentName = text.attrs.class
          .replace('wysiwyg-text', '')
          .replace(/ /g, '')

        text.name = `T${componentName}`

        const soupStrong = text.find('strong')

        if (soupStrong) {
          text.attrs.weight = 'bold'

          soupStrong.replaceWith(soupStrong.nextElement)
        }

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
}
</script>
