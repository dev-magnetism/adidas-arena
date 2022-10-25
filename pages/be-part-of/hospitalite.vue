<template>
  <main class="page-be-part-of-hospitalite">
    <ETwoColumnsStick
      :left-content="contentTwoColumns.left"
      :right-content="contentTwoColumns.right"
    />
    <AppBepartofHospitalitePresentation :contents="contentPresentation" />
    <ESlider :contents="contentSlider" />
    <AppContactQuestion :contents="contentContactQuestion" />
    <AppContactNewsletter :contents="contentContactNewsletter" />
    <AppFooter :contents="app" />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    const content = await $directus.items('Hospitalite_page').readByQuery({
      limit: -1,
    })

    const slider = await $directus.items('Hospitalite_slider').readByQuery({
      limit: -1,
    })

    return {
      app,
      content,
      slider,
    }
  },
  data() {
    return {}
  },

  computed: {
    contentTwoColumns() {
      return {
        left: this.content.data.two_columns_left,
        right: this.content.data.two_columns_right,
      }
    },
    contentPresentation() {
      return {
        title: this.content.data.presentation_title,
        picture: {
          src: this.content.data.presentation_picture,
          alt: this.content.data.presentation_picture_alt,
        },
        pictureFramed: {
          src: this.content.data.presentation_picture_framed,
          alt: this.content.data.presentation_picture_framed_alt,
        },
        paragraphTitle: this.content.data.presentation_paragraph_title,
        paragraph: this.content.data.presentation_paragraph,
      }
    },
    contentSlider() {
      return {
        title: this.content.data.slider_title,
        items: this.slider.data,
      }
    },
    contentContactQuestion() {
      return {
        title: this.content.data.contact_question,
      }
    },
    contentContactNewsletter() {
      return {
        title: this.content.data.contact_newsletter,
        placeholder: this.app.data.footer_input_placeholder,
      }
    },
  },

  mounted() {
    console.log('test slider', this.slider)
  },
}
</script>

<style lang="scss">
.page-be-part-of-hospitalite {
  .app-two-columns-stick {
    .app-element-lottie-word {
      &.Trait_2 svg {
        position: absolute;
        left: 50%;
        width: 100%;
        height: auto !important;
        bottom: -35px;
        transform: translateX(-50%) !important;
      }
      &.Cercle_1 svg {
        position: absolute;
        width: 135% !important;
        height: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(5deg) !important;
      }
    }
  }
  .app-contact-question {
    margin-top: desktop-vw(150px);
  }
  .app-contact-newsletter {
    margin-bottom: desktop-vw(180px);
  }
}
</style>
