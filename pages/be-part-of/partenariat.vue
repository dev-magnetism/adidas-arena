<template>
  <main class="page-be-part-of-partenaire">
    <!-- <AppGallery :contents="contentGallerie" /> -->
    <AppBepartofPartenaireIntroduction :contents="contentIntroduction" />
    <AppBepartofPartenairePartenaires :contents="contentPartners" />
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
  async asyncData({ $directus, $seo, store }) {
    const content = await $directus.items('Partenaire_page').readByQuery({
      limit: -1,
    })

    const gallerie = await $directus.items('Gallerie').readByQuery({
      limit: -1,
    })

    $seo({
      title: content.data.page_title,
      description: content.data.page_description_seo,
      openGraph: {
        title: store.state.appContent.data.seo_title,
        description: content.data.page_description_seo,
      },
      twitter: {
        title: store.state.appContent.data.seo_title,
        description: content.data.page_description_seo,
      },
    })

    const galerieTest = await $directus
      .items('Galerie_partenaire')
      .readByQuery({
        limit: -1,
      })

    return {
      content,
      gallerie,
      galerieTest,
    }
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
    contentGallerie() {
      return {
        items: this.gallerie.data,
      }
    },
    contentPartners() {
      return {
        title: this.content.data.partenaires_title,
        list: this.partnersContent.data,
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
    contentIntroduction() {
      return {
        title: this.content.data.introduction_title,
        subtitle: this.content.data.introduction_subtitle,
        secondTitle: this.content.data.introduction_second_title,
        secondSubtitle: this.content.data.introduction_second_subtitle,
        picture: {
          src: this.content.data.introduction_picture,
          alt: this.content.data.introduction_picture_alt,
        },
        pictureFramed: {
          src: this.content.data.introduction_picture_framed,
          alt: this.content.data.introduction_picture_framed_alt,
        },
      }
    },
  },

  mounted() {
    // console.log(this.galerieTest)
  },
}
</script>

<style lang="scss">
.page-be-part-of-partenaire {
  margin-top: desktop-vw(300px);

  .app-contact-question {
    margin-top: desktop-vw(280px);

    &__title.app-element-rich-text {
      grid-column: 2 / span 10;

      @include mobile {
        grid-column: 1 / span 6;
      }

      .app-element-lottie-word.Cercle_3 svg {
        position: absolute;
        width: 135% !important;
        height: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(5deg) !important;
      }

      .app-element-lottie-word.Croix_01 {
        svg {
          position: absolute;
          left: 0;
          width: 100%;
          height: 60% !important;
          width: auto !important;
          right: 0;
          left: initial;
          transform: translate(50%, 20%) !important;
          bottom: 0;
        }
      }
    }
  }
  .app-contact-newsletter {
    margin-bottom: desktop-vw(180px);

    @include mobile {
      margin-bottom: mobile-vw(100px);
    }
  }
}
</style>
