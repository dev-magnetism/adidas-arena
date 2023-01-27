<template>
  <main class="page-be-part-of-guests">
    <AppBepartofGuestsHero />
    <ETwoColumnsStick
      :left-content="contentTwoColumns.left"
      :right-content="contentTwoColumns.right"
    />
    <AppBepartofGuestsPresentation :contents="contentPresentation" />
    <ESlider :contents="contentSlider" />
    <AppContactQuestion :contents="contentContactQuestion" />
    <AppContactNewsletter :contents="contentContactNewsletter" />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Hospitalite_page').readByQuery({
      limit: -1,
    })

    const slider = await $directus.items('Hospitalite_slider').readByQuery({
      limit: -1,
    })

    return {
      content,
      slider,
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
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
        placeholder: this.appContent.data.footer_input_placeholder,
      }
    },
  },

  mounted() {},
}
</script>

<style lang="scss">
.page-be-part-of-guests {
  .app-two-columns-stick {
    @include mobile {
      row-gap: 20px;
    }
    .app-element-lottie-word {
      &.Trait_2 svg {
        position: absolute;
        left: 50%;
        width: 100%;
        height: auto !important;
        bottom: -75%;
        transform: translate(-50%, -50%) !important;

        @include mobile {
          bottom: -20px;
        }
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

    @include mobile {
      margin-bottom: mobile-vw(120px);
    }
  }
  .app-contact-newsletter {
    margin-bottom: desktop-vw(180px);

    @include mobile {
      margin-bottom: mobile-vw(120px);
    }
  }
}
</style>
